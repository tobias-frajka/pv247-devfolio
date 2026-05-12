import { cn } from '@/lib/utils';

type Props = {
  children: React.ReactNode;
  className?: string;
};

export function PageTitle({ children, className }: Props) {
  return <h1 className={cn('m-0 text-3xl font-medium tracking-tight', className)}>{children}</h1>;
}

export function PageDescription({ children, className }: Props) {
  return <p className={cn('text-ink-2 m-0 text-sm', className)}>{children}</p>;
}
