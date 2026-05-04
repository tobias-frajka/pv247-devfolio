export default function SocialsPage() {
  return (
    <div className="flex flex-col gap-3">
      <h1
        className="m-0"
        style={{ fontSize: 'var(--t-3xl)', fontWeight: 500, letterSpacing: '-0.022em' }}
      >
        Socials
      </h1>
      <p className="m-0" style={{ fontSize: 'var(--t-base)', color: 'var(--ink-2)' }}>
        One row per fixed platform (github, linkedin, x, website, email). Leave blank to omit.
        Server actions: <code>upsertSocial</code>, <code>removeSocial</code>.
      </p>
    </div>
  );
}
