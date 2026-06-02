/**
 * Custom CSS styles for the Todo app.
 * Uses Sero theme variables with local fallbacks.
 */

export const TODO_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300;1,9..40,400&display=swap');

  .td-root {
    --td-bg: #0f1117;
    --td-bg-surface: #191b23;
    --td-bg-elevated: #22252f;
    --td-text: #e8e4df;
    --td-muted: #8b8d97;
    --td-dim: #5c5e6a;
    --td-accent: var(--brand-primary, #34d399);
    --td-accent-hover: var(--brand-primary-hover, #6ee7b7);
    --td-accent-foreground: var(--brand-primary-foreground, #052e1c);
    --td-accent-glow: var(--brand-primary-muted, rgba(52, 211, 153, 0.12));
    --td-accent-border: var(--brand-primary-border, rgba(52, 211, 153, 0.2));
    --td-success: #34d399;
    --td-danger: #f87171;
    --td-border: rgba(255, 255, 255, 0.07);

    font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    background: var(--td-bg);
    color: var(--td-text);
  }

  @supports (color: var(--bg-base)) {
    .td-root {
      --td-bg: var(--bg-base, #0f1117);
      --td-bg-surface: var(--bg-surface, #191b23);
      --td-bg-elevated: var(--bg-elevated, #22252f);
      --td-text: var(--text-primary, #e8e4df);
      --td-border: var(--border, rgba(255, 255, 255, 0.07));
    }
  }

  .td-root h1 {
    font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    font-weight: 500;
  }

  .td-card {
    background: var(--td-bg-surface);
    border: 1px solid var(--td-border);
    border-radius: 12px;
    width: 100%;
  }

  .td-input {
    background: var(--td-bg-elevated);
    border: 1px solid var(--td-border);
    border-radius: 8px;
    padding: 8px 12px;
    font-size: 13px;
    color: var(--td-text);
    font-family: 'DM Sans', sans-serif;
    outline: none;
    transition: border-color 0.15s;
    width: 100%;
  }
  .td-input::placeholder { color: var(--td-dim); }
  .td-input:focus { border-color: var(--td-accent); }

  .td-button {
    background: var(--td-accent);
    color: var(--td-accent-foreground);
    border: none;
    border-radius: 8px;
    padding: 8px 18px;
    font-size: 13px;
    font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
  }
  .td-button:hover:not(:disabled) {
    background: var(--td-accent-hover);
    box-shadow: 0 0 20px var(--td-accent-glow);
  }
  .td-button:disabled {
    opacity: 0.35;
    cursor: default;
  }

  .td-checkbox {
    width: 18px;
    height: 18px;
    border-radius: 5px;
    border: 1.5px solid var(--td-dim);
    background: transparent;
    cursor: pointer;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    padding: 0;
  }
  .td-checkbox:hover {
    border-color: var(--td-accent);
  }
  .td-checkbox.checked {
    background: var(--td-accent);
    border-color: var(--td-accent);
  }
  .td-checkbox.checked:hover {
    background: var(--td-accent-hover);
    border-color: var(--td-accent-hover);
  }

  .td-todo-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 16px;
    border-radius: 8px;
    transition: background 0.12s;
  }
  .td-todo-item:hover {
    background: var(--td-bg-elevated);
  }

  .td-remove-btn {
    opacity: 0;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    color: var(--td-dim);
    transition: all 0.12s;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .td-todo-item:hover .td-remove-btn {
    opacity: 1;
  }
  .td-remove-btn:hover {
    color: var(--td-danger);
    background: rgba(248, 113, 113, 0.1);
  }

  .td-progress-bar {
    height: 3px;
    border-radius: 2px;
    background: var(--td-bg-elevated);
    overflow: hidden;
  }
  .td-progress-fill {
    height: 100%;
    border-radius: 2px;
    background: var(--td-accent);
    transition: width 0.3s ease;
  }

  .td-clear-btn {
    background: none;
    border: none;
    color: var(--td-dim);
    font-size: 12px;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 6px;
    transition: all 0.12s;
  }
  .td-clear-btn:hover {
    color: var(--td-muted);
    background: var(--td-bg-elevated);
  }

  .td-empty-orb {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: radial-gradient(circle at 40% 40%, var(--td-accent) 0%, transparent 70%);
    opacity: 0.15;
    animation: td-pulse 3s ease-in-out infinite;
  }

  @keyframes td-pulse {
    0%, 100% { transform: scale(1); opacity: 0.15; }
    50% { transform: scale(1.1); opacity: 0.25; }
  }

  @keyframes td-fade-in {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .td-animate-in {
    animation: td-fade-in 0.3s ease-out both;
  }

  .td-filter-btn {
    background: none;
    border: none;
    color: var(--td-dim);
    font-size: 12px;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    padding: 4px 10px;
    border-radius: 6px;
    transition: all 0.12s;
  }
  .td-filter-btn:hover {
    color: var(--td-muted);
    background: var(--td-bg-elevated);
  }
  .td-filter-btn.active {
    color: var(--td-accent);
    background: var(--td-accent-glow);
  }
`;
