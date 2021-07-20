module.exports = function (results) {
  return results.reduce((acc, v) => {
    acc += v.errorCount
    return acc
  }, 0)
}
