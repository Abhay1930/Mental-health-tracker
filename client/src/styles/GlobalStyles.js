import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    /* Accessibility variables */
    --font-size-multiplier: 1;
    --line-height: 1.5;
    /* Color palette - inspired by Apple's calm design */
    --primary-color: #0071e3;
    --secondary-color: #86c1fd;
    --background-color: #f5f5f7;
    --card-background: #ffffff;
    --text-color: #1d1d1f;
    --text-secondary: #86868b;
    --success-color: #4cd964;
    --warning-color: #ffcc00;
    --error-color: #ff3b30;
    --border-color: #d2d2d7;
    --shadow-color: rgba(0, 0, 0, 0.1);

    /* Dark mode colors */
    --dark-primary-color: #0a84ff;
    --dark-secondary-color: #5e9eff;
    --dark-background-color: #1c1c1e;
    --dark-card-background: #2c2c2e;
    --dark-text-color: #ffffff;
    --dark-text-secondary: #ebebf5;
    --dark-border-color: #38383a;
    --dark-shadow-color: rgba(0, 0, 0, 0.3);

    /* Typography */
    --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    --font-size-small: calc(0.875rem * var(--font-size-multiplier));
    --font-size-medium: calc(1rem * var(--font-size-multiplier));
    --font-size-large: calc(1.25rem * var(--font-size-multiplier));
    --font-size-xlarge: calc(1.5rem * var(--font-size-multiplier));
    --font-size-xxlarge: calc(2rem * var(--font-size-multiplier));

    /* Spacing */
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 2rem;
    --spacing-xxl: 3rem;

    /* Border radius */
    --border-radius-sm: 4px;
    --border-radius-md: 8px;
    --border-radius-lg: 12px;
    --border-radius-xl: 20px;

    /* Transitions */
    --transition-fast: 0.2s ease;
    --transition-normal: 0.3s ease;
    --transition-slow: 0.5s ease;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body, #root {
    height: 100%;
    width: 100%;
    overflow-x: hidden;
  }

  body {
    font-family: var(--font-family);
    background-color: var(--background-color);
    color: var(--text-color);
    line-height: var(--line-height);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    transition: background-color var(--transition-normal), color var(--transition-normal);
  }

  /* Accessibility Classes */
  body.high-contrast {
    --text-color: #000000;
    --text-secondary: #333333;
    --background-color: #ffffff;
    --card-background: #f8f8f8;
    --border-color: #000000;
    --primary-color: #0000cc;
    --secondary-color: #0000aa;
  }

  body.dark-mode.high-contrast {
    --text-color: #ffffff;
    --text-secondary: #cccccc;
    --background-color: #000000;
    --card-background: #222222;
    --border-color: #ffffff;
    --primary-color: #66ccff;
    --secondary-color: #99ddff;
  }

  body.reduced-motion * {
    transition: none !important;
    animation: none !important;
  }

  body.dyslexic-font {
    --font-family: 'OpenDyslexic', 'Comic Sans MS', 'Comic Sans', cursive, sans-serif;
  }

  /* Dark mode styles */
  body.dark-mode {
    --primary-color: var(--dark-primary-color);
    --secondary-color: var(--dark-secondary-color);
    --background-color: var(--dark-background-color);
    --card-background: var(--dark-card-background);
    --text-color: var(--dark-text-color);
    --text-secondary: var(--dark-text-secondary);
    --border-color: var(--dark-border-color);
    --shadow-color: var(--dark-shadow-color);
  }

  #root {
    display: flex;
    flex-direction: column;
    max-width: 100%;
    margin: 0;
    padding: 0;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.2;
    margin-bottom: var(--spacing-md);
  }

  h1 {
    font-size: var(--font-size-xxlarge);
  }

  h2 {
    font-size: var(--font-size-xlarge);
  }

  h3 {
    font-size: var(--font-size-large);
  }

  p {
    margin-bottom: var(--spacing-md);
  }

  a {
    color: var(--primary-color);
    text-decoration: none;
    transition: color var(--transition-fast);
  }

  a:hover {
    color: var(--secondary-color);
  }

  button {
    cursor: pointer;
    font-family: var(--font-family);
    font-size: var(--font-size-medium);
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--border-radius-md);
    border: none;
    background-color: var(--primary-color);
    color: white;
    transition: background-color var(--transition-fast);
  }

  button:hover {
    background-color: var(--secondary-color);
  }

  input, textarea, select {
    font-family: var(--font-family);
    font-size: var(--font-size-medium);
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--border-radius-md);
    border: 1px solid var(--border-color);
    background-color: var(--card-background);
    width: 100%;
    transition: border-color var(--transition-fast);
  }

  input:focus, textarea:focus, select:focus {
    outline: none;
    border-color: var(--primary-color);
  }

  /* Utility classes */
  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--spacing-md);
  }

  .card {
    background-color: var(--card-background);
    border-radius: var(--border-radius-lg);
    box-shadow: 0 4px 6px var(--shadow-color);
    padding: var(--spacing-lg);
    margin-bottom: var(--spacing-lg);
  }

  .btn-primary {
    background-color: var(--primary-color);
    color: white;
  }

  .btn-secondary {
    background-color: transparent;
    color: var(--primary-color);
    border: 1px solid var(--primary-color);
  }

  .text-center {
    text-align: center;
  }

  .flex {
    display: flex;
  }

  .flex-column {
    flex-direction: column;
  }

  .items-center {
    align-items: center;
  }

  .justify-center {
    justify-content: center;
  }

  .justify-between {
    justify-content: space-between;
  }

  .gap-sm {
    gap: var(--spacing-sm);
  }

  .gap-md {
    gap: var(--spacing-md);
  }

  .gap-lg {
    gap: var(--spacing-lg);
  }

  .mt-sm { margin-top: var(--spacing-sm); }
  .mt-md { margin-top: var(--spacing-md); }
  .mt-lg { margin-top: var(--spacing-lg); }

  .mb-sm { margin-bottom: var(--spacing-sm); }
  .mb-md { margin-bottom: var(--spacing-md); }
  .mb-lg { margin-bottom: var(--spacing-lg); }
`;

export default GlobalStyles;
