// Language accent colors
const LANG_COLORS = {
  TypeScript: '#3178c6',
  JavaScript: '#f7df1e',
  Python: '#3776ab',
  Java: '#b07219',
  HTML: '#e34f26',
  CSS: '#1572b6',
  'C++': '#f34b7d',
  C: '#555555',
  Go: '#00add8',
  Rust: '#dea584',
}

// Modern dark gradient themes for repository cards
const THEMES = [
  { from: '#0284c7', to: '#4f46e5', accent: '#38bdf8' }, // Cyan to Indigo
  { from: '#7c3aed', to: '#db2777', accent: '#c084fc' }, // Violet to Rose
  { from: '#059669', to: '#0284c7', accent: '#34d399' }, // Emerald to Sky
  { from: '#ea580c', to: '#e11d48', accent: '#fb923c' }, // Orange to Crimson
  { from: '#4f46e5', to: '#9333ea', accent: '#818cf8' }, // Indigo to Purple
]

function escapeXml(unsafe) {
  if (!unsafe) return ''
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export function generateRepoCardSvg(repo, index = 0) {
  const theme = THEMES[index % THEMES.length]
  const title = escapeXml(repo.name || 'Repository')
  const description = escapeXml(
    repo.description
      ? repo.description.length > 70
        ? repo.description.slice(0, 67) + '…'
        : repo.description
      : 'Open-source GitHub project by Archit Vaghasiya.'
  )
  const language = escapeXml(repo.language || 'Code')
  const langColor = LANG_COLORS[repo.language] || theme.accent
  const stars = repo.stargazers_count ?? 0
  const forks = repo.forks_count ?? 0

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="480" viewBox="0 0 480 480">
  <defs>
    <linearGradient id="cardGrad-${index}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.from}" stop-opacity="0.3" />
      <stop offset="100%" stop-color="${theme.to}" stop-opacity="0.1" />
    </linearGradient>
    <linearGradient id="borderGrad-${index}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.accent}" stop-opacity="0.7" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.15" />
    </linearGradient>
    <radialGradient id="glow-${index}" cx="50%" cy="0%" r="70%">
      <stop offset="0%" stop-color="${theme.accent}" stop-opacity="0.35" />
      <stop offset="100%" stop-color="transparent" stop-opacity="0" />
    </radialGradient>
    <pattern id="grid-${index}" width="24" height="24" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.2" fill="#ffffff" fill-opacity="0.06" />
    </pattern>
  </defs>

  <!-- Background Base -->
  <rect width="480" height="480" rx="28" fill="#080c17" />
  <rect width="480" height="480" rx="28" fill="url(#cardGrad-${index})" />
  <rect width="480" height="480" rx="28" fill="url(#glow-${index})" />
  <rect width="480" height="480" rx="28" fill="url(#grid-${index})" />

  <!-- Outer Border -->
  <rect x="1.5" y="1.5" width="477" height="477" rx="26.5" fill="none" stroke="url(#borderGrad-${index})" stroke-width="2" />

  <!-- Header: GitHub & Folder Icon -->
  <g transform="translate(40, 44)">
    <!-- GitHub Octocat Icon -->
    <path fill="#f8fafc" opacity="0.9" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" transform="scale(1.2)" />

    <!-- Public Badge -->
    <rect x="290" y="2" width="70" height="24" rx="12" fill="#ffffff" fill-opacity="0.1" />
    <text x="325" y="18" fill="#94a3b8" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="11" font-weight="600" text-anchor="middle">Public</text>
  </g>

  <!-- Repository Title -->
  <text x="40" y="170" fill="#ffffff" font-family="'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif" font-size="30" font-weight="800" letter-spacing="-0.5">${title}</text>

  <!-- Description -->
  <text x="40" y="225" fill="#94a3b8" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="16" font-weight="400">
    <tspan x="40" dy="0">${description}</tspan>
  </text>

  <!-- Bottom Details Bar -->
  <g transform="translate(40, 380)">
    <!-- Language Dot & Name -->
    <circle cx="8" cy="8" r="6" fill="${langColor}" />
    <text x="24" y="13" fill="#f8fafc" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="14" font-weight="600">${language}</text>

    <!-- Star Count -->
    <g transform="translate(160, 0)">
      <path d="M7 0l2.16 4.38 4.84.7-3.5 3.41.83 4.82L7 11.04 2.67 13.31l.83-4.82-3.5-3.41 4.84-.7L7 0z" fill="#f59e0b" transform="scale(1.1)" />
      <text x="22" y="13" fill="#cbd5e1" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="13" font-weight="500">${stars}</text>
    </g>

    <!-- Fork Count -->
    <g transform="translate(230, 0)">
      <path d="M4 1a2 2 0 100 4 2 2 0 000-4zm8 8a2 2 0 100 4 2 2 0 000-4zm-8 4a2 2 0 100 4 2 2 0 000-4zM5 5v4h2v1H5v2H3v-2H1v-1h2V5h2z" fill="#94a3b8" opacity="0.8" transform="scale(1.1)" />
      <text x="20" y="13" fill="#cbd5e1" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="13" font-weight="500">${forks}</text>
    </g>

    <!-- Interactive Hint -->
    <text x="390" y="13" fill="${theme.accent}" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="13" font-weight="700" text-anchor="end">Explore ↗</text>
  </g>
</svg>`

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}
