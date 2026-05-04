export default function ExperiencePage() {
  return (
    <div className="flex flex-col gap-3">
      <h1
        className="m-0"
        style={{ fontSize: 'var(--t-3xl)', fontWeight: 500, letterSpacing: '-0.022em' }}
      >
        Experience
      </h1>
      <p className="m-0" style={{ fontSize: 'var(--t-base)', color: 'var(--ink-2)' }}>
        Timeline editor. &quot;Currently working here&quot; nulls the end date. Server actions:{' '}
        <code>createExperience</code>, <code>updateExperience</code>, <code>deleteExperience</code>.
      </p>
    </div>
  );
}
