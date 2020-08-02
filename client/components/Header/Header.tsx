const Header: React.FC = () => {
  return (
    <nav className="flex items-center justify-between flex-wrap bg-gray-800 p-6">
      <div className="flex items-center flex-shrink-0 text-white mr-6">
        <a href="/" className="font-semibold text-xl tracking-tight">
          Synchronicity
        </a>
      </div>
      <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
        <div className="text-sm lg:flex-grow">
          <a
            href="https://twitter.com/search?q=%23%E6%9F%90isNight&src=typeahead_click&f=live"
            className="block mt-4 lg:inline-block lg:mt-0 text-gray-500 hover:text-white mr-4"
          >
            Twitter
          </a>
          <a
            href="https://www.twitch.tv/bou_is_twitch/"
            className="block mt-4 lg:inline-block lg:mt-0 text-gray-500 hover:text-white mr-4"
          >
            Twitch
          </a>
          <a
            href="https://github.com/alitaso345/synchronicity2"
            className="block mt-4 lg:inline-block lg:mt-0 text-gray-500 hover:text-white"
          >
            GitHub
          </a>
        </div>
      </div>
    </nav>
  )
}

export default Header
