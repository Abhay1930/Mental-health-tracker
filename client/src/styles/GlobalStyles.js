import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    --primary-color: #6366f1;
    --primary-light: #818cf8;
    --primary-dark: #4f46e5;
    --secondary-color: #0ea5e9;
    --accent-color: #a855f7;
    
    --background-color: #f8fafc;
    --card-background: rgba(255, 255, 255, 0.8);
    --text-color: #0f172a;
    --text-secondary: #64748b;
    
    --success-color: #10b981;
    --warning-color: #f59e0b;
    --error-color: #ef4444;
    
    --border-color: rgba(226, 232, 240, 0.8);
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);

    /* Glassmorphism */
    --glass-bg: rgba(255, 255, 255, 0.7);
    --glass-border: rgba(255, 255, 255, 0.4);
    --glass-blur: blur(12px);

    /* Typography */
    --font-main: 'Inter', system-ui, sans-serif;
    --font-heading: 'Outfit', sans-serif;
    
    --spacing-xs: 0.5rem;
    --spacing-sm: 0.75rem;
    --spacing-md: 1.25rem;
    --spacing-lg: 2rem;
    --spacing-xl: 3rem;

    --border-radius-md: 12px;
    --border-radius-lg: 18px;
    --border-radius-xl: 28px;
  }

  body.dark-mode {
    --background-color: #0f172a;
    --card-background: rgba(30, 41, 59, 0.7);
    --text-color: #f8fafc;
    --text-secondary: #94a3b8;
    --border-color: rgba(51, 65, 85, 0.5);
    
    --glass-bg: rgba(30, 41, 59, 0.6);
    --glass-border: rgba(255, 255, 255, 0.1);
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: var(--font-main);
    background-color: var(--background-color);
    color: var(--text-color);
    line-height: 1.6;
    background-image: 
      radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.05) 0px, transparent 50%),
      radial-gradient(at 100% 100%, rgba(168, 85, 247, 0.05) 0px, transparent 50%);
    background-attachment: fixed;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
    font-weight: 700;
    letter-spacing: -0.02em;
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
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
  }

  /* Glassmorphism Utility */
  .glass {
    background: var(--glass-bg);
    backdrop-filter: var(--glass-blur);
    -webkit-backdrop-filter: var(--glass-blur);
    border: 1px solid var(--glass-border);
    box-shadow: var(--shadow-lg);
  }

  /* Utility classes */
  .container {
    width: 100%;
    max-width: 1240px;
    margin: 0 auto;
    padding: 0 var(--spacing-md);
  }

  .text-gradient {
    background: var(--wellness-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .flex { display: flex; }
  .flex-column { flex-direction: column; }
  .items-center { align-items: center; }
  .justify-center { justify-content: center; }
  .justify-between { justify-content: space-between; }
  .gap-sm { gap: var(--spacing-sm); }
  .gap-md { gap: var(--spacing-md); }
  .gap-lg { gap: var(--spacing-lg); }

  .mt-sm { margin-top: var(--spacing-sm); }
  .mt-md { margin-top: var(--spacing-md); }
  .mt-lg { margin-top: var(--spacing-lg); }
  .mb-sm { margin-bottom: var(--spacing-sm); }
  .mb-md { margin-bottom: var(--spacing-md); }
  .mb-lg { margin-bottom: var(--spacing-lg); }
`;

export default GlobalStyles;
