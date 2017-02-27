export function stub(options = {}) {
  const func = (...args) => {
    func.called = true
    func.calledWithArgs = args
    if (options.returns) {
      return options.returns
    }
  }
  func.returns = (val) => {
    options.returns = val
    return func
  }
  func.called = false
  return func
}
