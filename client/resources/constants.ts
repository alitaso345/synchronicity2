export const apiEndpoint = (host: string) =>
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080'
    : 'http://' + host
