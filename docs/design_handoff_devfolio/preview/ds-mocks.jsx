// ds-mocks.jsx — page mockups: landing, public profile, dashboard editor.

function MockFrame({ url, children, style, minWidth = 1100 }) {
  return (
    <div className="mock-frame" style={style}>
      <div className="mock-toolbar">
        <div className="traffic"><span></span><span></span><span></span></div>
        <div className="mock-url mono">{url}</div>
        <div style={{ width: 40 }}></div>
      </div>
      <div className="mock-scroll" style={{ "--mock-min": minWidth + "px" }}>
        {children}
      </div>
    </div>
  );
}

// ---------- Landing ----------
function LandingMock() {
  return (
    <MockFrame url="devfolio.app">
      <div style={{ padding: "32px 40px", background: "var(--paper)" }}>
        {/* nav */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 64 }}>
          <Logo size={28} />
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <a className="df-btn df-btn-ghost df-btn-sm">Examples</a>
            <a className="df-btn df-btn-ghost df-btn-sm">Docs</a>
            <a className="df-btn df-btn-secondary df-btn-sm">Sign in</a>
          </div>
        </div>

        {/* hero */}
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center", paddingBottom: 56 }}>
          <div className="eyebrow" style={{ marginBottom: 16 }}>· now in beta · v0.4</div>
          <h1 style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)", fontWeight: 500, letterSpacing: "-0.03em", lineHeight: 1.02, margin: 0 }}>
            A portfolio for developers,<br /> not for designers.
          </h1>
          <p style={{ fontSize: "var(--t-lg)", color: "var(--ink-2)", marginTop: 20, lineHeight: 1.5 }}>
            Sign in with GitHub. Fill out your projects, skills, and experience.
            Get a clean public page at <span className="mono" style={{ color: "var(--ink)" }}>devfolio.app/<span style={{ color: "var(--accent)" }}>you</span></span>.
            No CSS. No hosting. No Friday-night templates.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 28 }}>
            <Btn size="lg">Sign in with GitHub →</Btn>
            <Btn size="lg" variant="outline">See an example</Btn>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 28, fontSize: "var(--t-xs)", color: "var(--ink-3)" }} className="mono">
            <span>· no credit card</span>
            <span>· export anytime</span>
            <span>· open source</span>
          </div>
        </div>

        {/* feature row */}
        <div className="grid-3" style={{ marginTop: 32 }}>
          <Card>
            <div className="eyebrow">01 — Editor</div>
            <div style={{ fontSize: "var(--t-lg)", fontWeight: 500, letterSpacing: "-0.01em" }}>Forms, not WYSIWYG</div>
            <p style={{ margin: 0, color: "var(--ink-2)", fontSize: "var(--t-sm)" }}>
              Five sections. One field at a time. Validation that tells you exactly what's wrong.
            </p>
          </Card>
          <Card>
            <div className="eyebrow">02 — AI assist</div>
            <div style={{ fontSize: "var(--t-lg)", fontWeight: 500, letterSpacing: "-0.01em" }}>Drafts, not autopilot</div>
            <p style={{ margin: 0, color: "var(--ink-2)", fontSize: "var(--t-sm)" }}>
              Bio generator, description polisher, title suggestions — every output is editable before it lands.
            </p>
          </Card>
          <Card>
            <div className="eyebrow">03 — Public page</div>
            <div style={{ fontSize: "var(--t-lg)", fontWeight: 500, letterSpacing: "-0.01em" }}>Server-rendered &amp; fast</div>
            <p style={{ margin: 0, color: "var(--ink-2)", fontSize: "var(--t-sm)" }}>
              Real metadata. Real OG image. Loads in &lt;200ms. Shareable on the day you sign up.
            </p>
          </Card>
        </div>

        <div className="mono" style={{ textAlign: "center", marginTop: 64, color: "var(--ink-3)", fontSize: "var(--t-xs)" }}>
          built with next.js · drizzle · turso · anthropic · for pv247 @ fi muni
        </div>
      </div>
    </MockFrame>
  );
}

