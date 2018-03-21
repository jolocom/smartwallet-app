export async function scanMessage() {
  return new Promise((resolve, reject) => {
    if (window.QRScanner === undefined) {
      resolve('mockQRscan')
    }
    window.QRScanner.scan((err, content) => {
      if (err) return reject(err)
      return resolve(content)
    })
  })
}

export function showCameraOutput() {
  if (window.QRScanner === undefined) {
    return 'mockQRshow'
  }
  return window.QRScanner.show()
}

export function cleanUp() {
  if (window.QRScanner === undefined) {
    return 'mockQRcleanUp'
  }
  return window.QRScanner.destroy()
}
