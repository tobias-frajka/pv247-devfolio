import { cn } from '@/lib/utils';

type Props = {
  children?: React.ReactNode;
  className?: string;
};

export function FormError({ children, className }: Props) {
  if (!children) return null;
  return (
    <p className={cn('text-danger text-xs', className)} role="alert">
      {children}
    </p>
  );
}