// ---------- Public profile ----------
function ProfileMock() {
  return (
    <MockFrame url="devfolio.app/elena">
      <div style={{ padding: "48px 64px", background: "var(--paper)" }}>
        {/* hero */}
        <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 32, paddingBottom: 40, borderBottom: "1px solid var(--hairline)" }}>
          <Placeholder height={120} style={{ borderRadius: 60 }}>avatar</Placeholder>
          <div>
            <div className="eyebrow">@elena · brno, czechia</div>
            <h1 style={{ fontSize: "var(--t-3xl)", fontWeight: 500, letterSpacing: "-0.022em", margin: "8px 0 4px" }}>Elena Vašková</h1>
            <div style={{ fontSize: "var(--t-lg)", color: "var(--ink-2)", marginBottom: 16 }}>Frontend Engineer · ex-Linear</div>
            <p style={{ margin: 0, color: "var(--ink)", fontSize: "var(--t-base)", maxWidth: "60ch", lineHeight: 1.55 }}>
              I build small, fast tools — mostly TypeScript and a long-standing love affair with Postgres.
              Currently learning Rust at the edges and trying to remember what hobbies are.
            </p>
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <Badge tone="ok">Available for work</Badge>
              <Badge>Brno, CZ · UTC+1</Badge>
            </div>
          </div>
        </div>

        {/* projects */}
        <div style={{ paddingTop: 40 }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 20 }}>
            <h2 style={{ fontSize: "var(--t-2xl)", fontWeight: 500, letterSpacing: "-0.02em", margin: 0 }}>Projects</h2>
            <span className="mono" style={{ fontSize: "var(--t-xs)", color: "var(--ink-3)" }}>03 / 03</span>
          </div>
          <div className="grid-2">
            {[
              { t: "Saturn CLI", d: "A tiny build tool for static MDX sites. Watches files, rebuilds in under 30ms, ships a single binary via Bun.", tags: ["TypeScript", "Bun", "MDX"], live: true },
              { t: "ledger.gg", d: "Side-project: a personal finance tracker that imports CSVs from any bank and re-categorizes them with rules.", tags: ["Next.js", "Drizzle", "Turso"], live: true },
              { t: "rfc-bot", d: "GitHub Action that detects when a PR contains a structural decision and asks for an RFC link.", tags: ["TypeScript", "Octokit"], live: false },
              { t: "type-walker", d: "VS Code extension that walks TypeScript types and renders them as a graph in a sidebar.", tags: ["TypeScript", "VS Code API"], live: false }
            ].map((p, i) => (
              <Card key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                  <div>
                    <div style={{ fontSize: "var(--t-lg)", fontWeight: 500, letterSpacing: "-0.01em" }}>{p.t}</div>
                    <div className="mono" style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>github.com/elena/{p.t.toLowerCase().replace(/[^a-z0-9]/g, "-")}</div>
                  </div>
                  {p.live && <Badge tone="ok">Live</Badge>}
                </div>
                <p style={{ margin: 0, color: "var(--ink-2)", fontSize: "var(--t-sm)" }}>{p.d}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {p.tags.map(t => <Tag key={t}>{t}</Tag>)}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* experience */}
        <div style={{ paddingTop: 56 }}>
          <h2 style={{ fontSize: "var(--t-2xl)", fontWeight: 500, letterSpacing: "-0.02em", margin: "0 0 20px" }}>Experience</h2>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {[
              { r: "Senior Frontend Engineer", c: "Linear", d: "2023 — Present", body: "Editor surface — collab cursors, slash commands, keyboard system." },
              { r: "Frontend Engineer", c: "Productboard", d: "2021 — 2023", body: "Insights module. Migrated a 60kloc app from Sass to Tailwind." },
              { r: "Junior Developer", c: "Showmax", d: "2019 — 2021", body: "Content CMS, video player team, A/B tooling." }
            ].map((e, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 32, padding: "20px 0", borderBottom: "1px solid var(--hairline-soft)" }}>
                <div className="mono" style={{ fontSize: "var(--t-xs)", color: "var(--ink-3)" }}>{e.d}</div>
                <div>
                  <div style={{ fontWeight: 500 }}>{e.r} · <span style={{ color: "var(--ink-2)", fontWeight: 400 }}>{e.c}</span></div>
                  <p style={{ margin: "6px 0 0", color: "var(--ink-2)", fontSize: "var(--t-sm)" }}>{e.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* skills */}
        <div style={{ paddingTop: 56 }}>
          <h2 style={{ fontSize: "var(--t-2xl)", fontWeight: 500, letterSpacing: "-0.02em", margin: "0 0 20px" }}>Skills</h2>
          <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", rowGap: 16, columnGap: 32 }}>
            {[
              ["Frontend", ["TypeScript", "React", "Next.js", "Tailwind", "Radix"]],
              ["Backend", ["Node", "Postgres", "Drizzle", "tRPC"]],
              ["Tools", ["Vercel", "Vitest", "Playwright", "Linear"]]
            ].map(([cat, items]) => (
              <React.Fragment key={cat}>
                <div className="eyebrow" style={{ paddingTop: 4 }}>{cat}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {items.map(s => <Tag key={s}>{s}</Tag>)}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* socials footer */}
        <div style={{ paddingTop: 56, marginTop: 56, borderTop: "1px solid var(--hairline)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="mono" style={{ fontSize: "var(--t-xs)", color: "var(--ink-3)" }}>devfolio.app/elena · last updated 2 days ago</div>
          <div style={{ display: "flex", gap: 6 }}>
            {["github", "linkedin", "x", "site", "email"].map(s => (
              <a key={s} className="df-btn df-btn-ghost df-btn-sm mono" style={{ minWidth: "auto" }}>{s}</a>
            ))}
          </div>
        </div>
      </div>
    </MockFrame>
  );
}

// ---------- Dashboard ----------
function DashboardMock() {
  const items = [
    { k: "profile", l: "Profile" },
    { k: "projects", l: "Projects", active: true },
    { k: "skills", l: "Skills" },
    { k: "experience", l: "Experience" },
    { k: "socials", l: "Socials" },
    { k: "settings", l: "Settings" }
  ];
  return (
    <MockFrame url="devfolio.app/dashboard/projects" minWidth={1180}>
      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr 280px", minHeight: 720, background: "var(--paper)" }}>
        {/* sidebar */}
        <aside style={{ borderRight: "1px solid var(--hairline)", padding: 20, display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ marginBottom: 16 }}><Logo size={24} /></div>
          <div className="eyebrow" style={{ padding: "4px 8px" }}>Editor</div>
          {items.map(it => (
            <div key={it.k} className={"nav-item" + (it.active ? " is-active" : "")}>
              <span style={{ textTransform: "capitalize" }}>{it.l}</span>
              {it.k === "projects" && <span className="num">4</span>}
            </div>
          ))}
          <div style={{ marginTop: "auto", paddingTop: 16, borderTop: "1px solid var(--hairline)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 14, background: "var(--paper-3)", border: "1px solid var(--hairline)" }}></div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>Elena V.</div>
                <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)" }}>@elena</div>
              </div>
            </div>
          </div>
        </aside>

        {/* main column */}
        <main style={{ padding: "24px 28px", minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <div className="eyebrow">/dashboard/projects</div>
              <h1 style={{ fontSize: "var(--t-2xl)", fontWeight: 500, letterSpacing: "-0.02em", margin: "4px 0 0" }}>Projects</h1>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn variant="outline" size="sm">Live preview</Btn>
              <Btn size="sm">+ Add project</Btn>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { t: "Saturn CLI", live: true, github: true, tags: ["TypeScript", "Bun", "MDX"] },
              { t: "ledger.gg", live: true, github: true, tags: ["Next.js", "Drizzle", "Turso"] },
              { t: "rfc-bot", live: false, github: true, broken: true, tags: ["TypeScript", "Octokit"] },
              { t: "type-walker", live: false, github: true, tags: ["TypeScript"] }
            ].map((p, i) => (
              <div key={i} className="df-card" style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
                <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)", width: 24 }}>{String(i + 1).padStart(2, "0")}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <div style={{ fontWeight: 500 }}>{p.t}</div>
                    {p.live && <Badge tone="ok">live</Badge>}
                    {p.broken && <Badge tone="danger">404 broken</Badge>}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {p.tags.map(t => <Tag key={t}>{t}</Tag>)}
                  </div>
                </div>
                <Btn variant="ghost" size="sm">Edit</Btn>
                <Btn variant="ghost" size="sm">⋯</Btn>
              </div>
            ))}
          </div>
        </main>

        {/* right rail */}
        <aside style={{ borderLeft: "1px solid var(--hairline)", padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ fontWeight: 500, fontSize: 13 }}>Completeness</div>
              <div className="mono" style={{ fontSize: 12, color: "var(--ink-3)" }}>65 / 100</div>
            </div>
            <Progress value={65} />
            <div className="df-hint" style={{ marginTop: 10 }}>Add 2 more projects to gain <b style={{ color: "var(--ink)" }}>+10</b>.</div>
          </Card>

          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontWeight: 500, fontSize: 13 }}>Broken link check</div>
              <Btn size="sm" variant="secondary">Run</Btn>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                <span className="mono" style={{ color: "var(--ink-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>github.com/elena/rfc-bot</span>
                <Badge tone="danger">404</Badge>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                <span className="mono" style={{ color: "var(--ink-2)" }}>elena.dev</span>
                <Badge tone="ok">ok</Badge>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                <span className="mono" style={{ color: "var(--ink-2)" }}>linkedin.com/…</span>
                <Badge tone="ok">ok</Badge>
              </div>
            </div>
            <div className="mono df-hint" style={{ marginTop: 4 }}>last run · 2m ago</div>
          </Card>

          <Card>
            <div style={{ fontWeight: 500, fontSize: 13 }}>Suggested skills</div>
            <div className="df-hint">From your project tags, not yet in skills:</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              <Tag dashed>+ Bun</Tag><Tag dashed>+ MDX</Tag><Tag dashed>+ Octokit</Tag>
            </div>
          </Card>
        </aside>
      </div>
    </MockFrame>
  );
}

function MocksSection() {
  return (
    <section className="section" id="mocks">
      <SectionHead num="06 — Page mockups" title="The system, applied.">
        Three pages that exercise the kit end-to-end: the public landing, a populated user profile, and the
        projects editor with its sidebar of feedback loops (completeness, link check, suggestions).
      </SectionHead>

      <div className="subsection">
        <h3>Landing — <span className="mono" style={{ color: "var(--ink-3)", fontSize: "var(--t-sm)" }}>/</span></h3>
        <LandingMock />
      </div>

      <div className="subsection">
        <h3>Public profile — <span className="mono" style={{ color: "var(--ink-3)", fontSize: "var(--t-sm)" }}>/[username]</span></h3>
        <ProfileMock />
      </div>

      <div className="subsection">
        <h3>Dashboard — <span className="mono" style={{ color: "var(--ink-3)", fontSize: "var(--t-sm)" }}>/dashboard/projects</span></h3>
        <DashboardMock />
      </div>
    </section>
  );
}

Object.assign(window, { MocksSection });
