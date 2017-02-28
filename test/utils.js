export function stub(options = {}) {
  const func = (...args) => {
    func.called = true
    func.calledWithArgs = args
    func.calls.push({args: args})
    if (options.returns) {
      return options.returns
    }
  }
  func.returns = (val) => {
    options.returns = val
    return func
  }
  func.reset = () => {
    func.called = false
    func.calledWithArgs = null
    func.calls = []
    return func
  }
  func.reset()
  return func
}
