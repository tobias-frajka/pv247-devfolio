// ds-primitives.jsx — DevFolio component primitives (live-rendered building blocks).

const { useState, useEffect, useRef } = React;

function Btn({ variant = "primary", size = "md", children, ...rest }) {
  const cls = `df-btn df-btn-${variant}` + (size === "sm" ? " df-btn-sm" : size === "lg" ? " df-btn-lg" : "");
  return <button className={cls} {...rest}>{children}</button>;
}

function Tag({ children, variant, onRemove, onClick, dashed }) {
  let cls = "df-tag";
  if (variant === "accent") cls += " df-tag-accent";
  if (variant === "outline") cls += " df-tag-outline";
  if (dashed) cls += " df-tag-suggest";
  return (
    <span className={cls} onClick={onClick} style={onClick ? { cursor: "pointer" } : null}>
      {children}
      {onRemove && <span className="df-tag-x" onClick={onRemove}>×</span>}
    </span>
  );
}

function Badge({ tone = "neutral", children }) {
  const cls = "df-badge" + (tone === "ok" ? " df-badge-ok" : tone === "warn" ? " df-badge-warn" : tone === "danger" ? " df-badge-danger" : "");
  return <span className={cls}><span className="dot"></span>{children}</span>;
}

function Toggle({ on, onChange, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <button type="button" className={"df-toggle" + (on ? " is-on" : "")} onClick={() => onChange(!on)} aria-pressed={on}></button>
      {label && <span style={{ fontSize: "var(--t-sm)", color: "var(--ink-2)" }}>{label}</span>}
    </div>
  );
}

function Input({ label, hint, error, ...rest }) {
  return (
    <div>
      {label && <label className="df-label">{label}</label>}
      <input className={"df-input" + (error ? " is-error" : "")} {...rest} />
      {error ? <div className="df-error">{error}</div> : hint ? <div className="df-hint">{hint}</div> : null}
    </div>
  );
}

function Textarea({ label, hint, ...rest }) {
  return (
    <div>
      {label && <label className="df-label">{label}</label>}
      <textarea className="df-textarea" {...rest}></textarea>
      {hint && <div className="df-hint">{hint}</div>}
    </div>
  );
}

function Progress({ value, max = 100 }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="df-progress" role="progressbar" aria-valuenow={value} aria-valuemax={max}>
      <div className="df-progress-bar" style={{ width: `${pct}%` }}></div>
    </div>
  );
}

function Card({ children, style }) {
  return <div className="df-card" style={style}>{children}</div>;
}

// "Logo" — wordmark with the bracket-cursor mark.
function Logo({ size = 28, color, mono = false }) {
  const c = color || "currentColor";
  return (
    <span className="brand" style={{ fontSize: size * 0.78, color: c }}>
      <span className="brand-mark" style={{ width: size, height: size, fontSize: size * 0.5, background: mono ? c : null, color: mono ? "var(--paper)" : null }}>
        {"{ }"}
      </span>
      <span style={{ letterSpacing: "-0.015em" }}>devfolio</span>
    </span>
  );
}

// Placeholder image with monospace explainer
function Placeholder({ children, height = 180, style }) {
  return (
    <div className="placeholder-img" style={{ height, ...style }}>
      {children || "image"}
    </div>
  );
}

Object.assign(window, { Btn, Tag, Badge, Toggle, Input, Textarea, Progress, Card, Logo, Placeholder });
