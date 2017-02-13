export function stub() {
  const func = (...args) => {
    func.called = true
    func.calledWithArgs = args
  }
  func.called = false
  return func
}
