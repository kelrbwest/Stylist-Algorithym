import stylesData from '../data/styles.json';

const AGE_GROUPS = [25, 40, 55];

export const AGE_TO_TISSUE = { 25: 'Firm', 40: 'Medium', 55: 'Soft' };

export function mapAge(age) {
  const n = parseInt(age, 10);
  if (isNaN(n) || n < 16 || n > 99) return null;
  if (n < 35) return 25;   // Under 35
  if (n < 50) return 40;   // 35–49
  return 55;               // 50+
}

export const CAPSULES = [
  { key: 'Everyday Bras', label: 'Everyday Bras' },
  { key: 'Special Bras',  label: 'Lace Bras' },
  { key: 'Strapless Bras', label: 'Strapless Bras' },
  { key: 'Active Bras',   label: 'Active Bras' },
  { key: 'Cami Bras',     label: 'Cami Bras' },
  { key: 'Lounge Bras',   label: 'Lounge Bras' },
];

export function getRecommendations({ ageGroup, bodyFirmness }) {
  const breastTissue = AGE_TO_TISSUE[ageGroup];
  const filtered = stylesData.filter(
    (e) =>
      e.age_group === ageGroup &&
      e.breast_tissue === breastTissue &&
      e.body_firmness === bodyFirmness
  );

  const results = {};

  for (const capsule of CAPSULES) {
    const capsuleEntries = filtered
      .filter((e) => e.capsule === capsule.key)
      .sort((a, b) => b.nps_score - a.nps_score);

    // Deduplicate by style, keep top 3
    const seen = new Set();
    const top3 = [];
    for (const e of capsuleEntries) {
      if (!seen.has(e.style)) {
        seen.add(e.style);
        top3.push(e);
      }
      if (top3.length === 3) break;
    }
    results[capsule.key] = top3;
  }

  return results;
}

export function getAvailableFirmness(ageGroup) {
  const breastTissue = AGE_TO_TISSUE[ageGroup];
  const available = new Set();
  for (const entry of stylesData) {
    if (entry.breast_tissue === breastTissue) {
      available.add(entry.body_firmness);
    }
  }
  return available;
}
