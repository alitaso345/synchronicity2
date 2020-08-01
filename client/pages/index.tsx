import { useEffect, useState } from 'react'
import { NextPage } from 'next'
import { User } from 'proto/synchronicity_pb'
import { SynchronicityServiceClient } from 'proto/SynchronicityServiceClientPb'
import { Empty } from 'google-protobuf/google/protobuf/empty_pb'
import { apiEndpoint } from 'resources/constants'

const RootPage: NextPage = () => {
  const [users, setUsers] = useState<Array<User>>([])

  useEffect(() => {
    const userServiceClient = new SynchronicityServiceClient(
      apiEndpoint(window.location.host)
    )
    userServiceClient.getUsers(new Empty(), {}, (_, res) => {
      const usersList = res.getUsersList()
      setUsers(usersList)
    })
  }, [])

  return (
    <div className="container m-auto">
      <h1 className="font-sans text-gray-800 text-center text-6xl">
        Synchronicity
      </h1>
      <div>
        <div className="p-8 grid grid-cols-3 gap-4">
          {users.map((user, index) => {
            return (
              <div
                key={index}
                className="max-w-xs rounded overflow-hidden shadow-lg"
              >
                <img
                  className="w-full"
                  src={`${user.getName()}.jpg`}
                  alt="Sunset in the mountains"
                />
                <div className="px-6 py-4">
                  <div className="font-bold text-xl mb-2">{user.getName()}</div>
                </div>
                <div className="px-6 py-4">
                  <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                    {user.getTwitterhashtag()}
                  </span>
                  <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                    {user.getTwitchchannel()}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default RootPage
