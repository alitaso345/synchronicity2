import * as React from 'react'
import { emoteData } from 'components/emoteData'
import { TimelineResponse, PlatformType } from 'proto/synchronicity_pb'
import { Text, TextSizeType, TextSize, TextColor } from 'components/Text/Text'

type Props = {
  item: TimelineResponse
  textSize?: string
  textColor?: string
  iconSize?: string
}

export const IconSize = {
  XS: 'XS',
  S: 'S',
  M: 'M',
  L: 'L',
  XL: 'XL',
  XXL: 'XXL',
} as const
export type IconSizeType = typeof IconSize[keyof typeof TextSize]

const sizeMap = (size: IconSizeType) => {
  switch (size) {
    case TextSize.XXL:
      return 'w-14 h-14'
    case TextSize.XL:
      return 'w-12 h-12'
    case TextSize.L:
      return 'w-10 h-10'
    case TextSize.M:
      return 'w-8 h-8'
    case TextSize.S:
      return 'w-6 h-6'
    case TextSize.XS:
      return 'w-4 h-4'
  }
}

export const ChatItem: React.FC<Props> = ({
  item,
  textSize = TextSize.M,
  textColor = TextColor.BLACK,
  iconSize = IconSize.M,
}) => (
  <div className="flex items-center mb-1">
    <img
      className={`${sizeMap(iconSize as IconSizeType)} wrounded-full mr-1`}
      width="50"
      height="50"
      src={
        item.getPlatformType() === PlatformType.TWITTER
          ? '/Twitter_Social_Icon_Circle_Color.png'
          : '/TwitchGlitchPurple.png'
      }
    />

    <Text platform={item.getPlatformType()} size={textSize}>
      {item.getName()}
    </Text>
    <span className="mr-1" />

    {item
      .getMessage()
      .split(' ')
      .map((t, i) => {
        for (const emote of emoteData) {
          if (emote.name === t) {
            return (
              <img
                key={i}
                src={emote.url}
                width={emote.width}
                height={emote.height}
                alt={emote.name}
              />
            )
          }
        }

        return (
          <Text key={i} size={textSize} color={textColor}>
            {t}
          </Text>
        )
      })}
  </div>
)
