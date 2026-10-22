import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, ShieldAlert, Info, X } from 'lucide-react';

export const Toasts: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={18} color="var(--on-dark-success)" />;
      case 'security':
        return <ShieldAlert size={18} color="var(--on-dark-danger)" />;
      case 'warning':
        return <AlertCircle size={18} color="var(--on-dark-warning)" />;
      default:
        return <Info size={18} color="var(--on-dark-info)" />;
    }
  };

  return (
    <div className="toasts-container" aria-live="polite">
      {toasts.map(toast => (
        <div 
          key={toast.id} 
          className={`toast-item toast-${toast.type}`}
          role="alert"
        >
          <div style={{ marginTop: '2px' }}>
            {getIcon(toast.type)}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h5 className="toast-title">{toast.title}</h5>
              <span style={{ fontSize: '10px', color: 'var(--toast-muted)' }}>{toast.timestamp}</span>
            </div>
            <p className="toast-msg">{toast.message}</p>
          </div>
          <button 
            onClick={() => removeToast(toast.id)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--toast-muted)',
              cursor: 'pointer',
              padding: '2px'
            }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
