import { NextPage } from 'next'
import Nav from 'componenets/Nav/Nav'

const RootPage: NextPage = () => {
  return (
    <div>
      <Nav />
      <div className="py-20">
        <h1 className="text-5xl text-center text-accent-1">
          Next.js + Tailwind CSS
        </h1>
      </div>
    </div>
  )
}

export default RootPage
