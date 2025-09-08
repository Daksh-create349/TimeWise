import type { SVGProps } from 'react';

const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 15a5 5 0 0 1-5-5V9h2v3a3 3 0 1 0 6 0V9h2v3a5 5 0 0 1-5 5z"
      fill="currentColor"
    />
  </svg>
);

export default Logo;
