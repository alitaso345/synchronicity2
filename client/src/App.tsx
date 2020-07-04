import * as React from 'react'
import { useState, useEffect } from 'react'
import { Setting, Comment, PlatformType } from './timeline/timeline_pb'
import { TimelineClient } from './timeline/TimelineServiceClientPb'
import { ChatItem } from './ChatItem'

const apiEndpoint = process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : 'http://' + window.location.host

export type Message = {
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
  const [hashTag, updateHashTag] = useState('#TM12HLIVE')
  const [channel, updateChannel] = useState('#bou_is_twitch')
  const [submit, updateSubmit] = useState(false)
  const [messages, update] = useState<Message[]>([])

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
          <ChatItem item={item} index={index} />
        ))}
      </div>
    </>
  )
}
