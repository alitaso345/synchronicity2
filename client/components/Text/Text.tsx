import * as React from 'react'
import { PlatformType } from 'proto/synchronicity_pb'

type Maybe<T> = T | null

export const TextSize = {
  XS: 'XS',
  S: 'S',
  M: 'M',
  L: 'L',
  XL: 'XL',
  XXL: 'XXL',
} as const
export type TextSizeType = typeof TextSize[keyof typeof TextSize]

const sizeMap = (size: TextSizeType) => {
  switch (size) {
    case TextSize.XXL:
      return 'text-2xl'
    case TextSize.XL:
      return 'text-xl'
    case TextSize.L:
      return 'text-lg'
    case TextSize.M:
      return 'text-base'
    case TextSize.S:
      return 'text-sm'
    case TextSize.XS:
      return 'text-xs'
  }
}

const platformColorMap = (platform: Maybe<PlatformType>) => {
  switch (platform) {
    case PlatformType.TWITTER:
      return '#00ACEE'
    case PlatformType.TWITCH:
      return '#6441a5'
    default:
      return '#000'
  }
}

type Props = React.HTMLAttributes<HTMLSpanElement> & {
  size?: TextSizeType
  platform?: PlatformType
}

export const Text: React.FC<Props> = ({
  children,
  size = TextSize.M,
  platform = null,
}) => (
  <span
    className={`font-sans ${sizeMap(size)}`}
    style={{
      color: platformColorMap(platform),
    }}
  >
    {children}
  </span>
)
