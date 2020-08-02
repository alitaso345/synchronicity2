import { NextPage } from 'next'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { GetUserRequest, UpdateUserRequest, User } from 'proto/synchronicity_pb'
import { SynchronicityServiceClient } from 'proto/SynchronicityServiceClientPb'
import { apiEndpoint } from 'resources/constants'
import Header from 'componenets/Header/Header'

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

  const initSetting = useCallback(() => {
    const userServiceClient = new SynchronicityServiceClient(
      apiEndpoint(window.location.host)
    )
    const request = new UpdateUserRequest()
    const updatedUser = new User()
    updatedUser.setId(user.getId())
    updatedUser.setName(user.getName())
    updatedUser.setTwitterhashtag('#某isNight')
    updatedUser.setTwitchchannel('#bou_is_twitch')
    request.setUser(updatedUser)

    userServiceClient.updateUser(request, {}, (err, res) => {
      if (err) {
        alert('設定の更新に失敗しました')
        return
      }

      setTwitterHashTag('#某isNight')
      setTwitchChannel('#bou_is_twitch')
      alert('設定を更新しました')
    })
  }, [user])

  return (
    <>
      <Header />
      {user && (
        <div className="container px-6">
          <h1 className="font-sans text-gray-800 text-center text-6xl">
            設定編集
          </h1>

          <form className="m-auto w-full max-w-lg">
            <h2 className="font-sans text-grap-800 text-center text-4xl">
              コメント取得設定
            </h2>

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

            <h2 className="font-sans text-grap-800 text-center text-4xl">
              コメント表示設定(実装中)
            </h2>

            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                  フォントサイズ
                </label>
              </div>
              <div className="md:w-2/3 relative">
                <select className="block appearance-none w-full bg-gray-200 py-2 px-4 border border-gray-200 text-gray-700 rounded leading-tight focus:outline-none focus:bg-white focus:border-purple-500">
                  <option>text-xs</option>
                  <option>text-sm</option>
                  <option>text-base</option>
                  <option>text-lg</option>
                  <option>text-xl</option>
                  <option>text-2xl</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                  アイコンサイズ
                </label>
              </div>
              <div className="md:w-2/3 relative">
                <select className="block appearance-none w-full bg-gray-200 py-2 px-4 border border-gray-200 text-gray-700 rounded leading-tight focus:outline-none focus:bg-white focus:border-purple-500">
                  <option>xs</option>
                  <option>sm</option>
                  <option>base</option>
                  <option>lg</option>
                  <option>xl</option>
                  <option>2xl</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <p className="block text-red-500 text-xs italic">
                コメント取得設定のみが初期化されます
              </p>
              <button
                className="shadow w-full bg-red-500 hover:bg-red-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                type="button"
                onClick={initSetting}
              >
                『某 is Festa!!!』用の設定に初期化する
              </button>
            </div>

            <div className="mb-6">
              <button
                className="shadow w-full bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                type="button"
                onClick={submitUpdate}
              >
                更新する
              </button>
            </div>

            <div>
              <Link
                href="/users/[name]/timeline"
                as={`/users/${user.getName()}/timeline`}
              >
                <button
                  className="shadow w-full bg-gray-900 hover:bg-gray-800 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                  type="button"
                >
                  タイムラインを見る
                </button>
              </Link>
            </div>
          </form>
        </div>
      )}
    </>
  )
}

UserEdit.getInitialProps = async ({ query }) => {
  return {
    name: query.name as string,
  }
}

export default UserEdit
