type LogoProps = {
  size?: number;
};

export function Logo({ size = 28 }: LogoProps) {
  const dotSize = Math.round(size * 0.36);

  return (
    <span
      className="inline-flex items-center gap-2.5 font-semibold tracking-[-0.01em]"
      style={{ fontSize: size * 0.65 }}
    >
      <span
        className="relative grid place-items-center rounded-lg bg-foreground font-mono font-semibold text-background"
        style={{ width: size, height: size, fontSize: size * 0.5 }}
      >
        {"{ }"}
        <span
          aria-hidden
          className="absolute rounded-full border-2 border-background bg-primary"
          style={{
            width: dotSize,
            height: dotSize,
            right: -3,
            bottom: -3,
          }}
        />
      </span>
      <span className="tracking-[-0.015em]">devfolio</span>
    </span>
  );
}
