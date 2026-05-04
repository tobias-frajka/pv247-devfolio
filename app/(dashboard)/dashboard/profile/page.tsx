export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-3">
      <h1
        className="m-0"
        style={{ fontSize: 'var(--t-3xl)', fontWeight: 500, letterSpacing: '-0.022em' }}
      >
        Profile
      </h1>
      <p className="m-0" style={{ fontSize: 'var(--t-base)', color: 'var(--ink-2)' }}>
        Display name, headline, bio, location, avatar, &quot;available for work&quot; toggle. Wire
        the form to <code>upsertProfile</code>. Bio field gets the AI-variant button →{' '}
        <code>generateBio</code> / <code>improveDescription</code>.
      </p>
    </div>
  );
}
