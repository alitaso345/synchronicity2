import { useEffect, useState } from 'react'
import { NextPage } from 'next'
import Link from 'next/link'
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

        <Link href="/users/[name]/edit" as={`/users/${name}/edit`}>
          <a>設定編集</a>
        </Link>

        <Link href="/users">
          <a>ユーザー一覧</a>
        </Link>

        <Link href="/users/[name]/timeline" as={`/users/${name}/timeline`}>
          <a >タイムライン表示</a>
        </Link>
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
