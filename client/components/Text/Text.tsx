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

export const TextColor = {
  BLACK: 'BLACK',
  WHITE: 'WHITE',
  GRAY: 'GRAY',
  RED: 'RED',
  ORANGE: 'ORANGE',
  YELLOW: 'YELLOW',
  GREEN: 'GREEN',
  TEAL: 'TEAL',
  BLUE: 'BLUE',
  INDIGO: 'INDIGO',
  PURPLE: 'PURPLE',
  PINK: 'PINK',
} as const
export type TextColorType = typeof TextColor[keyof typeof TextColor]

const colorMap = (color: TextColorType) => {
  switch (color) {
    case TextColor.BLACK:
      return 'text-black'
    case TextColor.WHITE:
      return 'text-white'
    case TextColor.GRAY:
      return 'text-gray-600'
    case TextColor.RED:
      return 'text-red-600'
    case TextColor.ORANGE:
      return 'text-orange-600'
    case TextColor.YELLOW:
      return 'text-yellow-600'
    case TextColor.GREEN:
      return 'text-green-600'
    case TextColor.TEAL:
      return 'text-teal-600'
    case TextColor.BLUE:
      return 'text-blue-600'
    case TextColor.INDIGO:
      return 'text-indigo-600'
    case TextColor.PURPLE:
      return 'text-purple-600'
    case TextColor.PINK:
      return 'text-pink-600'
  }
}

const platformColorMap = (platform: PlatformType) => {
  switch (platform) {
    case PlatformType.TWITTER:
      return 'text-twitter'
    case PlatformType.TWITCH:
      return 'text-twitch'
  }
}

type Props = React.HTMLAttributes<HTMLSpanElement> & {
  size?: string
  color?: string
  platform?: PlatformType
}

export const Text: React.FC<Props> = ({
  children,
  size = TextSize.M,
  color = TextColor.BLACK,
  platform = null,
}) => (
  <span
    className={`font-sans ${sizeMap(size as TextSizeType)} ${
      platform !== null
        ? `font-bold ${platformColorMap(platform)}`
        : colorMap(color as TextColorType)
    }`}
  >
    {children}
  </span>
)
