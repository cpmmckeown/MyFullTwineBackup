/**
 * deco-frame.js
 * Registers two custom HTML elements:
 *
 *   <deco-frame>        — a full 16:9 stage with art deco border
 *   <deco-button>       — a button with art deco corner ornaments
 *
 * Usage:
 *   <script src="deco-frame.js"></script>
 *   ... then use the tags freely in your HTML.
 */

/* ─────────────────────────────────────────────────
   SHARED VALUES
───────────────────────────────────────────────── */
const GOLD   = '#c9a84c';
const BG     = '#0b1020';

/* ─────────────────────────────────────────────────
   HELPER — mirror a corner group to all 4 corners
   w, h  = viewBox width / height
───────────────────────────────────────────────── */
function fourCorners(w, h, cornerSVG) {
  return `
    <!-- top-left -->
    <g stroke="${GOLD}" fill="none">${cornerSVG}</g>
    <!-- top-right -->
    <g stroke="${GOLD}" fill="none" transform="translate(${w},0) scale(-1,1)">${cornerSVG}</g>
    <!-- bottom-left -->
    <g stroke="${GOLD}" fill="none" transform="translate(0,${h}) scale(1,-1)">${cornerSVG}</g>
    <!-- bottom-right -->
    <g stroke="${GOLD}" fill="none" transform="translate(${w},${h}) scale(-1,-1)">${cornerSVG}</g>
  `;
}

/* ─────────────────────────────────────────────────
   CORNER GEOMETRY (top-left origin = 18,18)
   Edit here to restyle all four corners at once.
───────────────────────────────────────────────── */
const CORNER = `
  <!-- L-arms -->
  <line x1="18" y1="18" x2="160" y2="18"  stroke-width="2"/>
  <line x1="18" y1="18" x2="18"  y2="160" stroke-width="2"/>
  <!-- diagonal + fan rays -->
  <line x1="18" y1="18" x2="118" y2="118" stroke-width="1.2"/>
  <line x1="18" y1="18" x2="148" y2="58"  stroke-width="0.9" opacity="0.85"/>
  <line x1="18" y1="18" x2="58"  y2="148" stroke-width="0.9" opacity="0.85"/>
  <line x1="18" y1="18" x2="158" y2="34"  stroke-width="0.6" opacity="0.65"/>
  <line x1="18" y1="18" x2="34"  y2="158" stroke-width="0.6" opacity="0.65"/>
  <line x1="18" y1="18" x2="160" y2="22"  stroke-width="0.4" opacity="0.45"/>
  <line x1="18" y1="18" x2="22"  y2="160" stroke-width="0.4" opacity="0.45"/>
  <!-- arcs -->
  <path d="M 118 18 A 100 100 0 0 0 18 118" stroke-width="1.2"/>
  <path d="M  88 18 A  70  70 0 0 0 18  88" stroke-width="0.8" opacity="0.75"/>
  <path d="M  58 18 A  40  40 0 0 0 18  58" stroke-width="0.6" opacity="0.55"/>
  <!-- dash accents on outer border -->
  <line x1="170" y1="3"   x2="220" y2="3"   stroke-width="1.2" opacity="0.55"/>
  <line x1="235" y1="3"   x2="270" y2="3"   stroke-width="0.7" opacity="0.4"/>
  <line x1="3"   y1="170" x2="3"   y2="220" stroke-width="1.2" opacity="0.55"/>
  <line x1="3"   y1="235" x2="3"   y2="270" stroke-width="0.7" opacity="0.4"/>
`;

