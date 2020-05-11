const useDelay = (callback: () => void, timeout = 2000) => {
  return new Promise((res) => {
    setTimeout(() => {
      callback()
      res()
    }, timeout)
  })
}

export default useDelay
