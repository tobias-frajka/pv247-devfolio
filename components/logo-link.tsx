import Link from 'next/link';

import { Logo } from '@/components/logo';

type Props = {
  size?: number;
  className?: string;
};

export function LogoLink({ size, className }: Props) {
  return (
    <Link href="/" aria-label="DevFolio home" className={className ?? 'inline-flex'}>
      <Logo size={size} />
    </Link>
  );
}
