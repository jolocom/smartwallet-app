const CryptoJS = require('crypto-js')

export class EncryptionLib {
  public static decryptWithPass({
    cipher,
    pass,
  }: {
    cipher: string
    pass: string
  }): string {
    return CryptoJS.AES.decrypt(cipher, pass).toString(CryptoJS.enc.Utf8)
  }

  public static encryptWithPass({
    data,
    pass,
  }: {
    data: string
    pass: string
  }): string {
    return CryptoJS.AES.encrypt(data, pass).toString()
  }
}
