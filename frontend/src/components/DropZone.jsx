import React, { useCallback, useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DropZone({ onFilesSelected }) {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(Array.from(e.dataTransfer.files));
    }
  }, [onFilesSelected]);

  const handleFileInput = useCallback((e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(Array.from(e.target.files));
    }
  }, [onFilesSelected]);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`glass-card flex flex-col items-center justify-center text-center transition-all duration-300`}
      onDragEnter={handleDragEnter}
      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragActive(true); }}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        borderWidth: '2px',
        borderStyle: 'dashed',
        borderColor: isDragActive ? 'var(--accent-blue)' : 'var(--border-color)',
        padding: '3rem',
        cursor: 'pointer',
        minHeight: '240px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        background: isDragActive ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
        boxShadow: isDragActive ? '0 0 30px rgba(26, 115, 232, 0.2)' : 'var(--shadow-glass)'
      }}
      onClick={() => document.getElementById('fileUpload').click()}
    >
      <input
        type="file"
        id="fileUpload"
        multiple
        style={{ display: 'none' }}
        onChange={handleFileInput}
      />
      <motion.div 
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        style={{
          background: isDragActive ? 'var(--accent-blue)' : 'var(--bg-tertiary)',
          padding: '1.5rem',
          borderRadius: '50%',
          marginBottom: '1.5rem',
          transition: 'all 0.3s ease'
        }}
      >
        <UploadCloud size={48} color={isDragActive ? '#fff' : 'var(--accent-blue)'} />
      </motion.div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
        {isDragActive ? 'Lepaskan untuk mengunggah' : 'Tarik & lepas file ke sini'}
      </h3>
      <p style={{ color: 'var(--text-secondary)' }}>
        atau klik untuk memilih dari komputer
      </p>
      <div style={{ 
        marginTop: '1.5rem', 
        display: 'flex', 
        gap: '0.5rem', 
        flexWrap: 'wrap', 
        justifyContent: 'center' 
      }}>
        {['PDF', 'DOCX', 'PPTX', 'XLSX', 'CSV', 'TXT'].map(ext => (
          <span key={ext} style={{
            fontSize: '0.75rem',
            background: 'var(--bg-primary)',
            color: 'var(--text-muted)',
            padding: '0.2rem 0.6rem',
            borderRadius: '12px',
            border: '1px solid var(--border-color)'
          }}>
            {ext}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
