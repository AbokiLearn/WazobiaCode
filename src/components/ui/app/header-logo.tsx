import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function HeaderLogo({
  className,
  inSheet = false,
}: {
  className?: string;
  inSheet?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn(
        'items-center gap-2 font-semibold',
        inSheet ? '' : 'hidden lg:flex',
        className,
      )}
    >
      <Image src="/logo.svg" width={48} height={48} alt="logo" />
    </Link>
  );
}
