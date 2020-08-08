import * as React from 'react'
import { useEffect } from 'react'
import { TimelineResponse, User } from 'proto/synchronicity_pb'
import { ChatItem } from 'components/ChatItem/ChatItem'

type Props = {
  user: User | null
  responses: TimelineResponse[]
}

export const Timeline: React.FC<Props> = ({ user, responses }) => {
  useEffect(() => {
    const element = document.documentElement
    if (element !== null) {
      const bottom = element.scrollHeight - element.clientHeight
      window.scroll(0, bottom)
    }
  }, [responses])

  return (
    <div id="feedbox">
      {responses.map((item, index) => (
        <ChatItem
          item={item}
          textSize={user.getTextsize()}
          textColor={user.getTextcolor()}
          iconSize={user.getIconsize()}
          key={index}
        />
      ))}
    </div>
  )
}
