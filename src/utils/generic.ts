export const sleep = <T>(timeout: number, callback?: () => T) => {
  return new Promise((res) => {
    setTimeout(() => {
      const result = callback && callback()
      res(result)
    }, timeout)
  }) as Promise<T | undefined>
}
