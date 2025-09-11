import Image from 'next/image';

const Logo = ({ className }: { className?: string }) => (
  <Image src="/timewise-logo.png" alt="Time wise logo" width={24} height={24} className={className} />
);

export default Logo;
