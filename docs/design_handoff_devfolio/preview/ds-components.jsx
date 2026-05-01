// ds-components.jsx — section content for the design-system page.

const { useState: useS } = React;

function SectionHead({ num, title, kicker, children }) {
  return (
    <div className="section-head">
      <div>
        <div className="section-num">{num}</div>
        <h2 style={{ marginTop: 6 }}>{title}</h2>
      </div>
      <p>{children}</p>
    </div>
  );
}

// ---- BRAND ----
function BrandSection() {
  return (
    <section className="section" id="brand">
      <SectionHead num="01 — Brand" title="A portfolio that doesn't fight you.">
        DevFolio helps junior developers ship a credible portfolio in an evening, not a weekend.
        The brand is honest, technical, and warm — never gamified or salesy.
      </SectionHead>

      <div className="subsection">
        <h3>Logo</h3>
        <p>The mark is a curly-brace cursor — code, by hand. The accent dot signals "live" — your portfolio is on, online, available.</p>
        <div className="grid-2">
          <div className="logo-lockup"><Logo size={56} /></div>
          <div className="logo-lockup invert"><Logo size={56} /></div>
        </div>
      </div>

      <div className="subsection">
        <h3>Voice</h3>
        <p>Direct, specific, low on superlatives. Address one person. Names of things over adjectives.</p>
        <div className="voice-table">
          <div className="voice-cell good"><div className="lbl">Do</div>"Sign in with GitHub. Pick a username. We'll fetch your repos."</div>
          <div className="voice-cell bad"><div className="lbl">Don't</div>"Effortlessly craft your stunning developer presence with our AI-powered platform."</div>
          <div className="voice-cell good"><div className="lbl">Do</div>"3 broken links, 2 unreachable, 15 ok."</div>
          <div className="voice-cell bad"><div className="lbl">Don't</div>"Oh no! Something went wrong. Please try again later 😢"</div>
          <div className="voice-cell good"><div className="lbl">Do</div>"Add a bio of 40+ characters to bump your score."</div>
          <div className="voice-cell bad"><div className="lbl">Don't</div>"Unlock your full potential — complete your profile now!"</div>
        </div>
      </div>

      <div className="subsection">
        <h3>Principles</h3>
        <div className="principles">
          <div className="principle">
            <div className="num">P1</div>
            <div className="title">Plain text first.</div>
            <div className="body">Type, hierarchy, and whitespace do the work. Surfaces are nearly invisible. Reach for color or icon only when it carries information — a status, a category, a cue to act.</div>
          </div>
          <div className="principle">
            <div className="num">P2</div>
            <div className="title">Code is part of the brand.</div>
            <div className="body">Tech-stack tags, URLs, file paths, keyboard shortcuts, dates — anything that is literally code or refers to it gets monospace. This is what makes a developer portfolio not a Squarespace site.</div>
          </div>
          <div className="principle">
            <div className="num">P3</div>
            <div className="title">AI is a tool, not a personality.</div>
            <div className="body">"Improve" buttons sit quietly next to inputs. The output is the user's draft, not the AI's voice. No sparkles trail, no celebration, no "Here's what I came up with!"</div>
          </div>
          <div className="principle">
            <div className="num">P4</div>
            <div className="title">Empty is a state, not a void.</div>
            <div className="body">Sections with no data are hidden on the public page; in the editor they show a single sentence and one button. Never a fake card with lorem ipsum.</div>
          </div>
          <div className="principle">
            <div className="num">P5</div>
            <div className="title">Status is honest.</div>
            <div className="body">If a link is broken, say so. If a profile is 40% complete, the bar is 40%, not nudged to 60% to look better. Junior devs trust real numbers more than they trust a green check.</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---- COLOR ----
function ColorSection() {
  const Swatch = ({ name, token, val, note }) => (
    <div className="swatch">
      <div className="swatch-block" style={{ background: `var(${token})` }}></div>
      <div className="swatch-meta">
        <div className="swatch-name">{name}</div>
        <div className="swatch-token mono">{token}</div>
        <div className="swatch-token" style={{ color: "var(--ink-3)" }}>{note}</div>
      </div>
    </div>
  );

  return (
    <section className="section" id="color">
      <SectionHead num="02 — Color" title="Warm neutrals, single accent.">
        Two paper-tones, three ink-tones, and one accent for the "available" / "ok" signal — same hue rotates between
        light and dark to keep recognition. We avoid saturating UI; color carries meaning, not decoration.
      </SectionHead>

      <div className="subsection">
        <h3>Dark — primary theme</h3>
        <div className="grid-4">
          {COLORS_DARK.map(c => <Swatch key={c.token + "d"} {...c} />)}
        </div>
      </div>

      <div className="subsection">
        <h3>Light</h3>
        <div className="grid-4" data-theme="light" style={{ background: "var(--paper)", padding: "var(--space-5)", borderRadius: "var(--radius-lg)", border: "1px solid var(--hairline)", color: "var(--ink)" }}>
          {COLORS_LIGHT.map(c => <Swatch key={c.token + "l"} {...c} />)}
        </div>
      </div>

      <div className="subsection">
        <h3>Accent &amp; semantic</h3>
        <div className="grid-3">
          {COLORS_ACCENT.map(c => <Swatch key={c.token + "a"} {...c} val="" />)}
        </div>
        <div className="callout" style={{ marginTop: "var(--space-5)" }}>
          <b>Why one accent?</b> &nbsp;The accent doubles as success / "available for work" — making
          the "I'm hireable" signal the most colorful thing on the page. Buttons inherit the same hue, so the entire
          UI reads as a single mood.
        </div>
      </div>

      <div className="subsection">
        <h3>shadcn/ui mapping</h3>
        <p>Drop this into <span className="mono">app/globals.css</span> &mdash; replaces the default scaffold.</p>
        <div className="code">{`@import "tailwindcss";

:root, [data-theme="dark"] {
  --background: oklch(0.165 0.008 80);
  --foreground: oklch(0.97  0.005 90);
  --card: oklch(0.205 0.008 80);
  --card-foreground: var(--foreground);
  --popover: var(--card);
  --popover-foreground: var(--foreground);
  --primary: oklch(0.78 0.12 145);
  --primary-foreground: oklch(0.18 0.02 145);
  --secondary: oklch(0.245 0.008 80);
  --secondary-foreground: var(--foreground);
  --muted: oklch(0.205 0.008 80);
  --muted-foreground: oklch(0.78 0.006 85);
  --accent: oklch(0.245 0.008 80);
  --accent-foreground: var(--foreground);
  --destructive: oklch(0.7 0.16 25);
  --destructive-foreground: var(--foreground);
  --border: oklch(0.32 0.006 80);
  --input: oklch(0.32 0.006 80);
  --ring: oklch(0.78 0.12 145);
  --radius: 0.625rem;
}

[data-theme="light"] {
  --background: oklch(0.985 0.004 90);
  --foreground: oklch(0.18  0.008 80);
  --card: oklch(0.97  0.005 90);
  --primary: oklch(0.55 0.12 145);
  --primary-foreground: oklch(0.99 0.005 90);
  --border: oklch(0.86 0.006 90);
  /* …same shape, light values… */
}`}</div>
      </div>
    </section>
  );
}

// ---- TYPOGRAPHY ----
function TypeSection() {
  return (
    <section className="section" id="type">
      <SectionHead num="03 — Typography" title="Geist, sans + mono.">
        One family in two flavors. Sans for everything human; mono for everything that's literally code &mdash;
        tags, URLs, dates, kbd, file paths. Geist is what Next.js ships and reads cleanly at 13&ndash;15px UI sizes.
      </SectionHead>

      <div className="subsection">
        <h3>Scale</h3>
        <div>
          {TYPE_SCALE.map(t => (
            <div key={t.token} className="type-row">
              <div className="type-meta">
                <b>{t.name}</b>
                <div>{t.token} · {t.px}px · {t.weight}</div>
              </div>
              <div className="type-sample" style={{ fontSize: `var(${t.token})`, fontWeight: t.weight, letterSpacing: t.px > 28 ? "-0.025em" : t.px > 18 ? "-0.012em" : 0, lineHeight: t.px > 28 ? 1.05 : 1.4 }}>
                {t.sample}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="subsection">
        <h3>Mono usage</h3>
        <p>Mono signals "this is a literal value." Use it for:</p>
        <div className="grid-2">
          <Card>
            <div className="eyebrow">Tech-stack tags</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              <Tag>TypeScript</Tag><Tag>Next.js 16</Tag><Tag>Drizzle</Tag><Tag>Better Auth</Tag>
            </div>
          </Card>
          <Card>
            <div className="eyebrow">URLs &amp; paths</div>
            <div className="mono" style={{ fontSize: 13 }}>devfolio.app/<span style={{ color: "var(--accent)" }}>elena</span></div>
            <div className="mono" style={{ fontSize: 12, color: "var(--ink-3)" }}>github.com/elena/saturn-cli</div>
          </Card>
          <Card>
            <div className="eyebrow">Keyboard</div>
            <div style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 13, color: "var(--ink-2)" }}>
              Save&nbsp;&nbsp;<span className="kbd">⌘</span><span className="kbd">S</span>
              &nbsp;&nbsp;·&nbsp;&nbsp; Submit&nbsp;&nbsp;<span className="kbd">⏎</span>
            </div>
          </Card>
          <Card>
            <div className="eyebrow">Counts &amp; status</div>
            <div className="mono" style={{ fontSize: 13, color: "var(--ink-2)" }}>3 broken &nbsp;·&nbsp; 2 unreachable &nbsp;·&nbsp; <span style={{ color: "var(--ok)" }}>15 ok</span></div>
          </Card>
        </div>
      </div>
    </section>
  );
}

// ---- SPACING / RADIUS / SHADOW ----
function GeometrySection() {
  return (
    <section className="section" id="geometry">
      <SectionHead num="04 — Spacing, radius, shadow" title="A tight 4-pt grid.">
        Eleven spacing steps doubled around 16. Five corner radii, default 10. Three soft shadows; nothing harder than
        24px Y-offset. Most surfaces use a 1px hairline instead of shadow — we earn elevation when it's needed.
      </SectionHead>

      <div className="subsection">
        <h3>Spacing</h3>
        <div>
          {SPACE.map(s => (
            <div key={s.token} className="space-row">
              <div className="lbl mono">{s.token}</div>
              <div className="bar" style={{ width: s.px }}></div>
              <div className="val">{s.px}px</div>
            </div>
          ))}
        </div>
      </div>

      <div className="subsection">
        <h3>Radius</h3>
        <div className="grid-6">
          {RADII.map(r => (
            <div key={r.token} className="radius-cell" style={{ borderRadius: r.px }}>
              <div>{r.token.replace("--radius-", "")} · {r.px}px</div>
            </div>
          ))}
        </div>
      </div>

      <div className="subsection">
        <h3>Shadow</h3>
        <div className="grid-4" style={{ background: "var(--paper-2)", padding: "var(--space-6)", borderRadius: "var(--radius-lg)", border: "1px solid var(--hairline)" }}>
          {SHADOWS.map(s => (
            <div key={s.token} className="shadow-cell" style={{ boxShadow: `var(${s.token})` }}>
              <div className="mono" style={{ fontSize: 11 }}>{s.token.replace("--shadow-", "shadow.")}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- COMPONENTS ----
function ComponentsSection() {
  const [tags, setTags] = useS(["TypeScript", "Next.js", "Drizzle", "Tailwind"]);
  const [available, setAvailable] = useS(true);
  const [dialog, setDialog] = useS(false);

  return (
    <section className="section" id="components">
      <SectionHead num="05 — Components" title="The kit.">
        These are the pieces every page is built from. They map 1:1 to shadcn primitives where possible — Button, Input,
        Badge, Dialog, Switch, Progress — restyled to the DevFolio token set.
      </SectionHead>

      <div className="subsection">
        <h3>Buttons</h3>
        <div className="tile">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
            <Btn>Save changes</Btn>
            <Btn variant="secondary">Cancel</Btn>
            <Btn variant="outline">View public page</Btn>
            <Btn variant="ghost">Skip</Btn>
            <Btn variant="ai">Improve with AI</Btn>
            <Btn variant="danger">Delete profile</Btn>
          </div>
          <hr className="hr" style={{ margin: "16px 0" }} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
            <Btn size="sm">Add</Btn>
            <Btn size="sm" variant="secondary">Cancel</Btn>
            <Btn size="lg">Sign in with GitHub</Btn>
          </div>
        </div>
      </div>

      <div className="subsection">
        <h3>Inputs</h3>
        <div className="grid-2">
          <Card>
            <Input label="Username" placeholder="elena" hint="3–20 chars · letters, numbers, hyphens" />
            <Input label="Headline" defaultValue="Frontend Engineer" />
            <Input label="GitHub URL" defaultValue="https://githb.com/elena/oops" error="That URL doesn't resolve." />
          </Card>
          <Card>
            <Textarea label="Bio" placeholder="What do you build? What are you good at?" defaultValue="I build small, fast tools — mostly TypeScript and a long-standing love affair with Postgres. Currently learning Rust at the edges." rows={5} />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
              <Btn variant="ai" size="sm">Improve</Btn>
            </div>
          </Card>
        </div>
      </div>

      <div className="subsection">
        <h3>Tags &amp; badges</h3>
        <div className="grid-2">
          <Card>
            <div className="eyebrow">Tech stack — interactive</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {tags.map(t => <Tag key={t} onRemove={() => setTags(tags.filter(x => x !== t))}>{t}</Tag>)}
              <Tag dashed onClick={() => setTags([...tags, "Postgres"])}>+ add</Tag>
            </div>
            <div className="eyebrow" style={{ marginTop: 16 }}>Suggested from projects</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              <Tag dashed>+ Drizzle</Tag><Tag dashed>+ Zod</Tag><Tag dashed>+ Vercel</Tag>
            </div>
          </Card>
          <Card>
            <div className="eyebrow">Status badges</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <Badge tone="ok">Available for work</Badge>
              <Badge tone="ok">Link ok</Badge>
              <Badge tone="warn">Server error</Badge>
              <Badge tone="danger">404 broken</Badge>
              <Badge>Draft</Badge>
            </div>
          </Card>
        </div>
      </div>

      <div className="subsection">
        <h3>Toggle &amp; progress</h3>
        <div className="grid-2">
          <Card>
            <div className="eyebrow">Toggle</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 500 }}>Available for work</div>
                <div className="df-hint">Shows a green badge on your public page.</div>
              </div>
              <Toggle on={available} onChange={setAvailable} />
            </div>
          </Card>
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ fontWeight: 500, fontSize: "var(--t-sm)" }}>Portfolio completeness</div>
              <div className="mono" style={{ fontSize: "var(--t-xs)", color: "var(--ink-3)" }}>65 / 100</div>
            </div>
            <Progress value={65} />
            <div className="df-hint" style={{ marginTop: 10 }}>Add 2 more projects to gain <b style={{ color: "var(--ink)" }}>+10</b>.</div>
          </Card>
        </div>
      </div>

      <div className="subsection">
        <h3>Card</h3>
        <div className="grid-2">
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
              <div>
                <div style={{ fontSize: "var(--t-lg)", fontWeight: 500, letterSpacing: "-0.01em" }}>Saturn CLI</div>
                <div className="mono" style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>github.com/elena/saturn-cli</div>
              </div>
              <Badge tone="ok">Live</Badge>
            </div>
            <p style={{ margin: 0, color: "var(--ink-2)", fontSize: "var(--t-sm)" }}>
              A tiny build tool for static MDX sites. Watches files, rebuilds in under 30ms, ships a single binary via Bun.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              <Tag>TypeScript</Tag><Tag>Bun</Tag><Tag>MDX</Tag>
            </div>
          </Card>
          <Card>
            <div style={{ fontSize: "var(--t-lg)", fontWeight: 500 }}>Senior Frontend Engineer</div>
            <div style={{ color: "var(--ink-2)", fontSize: "var(--t-sm)" }}>Linear &middot; <span className="mono">2023 — Present</span></div>
            <p style={{ margin: 0, color: "var(--ink-2)", fontSize: "var(--t-sm)" }}>
              Owned the editor surface — collab cursors, slash commands, keyboard system. Shipped the new mobile layout in Q3.
            </p>
          </Card>
        </div>
      </div>

      <div className="subsection">
        <h3>Dialog</h3>
        <div className="tile">
          <Btn onClick={() => setDialog(true)}>Open project dialog</Btn>
        </div>
        {dialog && (
          <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "grid", placeItems: "center", padding: 16 }}>
            <div className="df-dialog-backdrop" onClick={() => setDialog(false)}></div>
            <div className="df-dialog" style={{ position: "relative" }}>
              <div className="df-dialog-head">
                <h3>New project</h3>
                <button className="df-btn df-btn-ghost df-btn-sm" onClick={() => setDialog(false)}>✕</button>
              </div>
              <div className="df-dialog-body">
                <Input label="Title" placeholder="Saturn CLI" />
                <Textarea label="Description" placeholder="What did you build, and what was interesting about it?" />
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Btn variant="ai" size="sm">Improve with AI</Btn>
                </div>
                <div>
                  <label className="df-label">Tech stack</label>
                  <div className="df-input" style={{ height: "auto", padding: 6, display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
                    <Tag>TypeScript</Tag><Tag>Bun</Tag>
                    <input style={{ flex: 1, minWidth: 80, border: 0, outline: 0, background: "transparent", color: "inherit", fontFamily: "inherit", fontSize: 13, padding: "4px 6px" }} placeholder="add a tag…" />
                  </div>
                </div>
                <div className="grid-2">
                  <Input label="GitHub URL" placeholder="https://github.com/…" />
                  <Input label="Live URL" placeholder="https://…" />
                </div>
              </div>
              <div className="df-dialog-foot">
                <Btn variant="ghost" onClick={() => setDialog(false)}>Cancel</Btn>
                <Btn onClick={() => setDialog(false)}>Save project</Btn>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

Object.assign(window, { BrandSection, ColorSection, TypeSection, GeometrySection, ComponentsSection });
