import * as React from 'react'
import styles from './Text.module.scss'
import { PlatformType } from '../src/timeline/timeline_pb'

type Maybe<T> = T | null

export const TextSize = {
  L: 'L',
  M: 'M',
  S: 'S'
} as const
type TextSize = typeof TextSize[keyof typeof TextSize]

const sizeMap = (size: TextSize) => {
  switch (size) {
    case TextSize.L:
      return 20
    case TextSize.M:
      return 16
    case TextSize.S:
      return 12
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
  size?: TextSize
  platform?: PlatformType
}

export const Text: React.FC<Props> = ({ children, size = TextSize.M, platform = null }) => (
  <span
    style={{
      fontSize: sizeMap(size).toString() + 'px',
      color: platformColorMap(platform)
    }}
    className={styles.text}>
    {children}
  </span >
)
