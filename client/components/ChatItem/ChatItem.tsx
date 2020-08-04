import * as React from 'react'
import { emoteData } from 'components/emoteData'
import { TimelineResponse, PlatformType } from 'proto/synchronicity_pb'
import { Text, TextSizeType, TextSize } from 'components/Text/Text'

type Props = {
  item: TimelineResponse
  textSize?: TextSizeType
}

export const ChatItem: React.FC<Props> = ({ item, textSize = TextSize.M }) => (
  <div className="flex items-center mb-1">
    <img
      className="rounded-full mr-1"
      width="20"
      height="20"
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
          <Text key={i} size={textSize}>
            {t}
          </Text>
        )
      })}
  </div>
)