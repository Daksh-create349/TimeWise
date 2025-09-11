import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export default function Logo({ className, width = 40, height = 40 }: LogoProps) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Image
        src="/logo.png"
        alt="TimeWise Logo"
        width={width}
        height={height}
      />
    </div>
  );
}
