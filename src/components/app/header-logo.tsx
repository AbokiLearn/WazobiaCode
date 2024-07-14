import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function HeaderLogo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn('items-center gap-2 font-semibold', className)}
    >
      <Image
        className="rounded-lg"
        src="/logo.svg"
        width={48}
        height={48}
        alt="logo"
      />
    </Link>
  );
}
