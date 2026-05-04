export default function SkillsPage() {
  return (
    <div className="flex flex-col gap-3">
      <h1
        className="m-0"
        style={{ fontSize: 'var(--t-3xl)', fontWeight: 500, letterSpacing: '-0.022em' }}
      >
        Skills
      </h1>
      <p className="m-0" style={{ fontSize: 'var(--t-base)', color: 'var(--ink-2)' }}>
        Tag input per category. Suggested-skills panel reads the union of project tech stacks minus
        existing skills. Server actions: <code>addSkill</code>, <code>updateSkillCategory</code>,{' '}
        <code>removeSkill</code>.
      </p>
    </div>
  );
}
