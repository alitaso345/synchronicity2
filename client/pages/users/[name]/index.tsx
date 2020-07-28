import { useEffect, useState } from 'react'
import { NextPage } from 'next'
import { User, GetUserRequest } from 'proto/synchronicity_pb'
import { SynchronicityServiceClient } from 'proto/SynchronicityServiceClientPb'
import { apiEndpoint } from 'resources/constants'

type Props = {
  name: string
}

const UserPage: NextPage<Props> = ({ name }) => {
  const [user, setUser] = useState<User>(null)

  useEffect(() => {
    const userServiceClient = new SynchronicityServiceClient(apiEndpoint)
    const request = new GetUserRequest()
    request.setName(name)
    userServiceClient.getUser(request, {}, (err, res) => {
      if (err) {
        return
      }

      const user = res.getUser()
      setUser(user)
    })
  }, [])

  return (
    user && (
      <>
        <h1>ユーザー詳細</h1>
        <div>Name: {user.getName()}</div>
        <div>Twitterハッシュタグ: {user.getTwitterhashtag()}</div>
        <div>Twitchチャンネル: {user.getTwitchchannel()}</div>

        <div>
          <a href={`/users/${name}/edit`}>設定編集</a>
        </div>

        <div>
          <a href={`/users`}>ユーザー一覧</a>
        </div>

        <div>
          <a href={`/users/${name}/timeline`}>タイムライン表示</a>
        </div>
      </>
    )
  )
}

UserPage.getInitialProps = async ({ query }) => {
  return {
    name: query.name as string,
  }
}

export default UserPage
