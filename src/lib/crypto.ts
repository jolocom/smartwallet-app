const CryptoJS = require('crypto-js')

export interface EncryptionLibInterface {
  decryptWithPass: (
    { cipher, pass }: { cipher: string; pass: string },
  ) => string
  encryptWithPass: ({ data, pass }: { data: string; pass: string }) => string
}

export class EncryptionLib implements EncryptionLibInterface {
  decryptWithPass({ cipher, pass }: { cipher: string; pass: string }): string {
    return CryptoJS.AES.decrypt(cipher, pass).toString(CryptoJS.enc.Utf8)
  }

  encryptWithPass({ data, pass }: { data: string; pass: string }): string {
    return CryptoJS.AES.encrypt(data, pass).toString()
  }
}
