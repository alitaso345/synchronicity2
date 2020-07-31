export const apiEndpoint =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080'
    : 'http://' + window.location.host
