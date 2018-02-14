export async function scanMessage() {
  return new Promise((resolve, reject) => {
    window.QRScanner.scan((err, content) => {
      if (err) return reject()
      return resolve(content)
    })
  })
}

export function showCameraOutput() {
  return window.QRScanner.show()
}

export function cleanUp() {
  return window.QRScanner.destroy()
}
