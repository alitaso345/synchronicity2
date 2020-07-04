import * as React from 'react'
import { Message } from './App'
import { emoteData } from './emoteData'
import { PlatformType } from './timeline/timeline_pb'

type Props = {
  index: number
  item: Message
}

export const ChatItem: React.FC<Props> = ({ item, index }) => (
  <div className="message-item" key={index}>
    <span className="platform-icon">
      <img
        src={
          item.platform === PlatformType.TWITTER
            ? '../public/Twitter_Social_Icon_Circle_Color.png'
            : '../public/TwitchGlitchPurple.png'
        }
        width={18}
        height={18}
      />
    </span>

    <span
      className="user"
      style={{
        color: `${
          item.platform === PlatformType.TWITTER ? '#00ACEE' : '#6441a5'
          }`,
        fontFamily: `Meiryo, system-ui, -apple-system, BlinkMacSystemFont, sans-serif`,
        fontSize: '18px'
      }}
    >
      {item.user}
    </span>

    <span className="colon">:</span>

    {item.text.split(' ').map((t, i) => {
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
        <span className="message" key={i}>
          {t}
        </span>
      )
    })}
  </div>
)
