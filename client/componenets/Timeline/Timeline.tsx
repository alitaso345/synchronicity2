import * as React from 'react'
import { TimelineResponse } from 'proto/synchronicity_pb'
import { ChatItem } from 'componenets/ChatItem/ChatItem'
import styles from './Timeline.module.scss'

type Props = {
  responses: TimelineResponse[]
}

export const Timeline: React.FC<Props> = ({ responses }) => (
  <div className={styles.bodybox}>
    <div className={styles.chatborder}>
      {responses.map((item, index) => (
        <ChatItem item={item} key={index} />
      ))}
    </div>
  </div>
)
