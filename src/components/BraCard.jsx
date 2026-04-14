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

/**
 * viewMode: 'flatlay' | 'model'
 *  - flatlay: show image[0] (flatlay), hover → image[3] (front-side model)
 *  - model:   show image[3] (front-side model), hover → image[2] (back model)
 */
export default function BraCard({ entry, rank, viewMode = 'flatlay' }) {
  const fittingSections = parseFittingNotes(entry.fitting_notes);
  const [imgError, setImgError] = useState(false);
  const [hoverImgError, setHoverImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const images = (imageManifest[entry.style] || []).slice(0, 7);

  // Primary and hover indices based on viewMode
  const primaryIdx = viewMode === 'model' ? 3 : 0;
  const hoverIdx = viewMode === 'model' ? 2 : 3;

  const primaryImage = images[primaryIdx] || images[0];
  const hoverImage = images[hoverIdx];

  const heroUrl = S3_BASE && primaryImage && !imgError
    ? `${S3_BASE}/${primaryImage}`
    : null;

  const hoverUrl = S3_BASE && hoverImage && !hoverImgError
    ? `${S3_BASE}/${hoverImage}`
    : null;

  const displayUrl = isHovered && hoverUrl ? hoverUrl : heroUrl;

  const openLightbox = (index = 0) => {
    if (images.length === 0) return;
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <div className="bra-card">
        <div className="card-rank">#{rank}</div>

        {displayUrl ? (
          <div
            className="card-image-wrap"
            onClick={() => openLightbox(0)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            title="Click to view all images"
          >
            <img
              className="card-image"
              src={displayUrl}
              alt={`${entry.style_name} – Style ${entry.style}`}
              onError={() => {
                if (isHovered) setHoverImgError(true);
                else setImgError(true);
              }}
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

          <div className="card-actions">
            <button className="card-action-btn card-action-btn--wishlist" onClick={(e) => e.stopPropagation()}>
              ♡ Save to Wishlist
            </button>
          </div>
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
