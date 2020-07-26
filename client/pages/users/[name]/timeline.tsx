import { NextPage } from 'next'
import { useRouter } from 'next/router'

const TimeLine: NextPage = () => {
  const { id } = useRouter().query

  return <h1>TimeLine: {id}</h1>
}

export default TimeLine
