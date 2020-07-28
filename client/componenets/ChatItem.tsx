import * as React from 'react'
import { emoteData } from 'componenets/emoteData'
import { TimelineResponse, PlatformType } from 'proto/synchronicity_pb'
// import styles from './ChatItem.module.scss'
import { Text } from './Text'

type Props = {
  item: TimelineResponse
}

export const ChatItem: React.FC<Props> = ({ item }) => (
  <div className="message-item">
    <span className="platform-icon">
      <img
        src={
          item.getPlatformType() === PlatformType.TWITTER
            ? '../public/Twitter_Social_Icon_Circle_Color.png'
            : '../public/TwitchGlitchPurple.png'
        }
      />
    </span>

    <Text platform={item.getPlatformType()}>{item.getName()}</Text>
    <Text>:</Text>

    {item.getMessage().split(' ').map((t, i) => {
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

      return <Text key={i}>{t}</Text>
    })}
  </div>
)
