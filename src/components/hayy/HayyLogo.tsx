// Hayy mark — drop-in React component.
// Single-color, uses currentColor so it inherits whatever color you set on it.
// viewBox is locked to 0 0 64 64 so the mark substitutes 1:1 at any size.

interface HayyMarkProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

export function HayyMark({ size = 24, className, style, ...rest }: HayyMarkProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="currentColor"
      role="img"
      aria-label="Hayy"
      className={className}
      style={style}
      {...rest}
    >
      <rect x="12" y="9"  width="9"  height="46" rx="2.2" />
      <rect x="43" y="9"  width="9"  height="46" rx="2.2" />
      <circle cx="32" cy="32" r="7" />
    </svg>
  );
}

// Horizontal lockup — mark + HAYY wordmark in Fraunces.
interface HayyLockupProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  font?: string;
}

export function HayyLockup({
  size = 32,
  font = "'Fraunces', 'Cormorant Garamond', Georgia, serif",
  className,
  style,
  ...rest
}: HayyLockupProps) {
  const w = size * (260 / 64);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 260 64"
      width={w}
      height={size}
      fill="currentColor"
      role="img"
      aria-label="Hayy"
      className={className}
      style={style}
      {...rest}
    >
      <g>
        <rect x="12" y="9"  width="9"  height="46" rx="2.2" />
        <rect x="43" y="9"  width="9"  height="46" rx="2.2" />
        <circle cx="32" cy="32" r="7" />
      </g>
      <text x="88" y="46"
        fontFamily={font}
        fontWeight={500}
        fontSize={46}
        letterSpacing={8}>HAYY</text>
    </svg>
  );
}
