import * as React from 'react'
import {Message} from '../src/App'
import {emoteData} from '../src/emoteData'
import {PlatformType} from '../src/timeline/timeline_pb'
import styles from './ChatItem.module.scss'
import {Text} from './Text'

type Props = {
  item: Message
}

export const ChatItem: React.FC<Props> = ({item}) => (
  <div className="message-item">
    <span className="platform-icon">
      <img
        className={styles.platformIconImage}
        src={
          item.platform === PlatformType.TWITTER
            ? '../public/Twitter_Social_Icon_Circle_Color.png'
            : '../public/TwitchGlitchPurple.png'
        }
      />
    </span>

    <Text platform={item.platform}>{item.user}</Text>
    <Text>:</Text>

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

      return <Text key={i}>{t}</Text>
    })}
  </div>
)
