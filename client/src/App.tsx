import * as React from 'react'
import { useState, useEffect } from 'react'
import { emoteData } from './emoteData'
import { Setting, Comment, PlatformType } from './timeline/timeline_pb'
import { TimelineClient } from './timeline/TimelineServiceClientPb'

const apiEndpoint = process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : 'http://' + window.location.host

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

export function App() {
  const [hashTag, updateHashTag] = useState('#某isNight')
  const [channel, updateChannel] = useState('#bou_is_twitch')
  const [submit, updateSubmit] = useState(false)
  const [messages, update] = useState<Message[]>([])

  console.log(process.env.NODE_ENV)

  useEffect(() => {
    console.log(hashTag, channel)
    const setting = new Setting()
    setting.setHashTag(hashTag)
    setting.setChannelName(channel)

    const timelineClient = new TimelineClient(apiEndpoint, {}, {})
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

    return () => {
      console.log('cancel streaming')
      stream.cancel()
    }
  }, [submit])

  return (
    <>
      <div>
        <div>Twitterハッシュタグ</div>
        <input
          type="text"
          value={hashTag}
          placeholder="#某isNight"
          onChange={e => updateHashTag(e.target.value)}
        />

        <div>Twitchチャンネル</div>
        <input
          type="text"
          value={channel}
          placeholder="#bou_is_twitch"
          onChange={e => updateChannel(e.target.value)}
        />

        <div>
          <button onClick={() => updateSubmit(!submit)}>変更する</button>
        </div>
      </div>
      <div>
        {messages.map((item, index) => (
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
        ))}
      </div>
    </>
  )
}
