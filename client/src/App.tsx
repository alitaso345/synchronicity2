import * as React from 'react'
import { useState, useEffect } from 'react'
import { emoteData } from './emoteData'
import { Setting, Comment, PlatformType } from './timeline/timeline_pb'
import { TimelineClient } from './timeline/TimelineServiceClientPb'

type Message = {
  user: string
  text: string
  platform: PlatformType
}

const convertToMessage = (res: Comment): Message => ({
  user: res.getName(),
  text: res.getMessage(),
  platform: res.getPlatformType()
})

export function App {
  const [messages, update] = useState<Message[]>([])

  useEffect(
    () => {
      const setting = new Setting
      setting.setHashTag('#mogra')
      setting.setChannelName('#mogra')

      const timelineClient = new TimelineClient('http://localhost:8080', {}, {})
      const stream = timelineClient.connect(setting, {})
      stream.on('data', (response: Comment) => {
        const message = convertToMessage(response)
        update(_messages => {
          if (_messages.length > 50) {
            _messages.pop()
          }
          return [message, ..._messages]
        })
      })
    },
    []
  )

  return (
    <div>
      {messages.map((item, index) => (
        <div
          className="message-item"
          key={index}
        >
          <span
            className="platform-icon"
          >
            <img
              src={item.platform === PlatformType.TWITTER ? "../Twitter_Social_Icon_Circle_Color.png" : "../TwitchGlitchPurple.png"}
              width={18}
              height={18}
            />
          </span>

          <span
            className="user"
            style={{
              color: `${item.platform === PlatformType.TWITTER ? "#00ACEE" : "#6441a5"}`,
              fontFamily: `Meiryo, system-ui, -apple-system, BlinkMacSystemFont, sans-serif`,
              fontSize: '18px'
            }}
          >
            {item.user}
          </span>

          <span
            className="colon"
          >:
          </span>

          {item.text.split(" ").map((t, i) => {
            for (const emote of emoteData) {
              if (emote.name === t) {
                return <img key={i} src={emote.url} width={emote.width} height={emote.height} alt={emote.name} />
              }
            }

            return <span
              className="message"
              key={i}
              >{t}</span>
          })}
        </div>
      ))}
    </div>
  )
}
