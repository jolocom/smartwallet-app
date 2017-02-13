export function stub(options = {}) {
  const func = (...args) => {
    func.called = true
    func.calledWithArgs = args
    if (options.returns) {
      return options.returns
    }
  }
  func.called = false
  return func
}
