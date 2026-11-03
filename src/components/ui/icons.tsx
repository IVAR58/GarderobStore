import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 20, ...props }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    ...props,
  };
}

export const SearchIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);
export const HeartIcon = ({ filled, ...p }: IconProps & { filled?: boolean }) => (
  <svg {...base(p)} fill={filled ? "currentColor" : "none"}>
    <path d="M12 20.5s-7.5-4.6-7.5-10A4.5 4.5 0 0 1 12 7.7a4.5 4.5 0 0 1 7.5 2.8c0 5.4-7.5 10-7.5 10Z" />
  </svg>
);
export const BagIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6 8h12l-1 12H7L6 8Z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </svg>
);
export const MenuIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 7h16M4 12h16M4 17h10" />
  </svg>
);
export const CloseIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
);
export const ChevronDownIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);
export const ChevronRightIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m9 6 6 6-6 6" />
  </svg>
);
export const ChevronLeftIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m15 6-6 6 6 6" />
  </svg>
);
export const ArrowRightIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 12h16m-6-6 6 6-6 6" />
  </svg>
);
export const HomeIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 11 12 4l8 7v9H4v-9Z" />
    <path d="M10 20v-6h4v6" />
  </svg>
);
export const GridIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="4" y="4" width="7" height="7" rx="1.5" />
    <rect x="13" y="4" width="7" height="7" rx="1.5" />
    <rect x="4" y="13" width="7" height="7" rx="1.5" />
    <rect x="13" y="13" width="7" height="7" rx="1.5" />
  </svg>
);
export const MinusIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M5 12h14" />
  </svg>
);
export const PlusIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);
export const TrashIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
  </svg>
);
export const CheckIcon = (p: IconProps) => (
  <svg {...base(p)} strokeWidth={2}>
    <path d="m5 12 5 5L20 7" />
  </svg>
);
export const StarIcon = ({ filled = true, ...p }: IconProps & { filled?: boolean }) => (
  <svg {...base(p)} fill={filled ? "currentColor" : "none"}>
    <path d="m12 3 2.7 5.6 6.1.8-4.5 4.3 1.1 6.1L12 17l-5.4 2.8 1.1-6.1L3.2 9.4l6.1-.8L12 3Z" />
  </svg>
);
export const MapPinIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 21s-6-5.4-6-10.5a6 6 0 1 1 12 0C18 15.6 12 21 12 21Z" />
    <circle cx="12" cy="10.5" r="2.2" />
  </svg>
);
export const ClockIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);
export const PhoneIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4.5 5.5a2 2 0 0 1 2-2Z" />
  </svg>
);
export const MailIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
    <path d="m4 7 8 6 8-6" />
  </svg>
);
export const TruckIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3 6h11v10H3zM14 10h4l3 3v3h-7z" />
    <circle cx="7" cy="17.5" r="1.8" />
    <circle cx="17" cy="17.5" r="1.8" />
  </svg>
);
export const ReturnIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 9h11a4 4 0 0 1 0 8H9" />
    <path d="m7 6-3 3 3 3" />
  </svg>
);
export const ShieldIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
export const SparkleIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6.5 6.5l2 2M15.5 15.5l2 2M6.5 17.5l2-2M15.5 8.5l2-2" />
  </svg>
);
export const FilterIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 6h16M7 12h10M10 18h4" />
  </svg>
);
export const StoreIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 10 5.5 4h13L20 10" />
    <path d="M4 10a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0" />
    <path d="M5 12v8h14v-8M10 20v-5h4v5" />
  </svg>
);
export const TelegramIcon = (p: IconProps) => (
  <svg {...base(p)} fill="currentColor" stroke="none">
    <path d="M20.7 4.2 3.6 10.8c-1.1.4-1.1 1.1-.2 1.4l4.3 1.3 1.6 5.1c.2.6.1.8.7.8.5 0 .7-.2 1-.5l2.3-2.2 4.5 3.3c.8.5 1.4.2 1.6-.8l3-14c.3-1.2-.5-1.8-1.7-1Z" />
  </svg>
);
export const WhatsappIcon = (p: IconProps) => (
  <svg {...base(p)} fill="currentColor" stroke="none">
    <path d="M12 2.5a9.5 9.5 0 0 0-8.1 14.4L2.5 21.5l4.7-1.3A9.5 9.5 0 1 0 12 2.5Zm0 17.3a7.8 7.8 0 0 1-4-1.1l-.3-.2-2.8.8.8-2.7-.2-.3A7.8 7.8 0 1 1 12 19.8Zm4.3-5.8c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1l-.8.9c-.1.2-.3.2-.5.1a6.4 6.4 0 0 1-3.2-2.8c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.7-1.7c-.2-.5-.4-.4-.5-.4h-.5a1 1 0 0 0-.7.3 2.8 2.8 0 0 0-.9 2.1 4.9 4.9 0 0 0 1 2.6 11.2 11.2 0 0 0 4.3 3.8c1.6.7 2.2.7 3 .6.5-.1 1.4-.6 1.6-1.2.2-.6.2-1.1.1-1.2l-.4-.3Z" />
  </svg>
);
export const VkIcon = (p: IconProps) => (
  <svg {...base(p)} fill="currentColor" stroke="none">
    <path d="M13 17.5c-5.7 0-9-3.9-9.1-10.4h2.9c.1 4.8 2.2 6.8 3.9 7.2V7.1h2.7v4.1c1.7-.2 3.4-2.1 4-4.1h2.7a7.9 7.9 0 0 1-3.6 5.2 8.2 8.2 0 0 1 4.3 5.2h-3a5.1 5.1 0 0 0-4.4-3.7v3.7H13Z" />
  </svg>
);
export const SpinnerIcon = (p: IconProps) => (
  <svg {...base(p)} className={`animate-spin-slow ${p.className ?? ""}`}>
    <path d="M12 3a9 9 0 1 0 9 9" />
  </svg>
);
