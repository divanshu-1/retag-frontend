import type { SVGProps } from 'react';

const CursorArrowIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M9.73 20.574l-3.32-8.913-8.14-3.52 23.444 9.15-7.142 7.142-4.842-3.859zM2.08 8.14l5.65 2.45 2.72 7.3-3.4-2.71-4.97-6.96v-.08z" />
  </svg>
);

export { CursorArrowIcon };
