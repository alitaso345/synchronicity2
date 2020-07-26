export const apiEndpoint =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080'
    : process.env.API_ENDPOINT
