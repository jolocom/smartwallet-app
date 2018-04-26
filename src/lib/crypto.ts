const CryptoJS = require('crypto-js')

export class EncryptionLib {
  decryptWithPass({cypher, pass}: {cypher: any, pass: string}): string {
    return CryptoJS.AES.decrypt(cypher, pass).toString(CryptoJS.enc.Utf8)
  }

  encryptWithPass({data, pass}: {data: string, pass: string}): any {
    return CryptoJS.AES.encrypt(data, pass)
  }
}

