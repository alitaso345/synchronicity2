import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()

export const apiEndpoint =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080'
    : publicRuntimeConfig.apiEndpoint
