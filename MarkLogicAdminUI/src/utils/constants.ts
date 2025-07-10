/**
 * UI constants and theme configuration
 */
export const UI_CONSTANTS = {
  // Loading and animation delays
  LOADING_DELAY: 200, // ms before showing loading spinner
  DEBOUNCE_DELAY: 300, // ms for input debouncing
  TOAST_DURATION: 4000, // ms for notification duration

  // Layout breakpoints
  BREAKPOINTS: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1440px',
  },

  // Z-index layers
  Z_INDEX: {
    modal: 1000,
    overlay: 999,
    dropdown: 100,
    header: 50,
  },

  // Component sizes
  SIZES: {
    headerHeight: '60px',
    sidebarWidth: '250px',
    cardMinHeight: '120px',
  },
} as const;

/**
 * Common CSS classes and styles
 */
export const CSS_CLASSES = {
  // Layout
  container: 'container',
  flexCenter: 'flex-center',
  gridLayout: 'grid-layout',

  // States
  loading: 'loading',
  error: 'error',
  success: 'success',
  disabled: 'disabled',

  // Interactions
  clickable: 'clickable',
  hoverable: 'hoverable',
  selected: 'selected',

  // Typography
  heading: 'heading',
  subheading: 'subheading',
  body: 'body',
  caption: 'caption',
} as const;

/**
 * Animation presets
 */
export const ANIMATIONS = {
  fadeIn: 'fadeIn 0.2s ease-in',
  slideIn: 'slideIn 0.3s ease-out',
  bounce: 'bounce 0.5s ease-in-out',
  pulse: 'pulse 1s infinite',
} as const;
