import { useState } from 'react';

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

  const imageUrl =
    S3_BASE && entry.image_key && !imgError
      ? `${S3_BASE}/${entry.image_key}`
      : null;

  return (
    <div className="bra-card">
      <div className="card-rank">#{rank}</div>

      {imageUrl ? (
        <img
          className="card-image"
          src={imageUrl}
          alt={`${entry.style_name} – Style ${entry.style}`}
          onError={() => setImgError(true)}
        />
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
  );
}
