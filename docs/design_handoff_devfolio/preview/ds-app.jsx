// ds-app.jsx — design system shell + tweaks.

const { useState, useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "dark",
  "accentHue": 145,
  "accentChroma": 0.12
}/*EDITMODE-END*/;

const NAV = [
  { id: "intro",      num: "00", label: "Overview" },
  { id: "brand",      num: "01", label: "Brand" },
  { id: "color",      num: "02", label: "Color" },
  { id: "type",       num: "03", label: "Typography" },
  { id: "geometry",   num: "04", label: "Geometry" },
  { id: "components", num: "05", label: "Components" },
  { id: "mocks",      num: "06", label: "Page mockups" }
];

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [active, setActive] = useState("intro");

  // apply theme + accent to root
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", t.theme);
    document.documentElement.style.setProperty("--accent-h", t.accentHue);
    document.documentElement.style.setProperty("--accent-c", t.accentChroma);
  }, [t.theme, t.accentHue, t.accentChroma]);

  // scrollspy
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: "-30% 0px -60% 0px", threshold: 0 });
    NAV.forEach(n => {
      const el = document.getElementById(n.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 32, behavior: "smooth" });
  };

  return (
    <div className="shell">
      <nav className="shell-nav">
        <Logo size={26} />
        <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 2 }}>design system · v0.1</div>

        <div className="nav-group">
          <div className="nav-group-label">Sections</div>
          {NAV.map(n => (
            <a key={n.id} className={"nav-item" + (active === n.id ? " is-active" : "")} onClick={() => scrollTo(n.id)}>
              <span>{n.label}</span>
              <span className="num">{n.num}</span>
            </a>
          ))}
        </div>

        <div className="nav-group" style={{ marginTop: "auto" }}>
          <div className="nav-group-label">Repo</div>
          <a className="nav-item" href="https://github.com/tobias-frajka/pv247-devfolio" target="_blank">
            <span>pv247-devfolio</span><span className="num">↗</span>
          </a>
          <div className="mono" style={{ fontSize: 10.5, color: "var(--ink-3)", padding: "8px 8px 0" }}>
            FI MUNI · PV247 · 2025
          </div>
        </div>
      </nav>

      <main className="shell-main">
        <section className="ds-hero" id="intro">
          <div className="eyebrow">DevFolio · design system v0.1</div>
          <h1>The portfolio<br />you don't have to <span className="accent">design</span>.</h1>
          <p className="lede">
            DevFolio is a portfolio builder for developers — a Next.js app that turns five forms into a server-rendered
            public page at <span className="mono" style={{ color: "var(--ink)" }}>devfolio.app/[username]</span>. This document is its
            design language: principles, tokens, components, and page mockups, all paired with shadcn/ui CSS variables
            ready to drop into <span className="mono" style={{ color: "var(--ink)" }}>app/globals.css</span>.
          </p>
          <div className="meta">
            <div><b>Audience</b> · junior devs &amp; students</div>
            <div><b>Stack</b> · Next.js 16 · Tailwind · shadcn/ui · Geist</div>
            <div><b>Mode</b> · dark-primary, light supported</div>
            <div><b>Accent</b> · single hue, semantic-anchored</div>
          </div>
        </section>

        <BrandSection />
        <ColorSection />
        <TypeSection />
        <GeometrySection />
        <ComponentsSection />
        <MocksSection />

        <footer style={{ borderTop: "1px solid var(--hairline)", paddingTop: 24, marginTop: 64, display: "flex", justifyContent: "space-between", color: "var(--ink-3)", fontSize: "var(--t-xs)" }} className="mono">
          <div>devfolio · design system · v0.1</div>
          <div>last updated · 2026-05-01</div>
        </footer>
      </main>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Theme" />
        <TweakRadio label="Mode" value={t.theme} options={["dark", "light"]} onChange={(v) => setTweak("theme", v)} />
        <TweakSection label="Accent" />
        <TweakSlider label="Hue" value={t.accentHue} min={0} max={360} step={1} unit="°" onChange={(v) => setTweak("accentHue", v)} />
        <TweakSlider label="Chroma" value={t.accentChroma} min={0} max={0.25} step={0.01} onChange={(v) => setTweak("accentChroma", v)} />
        <TweakSection label="Presets" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
          {[
            { name: "moss", h: 145, c: 0.12 },
            { name: "amber", h: 75, c: 0.13 },
            { name: "sky", h: 230, c: 0.12 },
            { name: "rose", h: 15, c: 0.13 }
          ].map(p => (
            <button key={p.name} className="df-btn df-btn-secondary df-btn-sm" style={{ padding: "0 6px" }}
              onClick={() => { setTweak({ accentHue: p.h, accentChroma: p.c }); }}>
              <span style={{ width: 8, height: 8, borderRadius: 4, background: `oklch(0.7 ${p.c} ${p.h})`, marginRight: 6 }}></span>
              {p.name}
            </button>
          ))}
        </div>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
