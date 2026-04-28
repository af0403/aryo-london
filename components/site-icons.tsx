type IconProps = {
  className?: string;
};

export const MenuIcon = ({ className }: IconProps) => (
  <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none">
    <path d="M4 7.5H20" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
    <path d="M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
    <path d="M4 16.5H20" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
  </svg>
);

export const CloseIcon = ({ className }: IconProps) => (
  <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none">
    <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
    <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
  </svg>
);

export const SearchIcon = ({ className }: IconProps) => (
  <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none">
    <circle cx="10.5" cy="10.5" r="5.5" stroke="currentColor" strokeWidth="2" />
    <path d="M15 15L20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
  </svg>
);

export const BookmarkIcon = ({ className }: IconProps) => (
  <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none">
    <path d="M7 4.5H17V20L12 16.3L7 20V4.5Z" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

export const BagIcon = ({ className }: IconProps) => (
  <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none">
    <path d="M6 8.5H18L17 20H7L6 8.5Z" stroke="currentColor" strokeWidth="2" />
    <path d="M9 9V7.5C9 5.84 10.34 4.5 12 4.5C13.66 4.5 15 5.84 15 7.5V9" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const TuneIcon = ({ className }: IconProps) => (
  <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none">
    <path d="M7 5V19" stroke="currentColor" strokeWidth="1.2" />
    <path d="M12 5V19" stroke="currentColor" strokeWidth="1.2" />
    <path d="M17 5V19" stroke="currentColor" strokeWidth="1.2" />
    <circle cx="7" cy="9" r="1.8" fill="currentColor" />
    <circle cx="12" cy="14" r="1.8" fill="currentColor" />
    <circle cx="17" cy="8" r="1.8" fill="currentColor" />
  </svg>
);

export const HomeIcon = ({ className }: IconProps) => (
  <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none">
    <path d="M4.5 10.5L12 4L19.5 10.5V20H14V14.5H10V20H4.5V10.5Z" fill="currentColor" />
  </svg>
);

export const ChatIcon = ({ className }: IconProps) => (
  <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none">
    <path d="M5 6.5H19V16H9L5 19V6.5Z" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

export const ChevronDownIcon = ({ className }: IconProps) => (
  <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none">
    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="square" />
  </svg>
);

export const AccountIcon = ({ className }: IconProps) => (
  <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="2" />
    <path d="M5 20C5 16.13 8.13 13 12 13C15.87 13 19 16.13 19 20" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
  </svg>
);
