export default function ProjectsPage() {
  return (
    <div className="flex flex-col gap-3">
      <h1
        className="m-0"
        style={{ fontSize: 'var(--t-3xl)', fontWeight: 500, letterSpacing: '-0.022em' }}
      >
        Projects
      </h1>
      <p className="m-0" style={{ fontSize: 'var(--t-base)', color: 'var(--ink-2)' }}>
        List view + dialog form. Server actions: <code>createProject</code>,{' '}
        <code>updateProject</code>, <code>deleteProject</code>, <code>reorderProjects</code>.
        Description field gets the AI-variant button → <code>improveDescription</code>.
      </p>
    </div>
  );
}
