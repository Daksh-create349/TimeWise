import Image from 'next/image';
import { cn } from '@/lib/utils';

const Logo = ({ className }: { className?: string }) => (
    <div className={cn("bg-white rounded-full p-0.5", className)}>
        <Image src="/timewise-logo.png" alt="Time wise logo" width={24} height={24} className="rounded-full" />
    </div>
);

export default Logo;
