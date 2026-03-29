function parseFittingNotes(text) {
  if (!text) return [];

  // Find all subheadings (ALL CAPS words followed by colon) and their positions
  const headingRegex = /([A-Z]{2,}(?:\s[A-Z]{2,})*)\s*:/g;
  const matches = [];
  let m;
  while ((m = headingRegex.exec(text)) !== null) {
    matches.push({ heading: m[1].trim(), index: m.index, end: m.index + m[0].length });
  }

  // Extract content between headings; skip duplicate headings (keep first only)
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

  return (
    <div className="bra-card">
      <div className="card-rank">#{rank}</div>

      {/* Image placeholder – AWS hook */}
      <div className="card-image-placeholder">
        <span className="placeholder-label">Style {entry.style}</span>
      </div>

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
