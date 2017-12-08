
export function stub(options = {}) {
  const func = (...args) => {
    func.called = true
    func.calledWithArgs = args
    func.calls.push({args: args})
    return options.returns
  }

  func.returns = (...args) => {
    if (args.length) {
      options.returns = args[0]
      return func
    } else {
      return options.returns
    }
  }
  func.returnsAsync = (...args) => {
    if (args.length) {
      options.returns = Promise.resolve(args[0])
      return func
    } else {
      return options.returns
    }
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

export function withStubs(stubs, func) {
  const original = stubs.map(([obj, key]) => obj[key])

  stubs.forEach(([obj, key, options]) => {
    obj[key] = stub(options)
  })

  const cleanup = () => {
    stubs.forEach(([obj, key], idx) => {
      obj[key] = original[idx]
    })
  }
  try {
    const promise = func()
    if (promise) {
      return promise.then(() => cleanup())
        .catch((e) => {
          cleanup()
          throw e
        })
    } else {
      cleanup()
    }
  } catch (e) {
    cleanup()
    throw e
  }
}
