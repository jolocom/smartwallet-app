export const promisifySubmit = (submitFn: (pin: string) => void) => {
  return (pin: string, cb: () => void) => {
    return new Promise((res) => {
      submitFn(pin)
      cb()
      res(true)
    })
  }
}
