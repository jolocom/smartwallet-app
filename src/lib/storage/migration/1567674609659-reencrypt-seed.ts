/**
 * This migration re-encrypts the encryptedEntropy in the wallet database using
 * the jolocom-lib (which uses node crypto) instead of the previously used
 * crypto-js dependency
 */

import { MigrationInterface, QueryRunner } from 'typeorm/browser'
import { reencryptWithJolocomLib } from 'src/lib/compat/cryptojs'

async function getPassword(): Promise<string> {
  let password: string | undefined
  // at the time of writing this file, the encryption password is stored in
  // react-native-keychain and accessesed through src/lib/keychain.ts, but code
  // is reproduced here in case things change in the future

  if (typeof navigator !== 'undefined' && navigator.product == 'ReactNative') {
    const Keychain = require('react-native-keychain')
    password = await Keychain.getGenericPassword()
    if (!password) {
      throw new Error(
        "Can't load password from react-native-keychain. Got: " + password
      )
    }
  } else {
    password = process.env.SMARTWALLET_PASSWORD
    if (!password) {
      throw new Error(
        "Can't load react-native-keychain." +
        "Please set a password in the environment variable SMARTWALLET_PASSWORD"
      )
    }
  }
  return password
}

export class ReencryptSeed1567674609659 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const entries = await queryRunner.query(
      'SELECT encryptedEntropy FROM master_keys;',
    )

    if (!entries.length) return

    // note we don't try to get a password if there is nothing to re-encrypt
    const password = await getPassword()

    await Promise.all(
      entries.map((obj: any) => {
        const encryptedEntropy = obj.encryptedEntropy
        const reencrypted = reencryptWithJolocomLib(encryptedEntropy, password)
        return queryRunner.query(
          `UPDATE master_keys ` +
          `SET encryptedEntropy = '${reencrypted}'` +
          `WHERE encryptedEntropy = '${encryptedEntropy}'`
        )
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    throw new Error("There's no going back")
    // because why?
  }
}
