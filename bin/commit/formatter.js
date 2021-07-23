module.exports = function (results) {
  const conciseResult = results.reduce(
    (acc, v) => {
      acc.errorCount += v.errorCount
      acc.files += v.filePath + ' '
      return acc
    },
    { errorCount: 0, files: '' },
  )
  if (conciseResult.errorCount !== 0) {
    return conciseResult.files
  } else {
    return ''
  }
}
