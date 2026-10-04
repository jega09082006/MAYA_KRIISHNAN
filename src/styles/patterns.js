// Pure SVG pattern helper for Forest Gold theme
const toPattern = (svgString) => `url("data:image/svg+xml,${encodeURIComponent(svgString)}")`;

// Storefront Body Mandala Background (forest green #2d5a3d at ~4% opacity)
export const bodyMandalaSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'><g fill='none' stroke='%232d5a3d' stroke-width='1.2' opacity='0.04'><circle cx='80' cy='80' r='60'/><circle cx='80' cy='80' r='45'/><circle cx='80' cy='80' r='30'/><circle cx='80' cy='80' r='15'/><path d='M80 20 C60 40, 60 60, 80 80 C100 60, 100 40, 80 20 Z'/><path d='M80 80 C60 100, 60 120, 80 140 C100 120, 100 100, 80 80 Z'/><path d='M20 80 C40 60, 60 60, 80 80 C60 100, 40 100, 20 80 Z'/><path d='M80 80 C100 60, 120 60, 140 80 C120 100, 100 100, 80 80 Z'/><path d='M37.5 37.5 C55 45, 65 55, 80 80 C55 65, 45 55, 37.5 37.5 Z'/><path d='M122.5 37.5 C105 45, 95 55, 80 80 C105 65, 115 55, 122.5 37.5 Z'/><path d='M37.5 122.5 C55 115, 65 105, 80 80 C55 95, 45 105, 37.5 122.5 Z'/><path d='M122.5 122.5 C105 115, 95 105, 80 80 C105 95, 115 105, 122.5 122.5 Z'/></g></svg>`;

// Hero Background Mandala (gold #d99c2b on deep forest #1d3d29 at ~6% opacity)
export const heroMandalaSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'><g fill='none' stroke='%23d99c2b' stroke-width='1.2' opacity='0.06'><circle cx='80' cy='80' r='60'/><circle cx='80' cy='80' r='45'/><circle cx='80' cy='80' r='30'/><circle cx='80' cy='80' r='15'/><path d='M80 20 C60 40, 60 60, 80 80 C100 60, 100 40, 80 20 Z'/><path d='M80 80 C60 100, 60 120, 80 140 C100 120, 100 100, 80 80 Z'/><path d='M20 80 C40 60, 60 60, 80 80 C60 100, 40 100, 20 80 Z'/><path d='M80 80 C100 60, 120 60, 140 80 C120 100, 100 100, 80 80 Z'/><path d='M37.5 37.5 C55 45, 65 55, 80 80 C55 65, 45 55, 37.5 37.5 Z'/><path d='M122.5 37.5 C105 45, 95 55, 80 80 C105 65, 115 55, 122.5 37.5 Z'/><path d='M37.5 122.5 C55 115, 65 105, 80 80 C55 95, 45 105, 37.5 122.5 Z'/><path d='M122.5 122.5 C105 115, 95 105, 80 80 C105 95, 115 105, 122.5 122.5 Z'/></g></svg>`;

// Lotus Petal Tile Pattern for Banner/Suggestion Headers (gold lotus petals, low opacity)
export const lotusTileSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'><g fill='none' stroke='%23d99c2b' stroke-width='1.2' opacity='0.10'><path d='M40 10 C30 25, 30 35, 40 50 C50 35, 50 25, 40 10 Z'/><path d='M40 50 C30 65, 30 75, 40 90 C50 75, 50 65, 40 50 Z'/><path d='M10 40 C25 30, 35 30, 50 40 C35 50, 25 50, 10 40 Z'/><path d='M50 40 C65 30, 75 30, 90 40 C75 50, 65 50, 50 40 Z'/><circle cx='40' cy='40' r='4' fill='%23d99c2b' opacity='0.2'/></g></svg>`;

// Export ready-to-use CSS background-image strings
export const bodyPattern = toPattern(bodyMandalaSvg);
export const heroPattern = toPattern(heroMandalaSvg);
export const lotusPattern = toPattern(lotusTileSvg);

// Export data URIs for backwards compatibility
export const bodyMandalaDataUri = bodyPattern;
export const heroMandalaDataUri = heroPattern;
export const lotusTileDataUri = lotusPattern;
