import { useId } from 'react'
import type { CategoryId } from '../data/types'

interface Props {
  category: CategoryId
  /** Main accent colour (device body / wallpaper) */
  color: string
  className?: string
  /** Draws a soft background blob behind the device */
  backdrop?: boolean
}

function hexToRgb(hex: string): [number, number, number] {
  let h = hex.replace('#', '')
  if (h.length === 3) h = h.split('').map((c) => c + c).join('')
  const n = parseInt(h, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

const rgbToHex = ([r, g, b]: [number, number, number]) =>
  '#' + [r, g, b].map((x) => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, '0')).join('')

const mix = (hex: string, target: [number, number, number], t: number) => {
  const c = hexToRgb(hex)
  return rgbToHex([c[0] + (target[0] - c[0]) * t, c[1] + (target[1] - c[1]) * t, c[2] + (target[2] - c[2]) * t])
}

export const lighten = (hex: string, t: number) => mix(hex, [255, 255, 255], t)
export const darken = (hex: string, t: number) => mix(hex, [0, 0, 0], t)

const luminance = (hex: string) => {
  const [r, g, b] = hexToRgb(hex).map((v) => v / 255)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export default function DeviceArt({ category, color, className = '', backdrop = false }: Props) {
  const uid = useId().replace(/:/g, '')
  const gradId = `g-${uid}`
  const shadowId = `s-${uid}`
  const isLight = luminance(color) > 0.7
  const frame = isLight ? '#d4d4d8' : darken(color, 0.55)
  const frameStroke = isLight ? '#a1a1aa' : darken(color, 0.7)
  const screenA = lighten(color, isLight ? 0.05 : 0.35)
  const screenB = darken(color, isLight ? 0.35 : 0.25)
  const blob = lighten(color, 0.75)

  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={screenA} />
          <stop offset="100%" stopColor={screenB} />
        </linearGradient>
        <filter id={shadowId} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#0f172a" floodOpacity="0.18" />
        </filter>
      </defs>

      {backdrop && (
        <>
          <circle cx="100" cy="104" r="78" fill={blob} opacity="0.55" />
          <circle cx="146" cy="60" r="18" fill={blob} opacity="0.9" />
          <circle cx="48" cy="150" r="10" fill={blob} opacity="0.9" />
        </>
      )}

      <g filter={`url(#${shadowId})`}>
        {category === 'mobile' && (
          <>
            <rect x="60" y="14" width="80" height="172" rx="16" fill={frame} stroke={frameStroke} strokeWidth="1.5" />
            <rect x="65" y="19" width="70" height="162" rx="12" fill={`url(#${gradId})`} />
            <circle cx="150" cy="62" r="0" />
            <rect x="88" y="25" width="24" height="7" rx="3.5" fill="#0f172a" />
            <circle cx="107" cy="28.5" r="1.8" fill="#1e3a8a" />
            <circle cx="88" cy="80" r="22" fill="#fff" opacity="0.14" />
            <circle cx="118" cy="122" r="30" fill="#fff" opacity="0.1" />
            <text x="100" y="66" textAnchor="middle" fontSize="16" fontWeight="600" fill="#fff" opacity="0.9" fontFamily="Inter, sans-serif">
              9:41
            </text>
            <rect x="86" y="171" width="28" height="3" rx="1.5" fill="#fff" opacity="0.8" />
            <rect x="141" y="58" width="2.5" height="16" rx="1" fill={frameStroke} />
            <rect x="56.5" y="52" width="2.5" height="10" rx="1" fill={frameStroke} />
            <rect x="56.5" y="68" width="2.5" height="18" rx="1" fill={frameStroke} />
          </>
        )}

        {category === 'laptop' && (
          <>
            <rect x="30" y="34" width="140" height="96" rx="8" fill={frame} stroke={frameStroke} strokeWidth="1.5" />
            <rect x="36" y="40" width="128" height="82" rx="4" fill={`url(#${gradId})`} />
            <rect x="88" y="40" width="24" height="5" rx="2.5" fill={frame} />
            <circle cx="70" cy="70" r="20" fill="#fff" opacity="0.12" />
            <circle cx="126" cy="96" r="26" fill="#fff" opacity="0.1" />
            <path d="M18 132h164l8 14a4 4 0 0 1-3.8 5.2H13.8A4 4 0 0 1 10 146z" fill={isLight ? '#e4e4e7' : lighten(frame, 0.12)} stroke={frameStroke} strokeWidth="1.5" />
            <rect x="84" y="134" width="32" height="4" rx="2" fill={frameStroke} opacity="0.7" />
            <rect x="40" y="140" width="120" height="1.5" rx="0.75" fill={frameStroke} opacity="0.35" />
          </>
        )}

        {category === 'tablet' && (
          <>
            <rect x="38" y="20" width="124" height="160" rx="14" fill={frame} stroke={frameStroke} strokeWidth="1.5" />
            <rect x="45" y="27" width="110" height="146" rx="8" fill={`url(#${gradId})`} />
            <circle cx="100" cy="23.5" r="1.6" fill="#0f172a" />
            <circle cx="72" cy="70" r="24" fill="#fff" opacity="0.12" />
            <circle cx="128" cy="120" r="34" fill="#fff" opacity="0.1" />
            <text x="100" y="82" textAnchor="middle" fontSize="20" fontWeight="600" fill="#fff" opacity="0.9" fontFamily="Inter, sans-serif">
              9:41
            </text>
            <rect x="82" y="165" width="36" height="3" rx="1.5" fill="#fff" opacity="0.8" />
          </>
        )}

        {category === 'smartwatch' && (
          <>
            <rect x="72" y="8" width="56" height="52" rx="8" fill={isLight ? '#d4d4d8' : lighten(frame, 0.25)} />
            <rect x="72" y="140" width="56" height="52" rx="8" fill={isLight ? '#d4d4d8' : lighten(frame, 0.25)} />
            <rect x="86" y="20" width="28" height="4" rx="2" fill={frameStroke} opacity="0.4" />
            <rect x="86" y="30" width="28" height="4" rx="2" fill={frameStroke} opacity="0.4" />
            <rect x="86" y="164" width="28" height="4" rx="2" fill={frameStroke} opacity="0.4" />
            <rect x="86" y="174" width="28" height="4" rx="2" fill={frameStroke} opacity="0.4" />
            <rect x="56" y="50" width="88" height="100" rx="24" fill={frame} stroke={frameStroke} strokeWidth="1.5" />
            <rect x="63" y="57" width="74" height="86" rx="20" fill={`url(#${gradId})`} />
            <rect x="145" y="78" width="6" height="18" rx="2" fill={frameStroke} />
            <rect x="145" y="104" width="6" height="12" rx="2" fill={frameStroke} />
            <circle cx="100" cy="100" r="26" fill="none" stroke="#fff" strokeOpacity="0.25" strokeWidth="6" />
            <path d="M100 74a26 26 0 0 1 24 35" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity="0.95" />
            <text x="100" y="105" textAnchor="middle" fontSize="14" fontWeight="700" fill="#fff" fontFamily="Inter, sans-serif">
              10:09
            </text>
          </>
        )}

        {category === 'earbuds' && (
          <>
            <rect x="46" y="70" width="108" height="86" rx="26" fill={isLight ? '#f4f4f5' : lighten(color, 0.1)} stroke={frameStroke} strokeWidth="1.5" />
            <path d="M46 104h108" stroke={frameStroke} strokeWidth="1.5" opacity="0.6" />
            <circle cx="100" cy="128" r="3" fill={isLight ? '#22c55e' : '#4ade80'} />
            <g>
              <ellipse cx="80" cy="60" rx="14" ry="16" fill={isLight ? '#fafafa' : lighten(color, 0.2)} stroke={frameStroke} strokeWidth="1.5" />
              <rect x="74" y="70" width="12" height="34" rx="6" fill={isLight ? '#fafafa' : lighten(color, 0.2)} stroke={frameStroke} strokeWidth="1.5" />
              <circle cx="80" cy="60" r="5" fill={darken(color, 0.4)} opacity="0.5" />
            </g>
            <g>
              <ellipse cx="120" cy="60" rx="14" ry="16" fill={isLight ? '#fafafa' : lighten(color, 0.2)} stroke={frameStroke} strokeWidth="1.5" />
              <rect x="114" y="70" width="12" height="34" rx="6" fill={isLight ? '#fafafa' : lighten(color, 0.2)} stroke={frameStroke} strokeWidth="1.5" />
              <circle cx="120" cy="60" r="5" fill={darken(color, 0.4)} opacity="0.5" />
            </g>
          </>
        )}

        {category === 'console' && (
          <>
            <rect x="36" y="30" width="60" height="140" rx="10" fill={isLight ? '#f4f4f5' : lighten(color, 0.08)} stroke={frameStroke} strokeWidth="1.5" />
            <rect x="60" y="30" width="12" height="140" fill={darken(color, 0.6)} opacity="0.9" />
            <rect x="44" y="52" width="8" height="60" rx="4" fill={frameStroke} opacity="0.35" />
            <circle cx="66" cy="60" r="2" fill="#38bdf8" />
            <path d="M104 118c0-14 12-24 26-24h20c14 0 26 10 26 24 0 16-2 28-6 34-4 6-12 6-16 0l-4-6h-20l-4 6c-4 6-12 6-16 0-4-6-6-18-6-34z" fill={darken(color, 0.55)} stroke={frameStroke} strokeWidth="1.5" />
            <circle cx="124" cy="116" r="5" fill="#fff" opacity="0.8" />
            <circle cx="156" cy="110" r="3" fill="#ef4444" />
            <circle cx="163" cy="117" r="3" fill="#22c55e" />
            <circle cx="149" cy="117" r="3" fill="#3b82f6" />
            <circle cx="156" cy="124" r="3" fill="#f59e0b" />
            <rect x="134" y="128" width="12" height="4" rx="2" fill="#fff" opacity="0.7" />
          </>
        )}

        {category === 'camera' && (
          <>
            <rect x="80" y="42" width="40" height="14" rx="4" fill={frame} stroke={frameStroke} strokeWidth="1.5" />
            <rect x="28" y="56" width="144" height="98" rx="14" fill={frame} stroke={frameStroke} strokeWidth="1.5" />
            <rect x="28" y="56" width="26" height="98" rx="14" fill={darken(frame, 0.2)} />
            <rect x="140" y="62" width="14" height="6" rx="2" fill="#ef4444" opacity="0.9" />
            <rect x="36" y="46" width="14" height="10" rx="2" fill={frameStroke} />
            <circle cx="106" cy="105" r="36" fill={darken(frame, 0.3)} stroke={frameStroke} strokeWidth="1.5" />
            <circle cx="106" cy="105" r="28" fill={`url(#${gradId})`} />
            <circle cx="106" cy="105" r="18" fill="#0f172a" />
            <circle cx="106" cy="105" r="9" fill="#1e3a8a" opacity="0.9" />
            <circle cx="98" cy="96" r="4" fill="#fff" opacity="0.7" />
          </>
        )}
      </g>
    </svg>
  )
}
