import { useEffect, useCallback } from 'react';

const S3_BASE = import.meta.env.VITE_S3_BASE_URL;

export default function ImageLightbox({ images, currentIndex, onNavigate, onClose, styleName }) {
  const total = images.length;

  const prev = useCallback(() => onNavigate((currentIndex - 1 + total) % total), [currentIndex, total]);
  const next = useCallback(() => onNavigate((currentIndex + 1) % total), [currentIndex, total]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [prev, next, onClose]);

  const src = `${S3_BASE}/${images[currentIndex]}`;
  const viewLabel = images[currentIndex].replace(/^intimo-\d+-/, '').replace(/\.[^.]+$/, '');

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div className="lightbox-box" onClick={(e) => e.stopPropagation()}>
        <button className="lightbox-close" onClick={onClose} aria-label="Close">✕</button>

        <div className="lightbox-image-wrap">
          <button className="lightbox-nav lightbox-prev" onClick={prev} aria-label="Previous">&#8249;</button>
          <img className="lightbox-img" src={src} alt={`${styleName} — ${viewLabel}`} />
          <button className="lightbox-nav lightbox-next" onClick={next} aria-label="Next">&#8250;</button>
        </div>

        <div className="lightbox-footer">
          <span className="lightbox-label">{viewLabel}</span>
          <span className="lightbox-counter">{currentIndex + 1} / {total}</span>
        </div>

        <div className="lightbox-thumbnails">
          {images.map((img, i) => (
            <img
              key={img}
              className={`lightbox-thumb${i === currentIndex ? ' active' : ''}`}
              src={`${S3_BASE}/${img}`}
              alt=""
              onClick={() => onNavigate(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
