export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-3">
      <h1
        className="m-0"
        style={{ fontSize: 'var(--t-3xl)', fontWeight: 500, letterSpacing: '-0.022em' }}
      >
        Settings
      </h1>
      <p className="m-0" style={{ fontSize: 'var(--t-base)', color: 'var(--ink-2)' }}>
        Username change (warns about old share links). Delete account. Server actions:{' '}
        <code>changeUsername</code>, <code>deleteAccount</code>.
      </p>
    </div>
  );
}
