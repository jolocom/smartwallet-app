/**
 * Debugs a view with a random color. Only works in __DEV__ mode
 */
export const debugView = () => {
  return __DEV__
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
}
