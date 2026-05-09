import { cn } from '@/lib/utils';

type Props = {
  children?: React.ReactNode;
  className?: string;
};

export function FormError({ children, className }: Props) {
  if (!children) return null;
  return (
    <p className={cn('text-xs', className)} style={{ color: 'var(--danger)' }}>
      {children}
    </p>
  );
}
