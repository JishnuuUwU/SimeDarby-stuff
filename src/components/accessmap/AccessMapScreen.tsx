import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AccessibilityFeatureType, MapMarkerFeature } from '../../types/accessibility';
import {
  Navigation,
  MapPin,
  CheckCircle2,
  Info,
  Compass,
  SlidersHorizontal,
  Maximize2,
  Volume2,
  X,
  Footprints,
  Clock,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Accessibility,
  CornerDownRight,
  Plus,
  Minus,
  Locate
} from 'lucide-react';
import { RoutePlannerModal } from './RoutePlannerModal';
import { TurnByTurnModal } from './TurnByTurnModal';

/* ------------------------------------------------------------------
   MAP LAYOUT SYSTEM
   Pins are anchored with township-stable percentages so toggling a
   layer never reshuffles the remaining pins. Captions are laid out in
   screen space, flipping or dropping when they would cover another
   caption or pin. Because pins are counter-scaled against the canvas
   zoom, zooming in genuinely frees up room for more captions.
------------------------------------------------------------------- */
type LabelSide = 'below' | 'above' | 'right' | 'left';

interface Rect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

interface MarkerAnchor {
  x: number;
  y: number;
}

interface LabelCandidate extends MarkerAnchor {
  id: string;
  label: string;
  priority: number;
}

const MARKER_DIAMETER = 40;
const MARKER_CLEARANCE = 22;   // pin radius + halo breathing room
const LABEL_GAP = 6;
const LABEL_HEIGHT = 18;
const LABEL_MAX_WIDTH = 132;
const LABEL_EDGE_PADDING = 6;
const LABEL_CHAR_WIDTH = 5.35; // 9.5px / 700 weight glyph estimate

const ZOOM_MIN = 1;
const ZOOM_STEP = 0.2;
const ZOOM_MAX = 2;

/* Stable spatial anchors per asset (percentages of the canvas). */
const MARKER_POSITIONS: Record<string, MarkerAnchor> = {
  // City of Elmina — lakeside mall, promenade, boardwalk, park
  feat_elmina_tactile_01: { x: 34, y: 15 },
  feat_elmina_lift_01: { x: 14, y: 27 },
  feat_elmina_ramp_01: { x: 21, y: 41 },
  feat_elmina_wc_01: { x: 45, y: 25 },
  feat_elmina_lift_02: { x: 66, y: 31 },
  feat_elmina_tactile_02: { x: 54, y: 51 },
  feat_elmina_ramp_02: { x: 77, y: 63 },
  feat_elmina_wc_02: { x: 85, y: 36 },

  // KL East — mall podium, transit walkway, forest park link
  feat_kleast_ramp_01: { x: 22, y: 20 },
  feat_kleast_lift_01: { x: 58, y: 25 },
  feat_kleast_tactile_01: { x: 37, y: 45 },
  feat_kleast_wc_01: { x: 72, y: 49 }
};

const FALLBACK_ANCHORS: MarkerAnchor[] = [
  { x: 26, y: 30 },
  { x: 70, y: 28 },
  { x: 38, y: 48 },
  { x: 62, y: 60 },
  { x: 46, y: 72 },
  { x: 80, y: 46 }
];

/* Cartographic short captions — full names remain in the detail sheet. */
const MARKER_SHORT_LABELS: Record<string, string> = {
  feat_elmina_tactile_01: 'Tactile Corridor',
  feat_elmina_lift_01: 'Glass Lift #1',
  feat_elmina_ramp_01: 'North Ramp',
  feat_elmina_wc_01: 'Tandas OKU',
  feat_elmina_lift_02: 'Pavilion Lift #2',
  feat_elmina_tactile_02: 'Warning Domes',
  feat_elmina_ramp_02: 'Rainbow Bridge Ramp',
  feat_elmina_wc_02: 'Park Tandas OKU',
  feat_kleast_ramp_01: 'East Step-Free Link',
  feat_kleast_lift_01: 'Atrium Lift #3',
  feat_kleast_tactile_01: 'LRT Tactile Trail',
  feat_kleast_wc_01: 'Family OKU Tandas'
};

const USER_ANCHORS: Record<string, MarkerAnchor> = {
  elmina: { x: 52, y: 66 },
  kl_east: { x: 52, y: 62 }
};
const DEFAULT_USER_ANCHOR: MarkerAnchor = { x: 50, y: 68 };
const USER_LABEL = 'You · ±4 m';

const MARKER_HALO: Record<AccessibilityFeatureType, string> = {
  ramp: 'rgba(0, 98, 210, 0.26)',
  tactile_paving: 'rgba(217, 119, 6, 0.26)',
  elevator: 'rgba(5, 150, 105, 0.26)',
  restroom: 'rgba(124, 58, 237, 0.26)'
};

const getMarkerAnchor = (id: string, index: number): MarkerAnchor =>
  MARKER_POSITIONS[id] ?? FALLBACK_ANCHORS[index % FALLBACK_ANCHORS.length];

const rectsOverlap = (a: Rect, b: Rect): boolean =>
  a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;

const estimateLabelWidth = (text: string): number =>
  Math.min(LABEL_MAX_WIDTH, Math.round(text.length * LABEL_CHAR_WIDTH + 18));

