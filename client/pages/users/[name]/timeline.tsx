import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { GetTimelineRequest, TimelineResponse } from 'proto/synchronicity_pb'
import { SynchronicityServiceClient } from 'proto/SynchronicityServiceClientPb'
import { apiEndpoint } from 'resources/constants'
import { Timeline } from 'componenets/Timeline/Timeline'

type Props = {
  name: string
}

const TimeLinePage: NextPage<Props> = ({ name }) => {
  const [responses, update] = useState<TimelineResponse[]>([])

  useEffect(() => {
    const request = new GetTimelineRequest()
    request.setUsername(name as string)

    const service = new SynchronicityServiceClient(apiEndpoint, {}, {})
    const stream = service.getTimeline(request, {})
    stream.on('data', (response: TimelineResponse) => {
      update((_responses) => {
        if (_responses.length > 50) {
          _responses.shift()
        }
        return [..._responses, response]
      })
    })

    return () => {
      console.log('cancel streaming')
      stream.cancel()
    }
  }, [])

  return <Timeline responses={responses} />
}

TimeLinePage.getInitialProps = async ({ query }) => {
  return {
    name: query.name as string,
  }
}

export default TimeLinePage
