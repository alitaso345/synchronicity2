import { NextPage } from 'next'
import Link from 'next/link'
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
    const userServiceClient = new SynchronicityServiceClient(
      apiEndpoint(window.location.host)
    )
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
    const userServiceClient = new SynchronicityServiceClient(
      apiEndpoint(window.location.host)
    )
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
    })
  }, [user, twitterHashTag, twitchChannel])

  return (
    user && (
      <div className="container">
        <h1 className="font-sans text-gray-800 text-center text-6xl">
          設定編集
        </h1>

        <form className="m-auto w-full max-w-lg">
          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3">
              <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                Twitchチャンネル
              </label>
            </div>
            <div className="md:w-2/3">
              <input
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                type="text"
                placeholder="#bou_is_twitch"
                value={twitchChannel}
                onChange={(e) => setTwitchChannel(e.target.value)}
              />
            </div>
          </div>

          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3">
              <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                Twitterハッシュタグ
              </label>
            </div>
            <div className="md:w-2/3">
              <input
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                type="text"
                placeholder="#某isNight"
                value={twitterHashTag}
                onChange={(e) => setTwitterHashTag(e.target.value)}
              />
            </div>
          </div>

          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3"></div>
            <div className="md:w-2/3">
              <button
                className="shadow bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                type="button"
                onClick={submitUpdate}
              >
                更新する
              </button>
            </div>
          </div>

          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3"></div>
            <div className="md:w-2/3">
              <Link href="/">
                <button
                  className="shadow bg-gray-900 hover:bg-gray-800 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                  type="button"
                >
                  ホームへ戻る
                </button>
              </Link>
            </div>
          </div>

          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3"></div>
            <div className="md:w-2/3">
              <Link
                href="/users/[name]/timeline"
                as={`/users/${user.getName()}/timeline`}
              >
                <button
                  className="shadow bg-gray-900 hover:bg-gray-800 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                  type="button"
                >
                  タイムラインを見る
                </button>
              </Link>
            </div>
          </div>
        </form>
      </div>
    )
  )
}

UserEdit.getInitialProps = async ({ query }) => {
  return {
    name: query.name as string,
  }
}

export default UserEdit