/* ─────────────────────────────────────────────────
   <deco-frame> WEB COMPONENT
   Attributes:
     width  — stage width  in px (default: 960)
     height — stage height in px (default: 540)
   All SVG geometry is authored in 1920×1080 space;
   it scales automatically to any stage size.
───────────────────────────────────────────────── */
class DecoFrame extends HTMLElement {
  connectedCallback() {
    const W = this.getAttribute('width')  || 960;
    const H = this.getAttribute('height') || 540;

    this.style.cssText = `
      display: block;
      position: relative;
      width: ${W}px;
      height: ${H}px;
      background: ${BG};
      overflow: hidden;
    `;

    /* Slot for student content */
    const slot = document.createElement('slot');
    slot.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      position: absolute;
      inset: 0;
    `;

    /* The frame SVG — sits on top, pointer-events off */
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 1920 1080');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.style.cssText = `
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    `;

    svg.innerHTML = `
      <!-- outer border -->
      <rect x="3"  y="3"  width="1914" height="1074" fill="none" stroke="${GOLD}" stroke-width="2.5"/>
      <!-- inner border -->
      <rect x="18" y="18" width="1884" height="1044" fill="none" stroke="${GOLD}" stroke-width="1"/>
      <!-- innermost thin border -->
      <rect x="28" y="28" width="1864" height="1024" fill="none" stroke="${GOLD}" stroke-width="0.5" opacity="0.5"/>

      ${fourCorners(1920, 1080, CORNER)}

      <!-- centre dashes — top & bottom -->
      <line x1="880" y1="3"    x2="940" y2="3"    stroke="${GOLD}" stroke-width="1.2" opacity="0.5"/>
      <line x1="950" y1="3"    x2="970" y2="3"    stroke="${GOLD}" stroke-width="0.7" opacity="0.35"/>
      <line x1="880" y1="1077" x2="940" y2="1077" stroke="${GOLD}" stroke-width="1.2" opacity="0.5"/>
      <line x1="950" y1="1077" x2="970" y2="1077" stroke="${GOLD}" stroke-width="0.7" opacity="0.35"/>
      <!-- centre dashes — left & right -->
      <line x1="3"    y1="510" x2="3"    y2="570" stroke="${GOLD}" stroke-width="1.2" opacity="0.5"/>
      <line x1="3"    y1="575" x2="3"    y2="600" stroke="${GOLD}" stroke-width="0.7" opacity="0.35"/>
      <line x1="1917" y1="510" x2="1917" y2="570" stroke="${GOLD}" stroke-width="1.2" opacity="0.5"/>
      <line x1="1917" y1="575" x2="1917" y2="600" stroke="${GOLD}" stroke-width="0.7" opacity="0.35"/>
    `;

    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(slot);
    shadow.appendChild(svg);
  }
}

/* ─────────────────────────────────────────────────
   SMALL CORNER — for the button (30×30 origin)
───────────────────────────────────────────────── */
const BTN_CORNER = `
  <line x1="4" y1="4" x2="26" y2="4"  stroke-width="1"/>
  <line x1="4" y1="4" x2="4"  y2="26" stroke-width="1"/>
  <line x1="4" y1="4" x2="20" y2="20" stroke-width="0.7"/>
  <line x1="4" y1="4" x2="24" y2="10" stroke-width="0.5" opacity="0.7"/>
  <line x1="4" y1="4" x2="10" y2="24" stroke-width="0.5" opacity="0.7"/>
  <path d="M 26 4 A 22 22 0 0 0 4 26" stroke-width="0.8"/>
  <path d="M 19 4 A 15 15 0 0 0 4 19" stroke-width="0.5" opacity="0.6"/>
  <line x1="30" y1="0.75" x2="50" y2="0.75" stroke-width="0.7" opacity="0.5"/>
`;

/* ─────────────────────────────────────────────────
   <deco-button> WEB COMPONENT
   Attributes:
     label — button text (default: 'Click Me')
   Slot also accepted for richer content.
───────────────────────────────────────────────── */
class DecoButton extends HTMLElement {
  connectedCallback() {
    const label = this.getAttribute('label') || this.textContent.trim() || 'Click Me';

    this.style.cssText = `display: inline-block;`;

    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <style>
        button {
          position: relative;
          background: transparent;
          border: none;
          outline: none;
          cursor: pointer;
          padding: 14px 52px;
          color: ${GOLD};
          font-family: "Palatino Linotype", Palatino, serif;
          font-size: 11px;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          transition: filter 0.2s;
        }
        button:hover  { filter: brightness(1.25); }
        button:active { filter: brightness(0.85); }
        svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          overflow: visible;
        }
      </style>
      <button>
        ${label}
        <svg viewBox="0 0 260 50" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0.75" y="0.75" width="258.5" height="48.5" fill="none" stroke="${GOLD}" stroke-width="1"/>
          <rect x="4"    y="4"    width="252"   height="42"   fill="none" stroke="${GOLD}" stroke-width="0.5"/>
          ${fourCorners(260, 50, BTN_CORNER)}
        </svg>
      </button>
    `;
  }
}

/* ─────────────────────────────────────────────────
   REGISTER BOTH ELEMENTS
───────────────────────────────────────────────── */
customElements.define('deco-frame',  DecoFrame);
customElements.define('deco-button', DecoButton);
