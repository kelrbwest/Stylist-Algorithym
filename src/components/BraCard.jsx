import { useState } from 'react';
import ImageLightbox from './ImageLightbox';
import imageManifest from '../data/image-manifest.json';

const S3_BASE = import.meta.env.VITE_S3_BASE_URL;

function parseFittingNotes(text) {
  if (!text) return [];
  const headingRegex = /([A-Z]{2,}(?:\s[A-Z]{2,})*)\s*:/g;
  const matches = [];
  let m;
  while ((m = headingRegex.exec(text)) !== null) {
    matches.push({ heading: m[1].trim(), index: m.index, end: m.index + m[0].length });
  }
  const seen = new Set();
  const sections = [];
  for (let i = 0; i < matches.length; i++) {
    const { heading, end } = matches[i];
    const nextIndex = i + 1 < matches.length ? matches[i + 1].index : text.length;
    const content = text.slice(end, nextIndex).trim();
    if (!seen.has(heading) && content) {
      seen.add(heading);
      sections.push({ heading, content });
    }
  }
  return sections;
}

export default function BraCard({ entry, rank }) {
  const fittingSections = parseFittingNotes(entry.fitting_notes);
  const [imgError, setImgError] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const images = imageManifest[entry.style] || [];
  const primaryImage = images[0];
  const heroUrl = S3_BASE && primaryImage && !imgError
    ? `${S3_BASE}/${primaryImage}`
    : null;

  const openLightbox = (index = 0) => {
    if (images.length === 0) return;
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <div className="bra-card">
        <div className="card-rank">#{rank}</div>

        {heroUrl ? (
          <div className="card-image-wrap" onClick={() => openLightbox(0)} title="Click to view all images">
            <img
              className="card-image"
              src={heroUrl}
              alt={`${entry.style_name} – Style ${entry.style}`}
              onError={() => setImgError(true)}
            />
            {images.length > 1 && (
              <span className="card-image-count">+{images.length - 1} photos</span>
            )}
          </div>
        ) : (
          <div className="card-image-placeholder">
            <span className="placeholder-label">Style {entry.style}</span>
          </div>
        )}

        <div className="card-body">
          <p className="card-style-num">Style {entry.style}</p>
          <h4 className="card-name">{entry.style_name}</h4>

          {fittingSections.length > 0 && (
            <details className="card-notes">
              <summary>Fitting Guide</summary>
              <div className="fitting-sections">
                {fittingSections.map(({ heading, content }) => (
                  <div key={heading} className="fitting-section">
                    <p className="fitting-heading">{heading}</p>
                    <p className="fitting-text">{content}</p>
                  </div>
                ))}
              </div>
            </details>
          )}
        </div>
      </div>

      {lightboxOpen && (
        <ImageLightbox
          images={images}
          currentIndex={lightboxIndex}
          onNavigate={setLightboxIndex}
          onClose={() => setLightboxOpen(false)}
          styleName={entry.style_name}
        />
      )}
    </>
  );
}
