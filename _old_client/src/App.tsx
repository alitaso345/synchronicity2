import * as React from 'react'
import { useState, useEffect } from 'react'
import { Setting, Comment, PlatformType } from './timeline/timeline_pb'
import { TimelineClient } from './timeline/TimelineServiceClientPb'
import { ChatItem } from '../components/ChatItem'
import styles from './App.module.scss'

const apiEndpoint =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080'
    : 'http://' + window.location.host

export type Message = {
  user: string
  text: string
  platform: PlatformType
}

const convertToMessage = (res: Comment): Message => ({
  user: res.getName(),
  text: res.getMessage(),
  platform: res.getPlatformType(),
})

export const App: React.FC = () => {
  const [hashTag, updateHashTag] = useState(
    '#都知事選を史上最大の投票率にしよう'
  )
  const [channel, updateChannel] = useState('#sunha_cos2')
  const [submit, updateSubmit] = useState(false)
  const [messages, update] = useState<Message[]>([])
  const [isDisplaySetting, updateSettingPanel] = useState('block')

  useEffect(() => {
    const setting = new Setting()
    setting.setHashTag(hashTag)
    setting.setChannelName(channel)

    const timelineClient = new TimelineClient(apiEndpoint, {}, {})
    const stream = timelineClient.connect(setting, {})
    stream.on('data', (response: Comment) => {
      const message = convertToMessage(response)
      update((_messages) => {
        if (_messages.length > 50) {
          _messages.shift()
        }
        return [..._messages, message]
      })
    })

    return () => {
      console.log('cancel streaming')
      stream.cancel()
    }
  }, [submit])

  useEffect(() => {
    const chatbox = document.getElementById('chatbox')
    if (chatbox !== null) {
      chatbox.scrollTop = chatbox.scrollHeight
    }
  }, [messages])

  const changeDisplaySettingPanel = () => {
    isDisplaySetting === 'none'
      ? updateSettingPanel('block')
      : updateSettingPanel('none')
  }

  return (
    <>
      <div
        className={styles.indivisual}
        onClick={() => changeDisplaySettingPanel()}
      ></div>
      <div className={styles.settings} style={{ display: isDisplaySetting }}>
        <h1>各種設定</h1>
        <div>Twitterハッシュタグ</div>
        <input
          type="text"
          value={hashTag}
          placeholder="#某isNight"
          onChange={(e) => updateHashTag(e.target.value)}
        />

        <div>Twitchチャンネル</div>
        <input
          type="text"
          value={channel}
          placeholder="#bou_is_twitch"
          onChange={(e) => updateChannel(e.target.value)}
        />

        <div>
          <button onClick={() => updateSubmit(!submit)}>変更する</button>
        </div>
      </div>
      <div className={styles.bodybox}>
        <div id="chatbox" className={styles.chatborder}>
          {messages.map((item, index) => (
            <ChatItem item={item} key={index} />
          ))}
        </div>
      </div>
    </>
  )
}