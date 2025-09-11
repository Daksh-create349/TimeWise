import Image from 'next/image';
import { cn } from '@/lib/utils';

const Logo = ({ className }: { className?: string }) => (
    <div className={cn("p-0.5", className)}>
        <Image src="/timewise-logo.png" alt="TimeWise logo" width={32} height={32} />
    </div>
);

export default Logo;