const labelRect = (side: LabelSide, cx: number, cy: number, width: number): Rect => {
  const edge = MARKER_DIAMETER / 2 + LABEL_GAP;

  switch (side) {
    case 'below':
      return { left: cx - width / 2, right: cx + width / 2, top: cy + edge, bottom: cy + edge + LABEL_HEIGHT };
    case 'above':
      return { left: cx - width / 2, right: cx + width / 2, top: cy - edge - LABEL_HEIGHT, bottom: cy - edge };
    case 'right':
      return { left: cx + edge, right: cx + edge + width, top: cy - LABEL_HEIGHT / 2, bottom: cy + LABEL_HEIGHT / 2 };
    case 'left':
      return { left: cx - edge - width, right: cx - edge, top: cy - LABEL_HEIGHT / 2, bottom: cy + LABEL_HEIGHT / 2 };
  }
};

const layoutMarkerLabels = (
  candidates: LabelCandidate[],
  size: { w: number; h: number },
  zoom: number,
  pan: { x: number; y: number } = { x: 0, y: 0 },
  obstacles: Rect[] = []
): Record<string, LabelSide | null> => {
  const pins = new Map<string, Rect>();
  // The floating control cluster is reserved space, never a caption target.
  const placedLabels: Rect[] = [...obstacles];
  const result: Record<string, LabelSide | null> = {};

  // The canvas is scaled about its centre and panned, so map % anchors into
  // true screen px — captions must respect the panned viewport, not the raw box.
  const centres = candidates.map(candidate => ({
    ...candidate,
    cx: ((candidate.x / 100) * size.w - size.w / 2) * zoom + size.w / 2 + pan.x,
    cy: ((candidate.y / 100) * size.h - size.h / 2) * zoom + size.h / 2 + pan.y
  }));

  centres.forEach(({ id, cx, cy }) => {
    pins.set(id, {
      left: cx - MARKER_CLEARANCE,
      right: cx + MARKER_CLEARANCE,
      top: cy - MARKER_CLEARANCE,
      bottom: cy + MARKER_CLEARANCE
    });
  });

  const sides: LabelSide[] = ['below', 'above', 'right', 'left'];

  [...centres]
    .sort((a, b) => a.priority - b.priority)
    .forEach(({ id, label, cx, cy, priority }) => {
      const width = estimateLabelWidth(label);
      let chosen: LabelSide | null = null;

      for (const side of sides) {
        const rect = labelRect(side, cx, cy, width);

        const insideCanvas =
          rect.left >= LABEL_EDGE_PADDING &&
          rect.right <= size.w - LABEL_EDGE_PADDING &&
          rect.top >= LABEL_EDGE_PADDING &&
          rect.bottom <= size.h - LABEL_EDGE_PADDING;

        if (!insideCanvas) continue;
        if (placedLabels.some(other => rectsOverlap(rect, other))) continue;
        if ([...pins.entries()].some(([pinId, pin]) => pinId !== id && rectsOverlap(rect, pin))) continue;

        chosen = side;
        placedLabels.push(rect);
        break;
      }

      // The focused pin always keeps a caption, even in a dense cluster.
      result[id] = chosen ?? (priority === 0 ? 'below' : null);
    });

  return result;
};

const markerLabelPosition = (side: LabelSide): React.CSSProperties => {
  const offset = `calc(100% + ${LABEL_GAP}px)`;

  switch (side) {
    case 'below':
      return { top: offset, left: '50%', transform: 'translateX(-50%)' };
    case 'above':
      return { bottom: offset, left: '50%', transform: 'translateX(-50%)' };
    case 'right':
      return { left: offset, top: '50%', transform: 'translateY(-50%)' };
    case 'left':
      return { right: offset, top: '50%', transform: 'translateY(-50%)' };
  }
};

const MARKER_LABEL_BASE: React.CSSProperties = {
  position: 'absolute',
  maxWidth: LABEL_MAX_WIDTH,
  padding: '2px 7px',
  borderRadius: '5px',
  fontSize: '9.5px',
  fontWeight: 700,
  lineHeight: `${LABEL_HEIGHT - 4}px`,
  letterSpacing: '0.1px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  pointerEvents: 'none',
  color: 'var(--map-label-text)',
  boxShadow: '0 2px 6px rgba(15, 23, 42, 0.22)',
  transition: 'background-color var(--transition-fast)'
};

