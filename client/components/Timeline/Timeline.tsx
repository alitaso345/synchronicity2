import * as React from 'react'
import { useEffect } from 'react'
import { TimelineResponse } from 'proto/synchronicity_pb'
import { ChatItem } from 'components/ChatItem/ChatItem'

type Props = {
  responses: TimelineResponse[]
}

export const Timeline: React.FC<Props> = ({ responses }) => {
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
        <ChatItem item={item} key={index} />
      ))}
    </div>
  )
}
