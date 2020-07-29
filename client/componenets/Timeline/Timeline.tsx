import * as React from 'react'
import { useEffect } from 'react'
import { TimelineResponse } from 'proto/synchronicity_pb'
import { ChatItem } from 'componenets/ChatItem/ChatItem'
import styles from './Timeline.module.scss'

type Props = {
  responses: TimelineResponse[]
}

export const Timeline: React.FC<Props> = ({ responses }) => {
  useEffect(() => {
    const feedbox = document.getElementById('feedbox')
    if (feedbox !== null) {
      feedbox.scrollTop = feedbox.scrollHeight
    }
  }, [responses])

  return (
    <div className={styles.bodybox}>
      <div id="feedbox" className={styles.feedbox}>
        {responses.map((item, index) => (
          <ChatItem item={item} key={index} />
        ))}
      </div>
    </div>
  )
}
