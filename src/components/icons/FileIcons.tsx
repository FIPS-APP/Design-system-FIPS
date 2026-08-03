import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number
  color?: string
}

/** Ícone Excel — convenção de extensão `#1D6F42` (não é token de marca). */
export function ExcelIcon({ size = 16, color = '#1D6F42', ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden {...rest}>
      <rect
        x="2.5"
        y="2.5"
        width="15"
        height="15"
        rx="1.5"
        fill={color}
        fillOpacity=".08"
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        d="M2.5 7h15M2.5 12h15M7.5 2.5v15M12.5 2.5v15"
        stroke={color}
        strokeWidth="1.1"
        opacity=".6"
      />
      <path
        d="M6.5 9.5l3 3M9.5 9.5l-3 3"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Ícone PDF — vermelho de extensão / danger. */
export function PdfIcon({
  size = 16,
  color = 'var(--color-danger, #DC3545)',
  ...rest
}: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden {...rest}>
      <path
        d="M5 2h7l4 4v12H5V2z"
        fill={color}
        fillOpacity=".08"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M12 2v4h4" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <path
        d="M7 11.5h2.2c.6 0 1 .4 1 1s-.4 1-1 1H7v1.5M11.5 11.5v3M11.5 11.5h1.5M11.5 13h1"
        stroke={color}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