export const AccessMapScreen: React.FC = () => {
  const {
    activeTownship,
    allFeatures,
    featureFilters,
    toggleFeatureFilter,
    activeRoute,
    clearRoute,
    selectedMarker,
    setSelectedMarker,
    speakText,
    currentUser,
    addToast
  } = useApp();

  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  const [isTurnByTurnOpen, setIsTurnByTurnOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const zoomRef = useRef(zoomLevel);
  zoomRef.current = zoomLevel;

  const mapViewportRef = useRef<HTMLDivElement>(null);
  const [mapViewport, setMapViewport] = useState({ w: 360, h: 480 });

  // Pan state, driven by pointer drags and two-finger pinch.
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOrigin = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinchOrigin = useRef<{ distance: number; zoom: number } | null>(null);

  // Track layout size so caption collision maths stays in screen px.
  // clientWidth/Height are unaffected by the app's CSS zoom (font scaling).
  const measureMapViewport = useCallback(() => {
    const node = mapViewportRef.current;
    if (!node) return;

    const width = node.clientWidth;
    const height = node.clientHeight;
    if (width <= 0 || height <= 0) return;

    setMapViewport(prev =>
      Math.abs(prev.w - width) < 0.5 && Math.abs(prev.h - height) < 0.5
        ? prev
        : { w: width, h: height }
    );
  }, []);

  // Re-measure after every render (device preset, township, filter changes)
  useLayoutEffect(measureMapViewport);

  useLayoutEffect(() => {
    window.addEventListener('resize', measureMapViewport);
    return () => window.removeEventListener('resize', measureMapViewport);
  }, [measureMapViewport]);

  /* Keep the artwork glued to its frame: at 1x there is nothing to pan,
     at 2x the envelope is half the overflow on each axis. */
  const clampPan = (pan: { x: number; y: number }, zoom: number) => {
    const maxX = Math.max(0, (mapViewport.w * (zoom - 1)) / 2);
    const maxY = Math.max(0, (mapViewport.h * (zoom - 1)) / 2);

    return {
      x: Math.min(maxX, Math.max(-maxX, pan.x)),
      y: Math.min(maxY, Math.max(-maxY, pan.y))
    };
  };

  const applyZoom = (next: number) => {
    const clamped = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Number(next.toFixed(3))));
    // Keep the ref ahead of React so rapid successive clicks are never dropped.
    zoomRef.current = clamped;
    setZoomLevel(clamped);
    setPanOffset(prev => clampPan(prev, clamped));
  };

  // Latest handler for the native wheel listener, which is registered once.
  const applyZoomRef = useRef(applyZoom);
  applyZoomRef.current = applyZoom;

  // Re-clamp after a resize or a zoom change so no edge is ever exposed.
  useLayoutEffect(() => {
    setPanOffset(prev => {
      const next = clampPan(prev, zoomLevel);
      return next.x === prev.x && next.y === prev.y ? prev : next;
    });
  }, [zoomLevel, mapViewport.w, mapViewport.h]);

  // Wheel / trackpad zoom. Non-passive so the page behind the frame never scrolls.
  useLayoutEffect(() => {
    const node = mapViewportRef.current;
    if (!node) return;

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      applyZoomRef.current(zoomRef.current - event.deltaY * 0.0016);
    };

    node.addEventListener('wheel', onWheel, { passive: false });
    return () => node.removeEventListener('wheel', onWheel);
  }, []);

  const pointerDistance = () => {
    const [a, b] = [...pointers.current.values()];
    return a && b ? Math.hypot(a.x - b.x, a.y - b.y) : 0;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Markers, zoom controls and route buttons own their own gestures.
    if ((e.target as HTMLElement).closest('button')) return;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* Pointer capture is an optimisation; dragging still works without it. */
    }
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 1) {
      dragOrigin.current = { x: e.clientX, y: e.clientY, panX: panOffset.x, panY: panOffset.y };
      setIsDragging(true);
    } else if (pointers.current.size === 2) {
      pinchOrigin.current = { distance: pointerDistance(), zoom: zoomLevel };
      setIsDragging(false);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2 && pinchOrigin.current) {
      const ratio = pointerDistance() / Math.max(1, pinchOrigin.current.distance);
      applyZoom(pinchOrigin.current.zoom * ratio);
      return;
    }

    if (!isDragging) return;

    setPanOffset(clampPan({
      x: dragOrigin.current.panX + (e.clientX - dragOrigin.current.x),
      y: dragOrigin.current.panY + (e.clientY - dragOrigin.current.y)
    }, zoomLevel));
  };

  const handlePointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinchOrigin.current = null;

    if (pointers.current.size === 0) {
      setIsDragging(false);
    } else if (pointers.current.size === 1) {
      const [remaining] = [...pointers.current.values()];
      dragOrigin.current = { x: remaining.x, y: remaining.y, panX: panOffset.x, panY: panOffset.y };
      setIsDragging(true);
    }

    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };
  // Filter features by township and active toggles
  const visibleFeatures = allFeatures.filter(f => {
    if (f.townshipId !== activeTownship.id) return false;
    return featureFilters[f.type];
  });

  const userAnchor = USER_ANCHORS[activeTownship.id] ?? DEFAULT_USER_ANCHOR;

  const labelSides = useMemo(() => {
    const candidates: LabelCandidate[] = visibleFeatures.map((feature, index) => ({
      id: feature.id,
      label: MARKER_SHORT_LABELS[feature.id] ?? feature.name,
      ...getMarkerAnchor(feature.id, index),
      // Selected pin first, "you are here" next, then reading order.
      priority: selectedMarker?.id === feature.id ? 0 : index + 2
    }));

    candidates.push({
      id: 'user-location',
      label: USER_LABEL,
      x: userAnchor.x,
      y: userAnchor.y,
      priority: 1
    });

    // Reserve the floating control cluster (40px wide, 124px tall, 12px inset)
    const controlObstacle: Rect = {
      left: mapViewport.w - 52,
      right: mapViewport.w - 12,
      top: 12,
      bottom: 136
    };

    return layoutMarkerLabels(candidates, mapViewport, zoomLevel, panOffset, [controlObstacle]);
  }, [visibleFeatures, selectedMarker, userAnchor.x, userAnchor.y, mapViewport, zoomLevel, panOffset]);

  const zoomIn = () => applyZoom(zoomRef.current + ZOOM_STEP);
  const zoomOut = () => applyZoom(zoomRef.current - ZOOM_STEP);
  const resetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };
  const isMaxZoom = zoomLevel >= ZOOM_MAX - 0.001;
  const isMinZoom = zoomLevel <= ZOOM_MIN + 0.001;
  const isDefaultView = zoomLevel === 1 && panOffset.x === 0 && panOffset.y === 0;

  // Dedicated high-craft vector icon renderers (Anti-vibecoding: no emojis)
  const renderFeatureVectorIcon = (type: AccessibilityFeatureType, size: number = 18, color?: string) => {
    switch (type) {
      case 'ramp':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || 'var(--oku-blue)'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            {/* Wheelchair Ramp Vector */}
            <circle cx="12" cy="5" r="2.5" />
            <path d="M6 19 L19 12" strokeDasharray="2 2" />
            <path d="M9 19 L19 19" />
            <path d="M10 13 L14 13 L16 19" />
            <path d="M8 17 A 4 4 0 0 1 12 9" />
          </svg>
        );
      case 'tactile_paving':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || 'var(--tactile-yellow)'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            {/* Tactile Paving Guidance Ribs */}
            <rect x="3" y="3" width="18" height="18" rx="3" strokeWidth="1.8" />
            <line x1="8" y1="6" x2="8" y2="18" strokeWidth="2.5" />
            <line x1="12" y1="6" x2="12" y2="18" strokeWidth="2.5" />
            <line x1="16" y1="6" x2="16" y2="18" strokeWidth="2.5" />
          </svg>
        );
      case 'elevator':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || 'var(--elevator-emerald)'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            {/* Elevator Vector */}
            <rect x="4" y="3" width="16" height="18" rx="2.5" />
            <line x1="12" y1="3" x2="12" y2="21" strokeDasharray="3 2" />
            <path d="M8 9 L9.5 7 L11 9" />
            <path d="M13 15 L14.5 17 L16 15" />
          </svg>
        );
      case 'restroom':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || 'var(--restroom-violet)'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            {/* Accessible Restroom (Tandas OKU) */}
            <circle cx="8" cy="5" r="2" />
            <path d="M8 8 L8 15 M6 11 L10 11 M6 15 L8 20 L10 20" />
            <circle cx="16" cy="5" r="2" />
            <path d="M16 8 L14 14 L18 14 Z M15 14 L15 20 M17 14 L17 20" />
          </svg>
        );
    }
  };

  const getMarkerAccentColor = (type: AccessibilityFeatureType) => {
    switch (type) {
      case 'ramp':
        return 'var(--oku-blue)';
      case 'tactile_paving':
        return 'var(--tactile-yellow)';
      case 'elevator':
        return 'var(--elevator-emerald)';
      case 'restroom':
        return 'var(--restroom-violet)';
    }
  };

  const isElmina = activeTownship.id === 'elmina';

  return (
    <div className="tab-screen-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      {/* Top Filter & Route Action Bar */}
      <div
        style={{
          position: 'relative',
          padding: '12px 16px 10px',
          backgroundColor: 'var(--bg-card)',
          borderBottom: 'var(--border-light)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          boxShadow: 'var(--shadow-sm)',
          zIndex: 30
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="badge-oku" style={{ padding: '2px 8px', fontSize: '10px' }}>
                MS 1184 Certified
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                Universal Access
              </span>
            </div>
            <h2 style={{ fontSize: '17px', fontWeight: 800, fontFamily: 'var(--font-display)', marginTop: '2px' }}>
              AccessMap Directory
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Step-free spatial navigation in {activeTownship.name}
            </p>
          </div>

          <button
            className="btn-primary"
            style={{ padding: '9px 15px', fontSize: '12.5px' }}
            onClick={() => setIsRouteModalOpen(true)}
            id="btn-plan-route"
          >
            <Navigation size={15} />
            Plan Route
          </button>
        </div>

        {/* Feature Layer Toggles */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            overflowY: 'hidden',
            padding: '1px 2px 3px',
            margin: '0 -2px',
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {/* Wheelchair Ramps */}
          <button
            onClick={() => toggleFeatureFilter('ramp')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 11px',
              borderRadius: 'var(--radius-full)',
              border: featureFilters.ramp ? '1.5px solid var(--oku-blue)' : 'var(--border-light)',
              backgroundColor: featureFilters.ramp ? 'var(--oku-blue-light)' : 'var(--bg-card)',
              color: featureFilters.ramp ? 'var(--oku-blue)' : 'var(--text-secondary)',
              fontSize: '11.5px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              transition: 'var(--transition-fast)'
            }}
          >
            {renderFeatureVectorIcon('ramp', 15, featureFilters.ramp ? 'var(--oku-blue)' : 'var(--text-secondary)')}
            <span>Ramps (≤1:12)</span>
          </button>

          {/* Tactile Paving */}
          <button
            onClick={() => toggleFeatureFilter('tactile_paving')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 11px',
              borderRadius: 'var(--radius-full)',
              border: featureFilters.tactile_paving ? '1.5px solid var(--tactile-yellow)' : 'var(--border-light)',
              backgroundColor: featureFilters.tactile_paving ? 'var(--tactile-yellow-bg)' : 'var(--bg-card)',
              color: featureFilters.tactile_paving ? 'var(--tactile-yellow)' : 'var(--text-secondary)',
              fontSize: '11.5px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              transition: 'var(--transition-fast)'
            }}
          >
            {renderFeatureVectorIcon('tactile_paving', 15, featureFilters.tactile_paving ? 'var(--tactile-yellow)' : 'var(--text-secondary)')}
            <span>Tactile Paths</span>
          </button>

          {/* Elevators */}
          <button
            onClick={() => toggleFeatureFilter('elevator')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 11px',
              borderRadius: 'var(--radius-full)',
              border: featureFilters.elevator ? '1.5px solid var(--elevator-emerald)' : 'var(--border-light)',
              backgroundColor: featureFilters.elevator ? 'var(--elevator-emerald-bg)' : 'var(--bg-card)',
              color: featureFilters.elevator ? 'var(--elevator-emerald)' : 'var(--text-secondary)',
              fontSize: '11.5px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              transition: 'var(--transition-fast)'
            }}
          >
            {renderFeatureVectorIcon('elevator', 15, featureFilters.elevator ? 'var(--elevator-emerald)' : 'var(--text-secondary)')}
            <span>Live Lifts</span>
          </button>

          {/* Tandas OKU */}
          <button
            onClick={() => toggleFeatureFilter('restroom')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 11px',
              borderRadius: 'var(--radius-full)',
              border: featureFilters.restroom ? '1.5px solid var(--restroom-violet)' : 'var(--border-light)',
              backgroundColor: featureFilters.restroom ? 'var(--restroom-violet-bg)' : 'var(--bg-card)',
              color: featureFilters.restroom ? 'var(--restroom-violet)' : 'var(--text-secondary)',
              fontSize: '11.5px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              transition: 'var(--transition-fast)'
            }}
          >
            {renderFeatureVectorIcon('restroom', 15, featureFilters.restroom ? 'var(--restroom-violet)' : 'var(--text-secondary)')}
            <span>Tandas OKU</span>
          </button>
        </div>
      </div>

      {/* Interactive Spatial Architectural Vector Canvas */}
      <div
        ref={mapViewportRef}
        style={{
          flex: 1,
          position: 'relative',
          backgroundColor: 'var(--map-surface)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
          touchAction: 'none'
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
      >
        {/* Vector Architectural Blueprint Canvas with Real-Time Pan & Zoom Transform */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, var(--map-canvas-start) 0%, var(--map-canvas-end) 100%)',
            backgroundSize: '24px 24px',
            backgroundImage: 'radial-gradient(circle, var(--map-grid) 1.2px, transparent 1.2px)',
            userSelect: 'none',
            transform: `translate3d(${panOffset.x}px, ${panOffset.y}px, 0px) scale(${zoomLevel})`,
            transformOrigin: 'center center',
            willChange: 'transform',
            transition: isDragging ? 'none' : 'transform var(--dur-base) var(--ease-entrance)'
          }}
        >
          <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
            <defs>
              {/* Lake water gradient */}
              <linearGradient id="lakeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--map-water-start)" />
                <stop offset="100%" stopColor="var(--map-water-end)" />
              </linearGradient>

              {/* Park green zone gradient */}
              <linearGradient id="parkGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="var(--map-park-start)" />
                <stop offset="100%" stopColor="var(--map-park-end)" />
              </linearGradient>

              {/* Mall Building footprint */}
              <linearGradient id="mallGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--map-building-start)" />
                <stop offset="100%" stopColor="var(--map-building-end)" />
              </linearGradient>

              {/* Glow filter for active route */}
              <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Township Geographic Elements */}
            {isElmina ? (
              <g>
                {/* Elmina Central Park Green Area */}
                <path
                  d="M 10 90 Q 140 70 300 90 T 420 180 L 420 540 L 0 540 Z"
                  fill="url(#parkGradient)"
                  opacity="0.75"
                />

                {/* Elmina Central Lake Water Body */}
                <path
                  d="M 40 190 C 130 160, 240 180, 290 240 C 340 300, 310 390, 420 430 L 420 620 L 0 620 Z"
                  fill="url(#lakeGradient)"
                  stroke="var(--map-water-stroke)"
                  strokeWidth="2.5"
                />
                <text x="110" y="380" fill="var(--map-water-label)" fontSize="12" fontWeight="800" letterSpacing="1.2">
                  ELMINA CENTRAL LAKE
                </text>

                {/* Elmina Lakeside Mall Footprint */}
                <rect x="25" y="30" width="170" height="90" rx="14" fill="url(#mallGradient)" stroke="var(--map-building-stroke)" strokeWidth="2" />
                <text x="38" y="70" fill="var(--map-building-label)" fontSize="11" fontWeight="800">
                  ELMINA LAKESIDE MALL
                </text>
                <text x="38" y="88" fill="var(--map-building-sub)" fontSize="10" fontWeight="600">
                  Ground Concourse & Promenade
                </text>

                {/* UNICEF Inclusive Playground Zone */}
                <rect x="250" y="40" width="130" height="65" rx="12" fill="var(--map-service-bg)" stroke="var(--map-service-border)" strokeWidth="2" strokeDasharray="4 3" />
                <text x="262" y="66" fill="var(--map-service-label)" fontSize="9.5" fontWeight="800">
                  INCLUSIVE PLAYGROUND
                </text>
                <text x="262" y="82" fill="var(--map-service-sub)" fontSize="9.5" fontWeight="600">
                  UNICEF Certified Universal
                </text>

                {/* Rainbow Bridge Feature */}
                <path
                  d="M 285 240 C 310 270, 325 310, 360 380"
                  fill="none"
                  stroke="var(--map-road)"
                  strokeWidth="16"
                  strokeLinecap="round"
                />
                <path
                  d="M 285 240 C 310 270, 325 310, 360 380"
                  fill="none"
                  stroke="var(--sd-crimson-solid)"
                  strokeWidth="3.5"
                  strokeDasharray="5 3"
                />
                <text x="235" y="340" fill="var(--sd-crimson)" fontSize="10.5" fontWeight="800">
                  Rainbow Bridge (Ramped)
                </text>

                {/* Base Step-Free Boardwalk Paths */}
                <path
                  d="M 55 120 C 110 120, 150 160, 205 210 S 290 290, 360 380"
                  fill="none"
                  stroke="var(--map-dash)"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
                <path
                  d="M 55 120 C 110 120, 150 160, 205 210 S 290 290, 360 380"
                  fill="none"
                  stroke="var(--map-road-inner)"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              </g>
            ) : (
              <g>
                {/* KL East Masterplan Layout */}
                <rect x="30" y="30" width="340" height="120" rx="14" fill="url(#mallGradient)" stroke="var(--map-building-stroke)" strokeWidth="2" />
                <text x="45" y="65" fill="var(--map-building-label)" fontSize="13" fontWeight="800">
                  KL EAST MALL (B1 to L3)
                </text>
                <text x="45" y="85" fill="var(--map-building-sub)" fontSize="10" fontWeight="600">
                  Connected to The Ridge Residences & Park
                </text>

                <rect x="40" y="190" width="320" height="220" rx="14" fill="url(#parkGradient)" stroke="var(--map-park-stroke)" strokeWidth="2" />
                <text x="120" y="290" fill="var(--map-park-label)" fontSize="12" fontWeight="800">
                  KL EAST FOREST PARK LINK
                </text>

                {/* Base path */}
                <path
                  d="M 60 150 L 60 280 L 220 280 L 220 370"
                  fill="none"
                  stroke="var(--map-dash)"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
              </g>
            )}

            {/* Active Continuous Step-Free Route Overlay with Animated Marching Ants */}
            {activeRoute && (
              <g>
                {/* Glow Underlay */}
                <path
                  d={isElmina
                    ? "M 55 120 C 110 120, 150 160, 205 210 S 290 290, 360 380"
                    : "M 60 150 L 60 280 L 220 280 L 220 370"
                  }
                  fill="none"
                  stroke="var(--map-route)"
                  strokeWidth="18"
                  strokeLinecap="round"
                  filter="url(#routeGlow)"
                  opacity="0.35"
                />

                {/* Continuous Solid Inner Bed */}
                <path
                  d={isElmina
                    ? "M 55 120 C 110 120, 150 160, 205 210 S 290 290, 360 380"
                    : "M 60 150 L 60 280 L 220 280 L 220 370"
                  }
                  fill="none"
                  stroke="var(--map-route)"
                  strokeWidth="7"
                  strokeLinecap="round"
                />

                {/* Animated Dash Ants Line */}
                <path
                  d={isElmina
                    ? "M 55 120 C 110 120, 150 160, 205 210 S 290 290, 360 380"
                    : "M 60 150 L 60 280 L 220 280 L 220 370"
                  }
                  fill="none"
                  stroke="var(--map-route-casing)"
                  strokeWidth="3.5"
                  className="animated-route-line"
                  strokeLinecap="round"
                />

                {/* Origin Flag Pin */}
                <g transform={isElmina ? "translate(55, 120)" : "translate(60, 150)"}>
                  <circle cx="0" cy="0" r="11" fill="var(--oku-blue-solid)" stroke="var(--map-pin-bg)" strokeWidth="3" />
                  <circle cx="0" cy="0" r="4" fill="var(--map-pin-bg)" />
                  <rect x="15" y="-14" width="135" height="24" rx="6" fill="var(--map-chip)" />
                  <text x="24" y="2" fill="var(--map-chip-text)" fontSize="10.5" fontWeight="800">
                    START: Drop-off (Step-free)
                  </text>
                </g>

                {/* Destination Flag Pin */}
                <g transform={isElmina ? "translate(360, 380)" : "translate(220, 370)"}>
                  <circle cx="0" cy="0" r="11" fill="var(--sd-crimson-solid)" stroke="var(--map-pin-bg)" strokeWidth="3" />
                  <circle cx="0" cy="0" r="4" fill="var(--map-pin-bg)" />
                  <rect x="-140" y="8" width="135" height="24" rx="6" fill="var(--sd-crimson-solid)" />
                  <text x="-132" y="24" fill="#FFFFFF" fontSize="10.5" fontWeight="800">
                    DEST: {activeRoute.destinationName.slice(0, 15)}
                  </text>
                </g>
              </g>
            )}
          </svg>

          {/* Precision Vector Markers on Spatial Map */}
          {visibleFeatures.map((feat, index) => {
            const anchor = getMarkerAnchor(feat.id, index);
            const accent = getMarkerAccentColor(feat.type);
            const isSelected = selectedMarker?.id === feat.id;
            const labelSide = labelSides[feat.id];

            return (
              <div
                key={feat.id}
                style={{
                  position: 'absolute',
                  left: `calc(${anchor.x}% - ${MARKER_DIAMETER / 2}px)`,
                  top: `calc(${anchor.y}% - ${MARKER_DIAMETER / 2}px)`,
                  width: MARKER_DIAMETER,
                  height: MARKER_DIAMETER,
                  // Counter-scale so pins keep a constant screen size while the
                  // canvas zooms: spread-out pins then leave room for captions.
                  transform: `scale(${1 / zoomLevel})`,
                  transformOrigin: 'center center',
                  transition: 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)',
                  zIndex: isSelected ? 2 : 1
                }}
              >
                <button
                  type="button"
                  className="map-marker-btn"
                  onClick={() => {
                    setSelectedMarker(feat);
                    speakText(`${feat.name}. ${feat.description}`);
                  }}
                  aria-label={`${feat.name}, ${feat.locationName}. Open accessibility details.`}
                  aria-pressed={isSelected}
                  title={feat.name}
                >
                  <span
                    style={{
                      width: MARKER_DIAMETER,
                      height: MARKER_DIAMETER,
                      borderRadius: '50%',
                      backgroundColor: 'var(--map-pin-bg)',
                      border: `2.5px solid ${accent}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: isSelected
                        ? `0 0 0 5px ${MARKER_HALO[feat.type]}, 0 6px 14px rgba(15, 23, 42, 0.24)`
                        : '0 4px 10px rgba(15, 23, 42, 0.16)',
                      transform: isSelected ? 'scale(1.12)' : 'scale(1)',
                      transition: 'transform var(--transition-spring), box-shadow var(--transition-fast)'
                    }}
                  >
                    {renderFeatureVectorIcon(feat.type, 20, accent)}
                  </span>
                </button>

                {/* Caption: truncated by CSS and only rendered when it wins its slot */}
                {labelSide && (
                  <div
                    aria-hidden="true"
                    className="map-label"
                    style={{
                      ...MARKER_LABEL_BASE,
                      ...markerLabelPosition(labelSide),
                      backgroundColor: isSelected ? 'var(--sd-crimson-solid)' : 'var(--map-label-bg)'
                    }}
                  >
                    {MARKER_SHORT_LABELS[feat.id] ?? feat.name}
                  </div>
                )}
              </div>
            );
          })}

          {/* "You are here" GPS pin with accuracy halo */}
          <div
            role="img"
            aria-label="Your location on the map, GPS accuracy approximately 4 metres"
            style={{
              position: 'absolute',
              left: `calc(${userAnchor.x}% - ${MARKER_DIAMETER / 2}px)`,
              top: `calc(${userAnchor.y}% - ${MARKER_DIAMETER / 2}px)`,
              width: MARKER_DIAMETER,
              height: MARKER_DIAMETER,
              transform: `scale(${1 / zoomLevel})`,
              transformOrigin: 'center center',
              transition: 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)',
              zIndex: 3,
              pointerEvents: 'none'
            }}
          >
            <span
              className="gps-halo"
              style={{
                position: 'absolute',
                inset: '-14px',
                borderRadius: '50%',
                backgroundColor: 'var(--oku-blue-light)',
                border: '1.5px solid var(--oku-blue-border)'
              }}
            />

            <span
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                backgroundColor: 'var(--oku-blue-solid)',
                border: '2.5px solid var(--map-pin-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px var(--oku-blue-glow)'
              }}
            >
              <Locate size={18} color="#FFFFFF" />
            </span>

            {labelSides['user-location'] && (
              <div
                aria-hidden="true"
                className="map-label"
                style={{
                  ...MARKER_LABEL_BASE,
                  ...markerLabelPosition(labelSides['user-location']),
                  backgroundColor: 'var(--oku-blue-solid)'
                }}
              >
                {USER_LABEL}
              </div>
            )}
          </div>
        </div>

        {/* Floating Map Controls — one compact 40px-wide cluster */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            zIndex: 40,
            pointerEvents: 'none'
          }}
        >
          <div
            style={{
              width: '40px',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-sm)',
              border: 'var(--border-light)',
              boxShadow: 'var(--shadow-md)',
              overflow: 'hidden',
              pointerEvents: 'auto'
            }}
          >
            {/* Compass / reset view */}
            <button
              type="button"
              className="map-control-btn"
              onClick={resetView}
              disabled={isDefaultView}
              aria-label="Reset map view, north up"
              title="Reset view · North up"
            >
              <Compass size={17} color={isDefaultView ? 'var(--text-tertiary)' : 'var(--sd-crimson)'} />
            </button>

            <span className="map-control-divider" />

            <button
              type="button"
              className="map-control-btn"
              onClick={zoomIn}
              disabled={isMaxZoom}
              aria-label={`Zoom in${isMaxZoom ? ' (maximum)' : ''}`}
              title="Zoom in"
            >
              <Plus size={17} strokeWidth={2.5} />
            </button>

            <span className="map-control-divider" />

            <button
              type="button"
              className="map-control-btn"
              onClick={zoomOut}
              disabled={isMinZoom}
              aria-label={`Zoom out${isMinZoom ? ' (fit to screen)' : ''}`}
              title="Zoom out"
            >
              <Minus size={17} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Active Step-Free Route Floater Panel */}
        {activeRoute && (
          <div
            style={{
              position: 'absolute',
              bottom: '16px',
              left: '12px',
              right: '12px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              padding: '14px 16px',
              boxShadow: 'var(--shadow-lg)',
              border: '2px solid var(--oku-blue)',
              zIndex: 50,
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              animation: 'sheetSpringUp 280ms cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                  <span className="badge-oku" style={{ padding: '2px 8px', fontSize: '10.5px' }}>
                    Continuous Step-Free Path
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--status-success)', fontWeight: 700 }}>
                    ✓ 0 Stairs Guaranteed
                  </span>
                </div>
                <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {activeRoute.originName.split('-')[0]} → {activeRoute.destinationName}
                </h4>
              </div>

              <button
                onClick={clearRoute}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: '2px' }}
                title="Clear Route"
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: 'var(--border-subtle)', paddingTop: '8px' }}>
              <div style={{ display: 'flex', gap: '14px', fontSize: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Footprints size={14} color="var(--oku-blue)" />
                  <span style={{ fontWeight: 700 }}>{activeRoute.totalDistanceMeters}m</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={14} color="var(--text-secondary)" />
                  <span>{activeRoute.estimatedMinutesWheelchair} mins (Wheelchair)</span>
                </div>
              </div>

              <button
                className="btn-primary"
                style={{ padding: '7px 13px', fontSize: '12px' }}
                onClick={() => setIsTurnByTurnOpen(true)}
              >
                Turn-by-Turn
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Selected Marker Detail Modal / Bottom Sheet */}
      {selectedMarker && (
        <div className="modal-backdrop" onClick={() => setSelectedMarker(null)}>
          <div className="bottom-sheet" onClick={e => e.stopPropagation()}>
            <div className="sheet-handle" />
            <div className="sheet-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: `${getMarkerAccentColor(selectedMarker.type)}15`,
                  border: `1.5px solid ${getMarkerAccentColor(selectedMarker.type)}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {renderFeatureVectorIcon(selectedMarker.type, 22, getMarkerAccentColor(selectedMarker.type))}
                </div>
                <div>
                  <h3 className="sheet-title">{selectedMarker.name}</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{selectedMarker.locationName}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedMarker(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '13px', lineHeight: 1.5, color: 'var(--text-primary)' }}>
              {selectedMarker.description}
            </p>

            {/* Specifications Grid based on MS 1184 Universal Accessibility Code */}
            <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '14px', borderRadius: 'var(--radius-md)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {selectedMarker.details.slopeRatio && (
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Slope Gradient</span>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--oku-blue)' }}>
                    {selectedMarker.details.slopeRatio}
                  </div>
                </div>
              )}
              {selectedMarker.details.doorWidth && (
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Door Clearance</span>
                  <div style={{ fontSize: '13px', fontWeight: 800 }}>
                    {selectedMarker.details.doorWidth}
                  </div>
                </div>
              )}
              {selectedMarker.details.elevatorCabinClearance && (
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Cabin Dimension</span>
                  <div style={{ fontSize: '13px', fontWeight: 800 }}>
                    {selectedMarker.details.elevatorCabinClearance}
                  </div>
                </div>
              )}
              {selectedMarker.details.tactileType && (
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Tactile Standard</span>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--tactile-yellow)' }}>
                    {selectedMarker.details.tactileType === 'guiding' ? 'Sinusoidal Guiding Ribs' : 'Blister Hazard Domes'}
                  </div>
                </div>
              )}
              {selectedMarker.details.hasAdultChangingBench !== undefined && (
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Adult Changing Bench</span>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: selectedMarker.details.hasAdultChangingBench ? 'var(--status-success)' : 'var(--text-secondary)' }}>
                    {selectedMarker.details.hasAdultChangingBench ? 'Available & Powered' : 'Standard Flip Bench'}
                  </div>
                </div>
              )}
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Operational Status</span>
                <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--status-success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={13} /> Operational (Polis Bantuan Checked)
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className="btn-primary"
                style={{ flex: 1 }}
                onClick={() => {
                  setSelectedMarker(null);
                  setIsRouteModalOpen(true);
                }}
              >
                <Navigation size={16} />
                Route to This Point
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Route Planner Modal */}
      {isRouteModalOpen && (
        <RoutePlannerModal onClose={() => setIsRouteModalOpen(false)} />
      )}

      {/* Turn By Turn Directions Sheet */}
      {isTurnByTurnOpen && activeRoute && (
        <TurnByTurnModal route={activeRoute} onClose={() => setIsTurnByTurnOpen(false)} />
      )}
    </div>
  );
};
