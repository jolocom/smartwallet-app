/**
 * Debugs a view with a random color. Only works in __DEV__ mode
 */
export const debugView = () =>
  __DEV__
    ? {
        borderWidth: 1,
        borderColor:
          'rgb(' +
          Math.floor(Math.random() * 256) +
          ',' +
          Math.floor(Math.random() * 256) +
          ',' +
          Math.floor(Math.random() * 256) +
          ')',
      }
    : {}

/**
 * Finds whether the app is in the Jest testing environment
 */
export const isJestTesting = () => process.env.JEST_WORKER_ID !== undefined

/*
 * Logs structured JSON data
 */
export const LOG = (data: any) => {
  if (__DEV__) {
    console.log(JSON.stringify(data, null, 2))
  }
}
