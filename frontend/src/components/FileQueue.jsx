import React from 'react';
import { FileText, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FileQueue({ files, statuses, onRemoveFile, onClearAll }) {
  if (files.length === 0) return null;

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="glass-card" 
      style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--bg-secondary)' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-primary)' }}>
          Antrean ({files.length})
        </h3>
        <button 
          onClick={onClearAll}
          style={{ 
            background: 'var(--bg-tertiary)', 
            color: 'var(--text-secondary)', 
            fontSize: '0.85rem',
            padding: '0.4rem 0.8rem',
            borderRadius: '6px',
            border: '1px solid var(--border-color)',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--border-hover)'; }}
          onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
        >
          Hapus Semua
        </button>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <AnimatePresence>
          {files.map((file, index) => {
            const status = statuses[file.name] || { state: 'idle' };
            
            return (
              <motion.div 
                key={`${file.name}`}
                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.95, transition: { duration: 0.2 } }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1rem',
                  background: 'var(--bg-primary)',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ 
                  background: 'var(--bg-tertiary)', 
                  padding: '0.6rem', 
                  borderRadius: '8px', 
                  marginRight: '1rem',
                  flexShrink: 0 
                }}>
                  <FileText size={20} color="var(--accent-blue)" />
                </div>
                
                <div style={{ flex: 1, minWidth: 0, marginRight: '1rem' }}>
                  <p style={{ 
                    whiteSpace: 'nowrap', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis',
                    fontSize: '0.95rem',
                    fontWeight: '500',
                    color: 'var(--text-primary)'
                  }}>
                    {file.name}
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    {formatSize(file.size)}
                  </p>
                  {status.state === 'error' && (
                    <motion.p 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      style={{ color: 'var(--error)', fontSize: '0.8rem', marginTop: '0.25rem' }}
                    >
                      {status.error}
                    </motion.p>
                  )}
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {status.state === 'loading' && <Loader2 size={18} color="var(--accent-cyan)" style={{ animation: 'spin 1s linear infinite' }} />}
                  {status.state === 'success' && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <CheckCircle size={18} color="var(--success)" />
                    </motion.div>
                  )}
                  {status.state === 'error' && (
                     <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                       <AlertCircle size={18} color="var(--error)" />
                     </motion.div>
                  )}
                  
                  <button 
                    onClick={() => onRemoveFile(file.name)}
                    disabled={status.state === 'loading'}
                    style={{
                      background: 'transparent',
                      color: 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0.4rem',
                      borderRadius: '50%',
                      opacity: status.state === 'loading' ? 0.5 : 1,
                      cursor: status.state === 'loading' ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => { if(status.state !== 'loading') { e.currentTarget.style.color = 'var(--error)'; e.currentTarget.style.background = 'var(--bg-tertiary)'; }}}
                    onMouseOut={(e) => { if(status.state !== 'loading') { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}}
                  >
                    <X size={16} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />
    </motion.div>
  );
}
