import { NextPage } from 'next'
import Router from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { GetUserRequest, UpdateUserRequest, User } from 'proto/synchronicity_pb'
import { SynchronicityServiceClient } from 'proto/SynchronicityServiceClientPb'
import { apiEndpoint } from 'resources/constants'

type Props = {
  name: string
}
const UserEdit: NextPage<Props> = ({ name }) => {
  const [user, setUser] = useState<User>(null)
  const [twitterHashTag, setTwitterHashTag] = useState('')
  const [twitchChannel, setTwitchChannel] = useState('')

  useEffect(() => {
    const userServiceClient = new SynchronicityServiceClient(apiEndpoint(window.location.host))
    const request = new GetUserRequest()
    request.setName(name)
    userServiceClient.getUser(request, {}, (err, res) => {
      if (err) {
        return
      }

      setUser(res.getUser())
      setTwitterHashTag(res.getUser().getTwitterhashtag())
      setTwitchChannel(res.getUser().getTwitchchannel())
    })
  }, [])

  const submitUpdate = useCallback(() => {
    const userServiceClient = new SynchronicityServiceClient(apiEndpoint(window.location.host))
    const request = new UpdateUserRequest()
    const updatedUser = new User()
    updatedUser.setId(user.getId())
    updatedUser.setName(user.getName())
    updatedUser.setTwitterhashtag(twitterHashTag)
    updatedUser.setTwitchchannel(twitchChannel)
    request.setUser(updatedUser)

    userServiceClient.updateUser(request, {}, (err, res) => {
      if (err) {
        alert('設定の更新に失敗しました')
        return
      }

      alert('設定を更新しました')
      Router.push('/users/[name]', `/users/${res.getUser().getName()}`)
    })
  }, [user, twitterHashTag, twitchChannel])

  return (
    <>
      <h1>設定編集</h1>
      <div>
        <label>Twitterハッシュタグ</label>
        <input
          type="text"
          placeholder="#某isNight"
          value={twitterHashTag}
          onChange={(e) => setTwitterHashTag(e.target.value)}
        />
      </div>

      <div>
        <label>Twitchチャンネル</label>
        <input
          type="text"
          placeholder="#bou_is_twitch"
          value={twitchChannel}
          onChange={(e) => setTwitchChannel(e.target.value)}
        />
      </div>

      <button onClick={submitUpdate}>更新する</button>

      <div>
        <a href={`/users/${name}`}>ユーザー詳細</a>
      </div>
    </>
  )
}

UserEdit.getInitialProps = async ({ query }) => {
  return {
    name: query.name as string,
  }
}

export default UserEdit
