import { NextPage } from 'next'
import Link from 'next/link'
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

    const service = new SynchronicityServiceClient(
      apiEndpoint(window.location.host),
      {},
      {}
    )
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

  return responses.length > 0 ? (
    <Timeline responses={responses} />
  ) : (
    <div className="flex items-center">
      <div className="m-2">タイムライン取得中...</div>

      <Link href="/users/[name]/edit" as={`/users/${name}/edit`}>
        <button
          className="m-2 shadow bg-gray-900 hover:bg-gray-800 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
          type="button"
        >
          設定を変更する
        </button>
      </Link>

      <Link href="/">
        <button
          className="m-2 shadow bg-gray-900 hover:bg-gray-800 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
          type="button"
        >
          ホームへ戻る
        </button>
      </Link>
    </div>
  )
}

TimeLinePage.getInitialProps = async ({ query }) => {
  return {
    name: query.name as string,
  }
}

export default TimeLinePage
