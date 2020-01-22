/**
 * This migration re-encrypts the encryptedEntropy in the wallet database using
 * the jolocom-lib (which uses node crypto) instead of the previously used
 * crypto-js dependency
 */

import { MigrationInterface, QueryRunner } from 'typeorm/browser'
import { reencryptWithJolocomLib } from 'src/lib/compat/cryptojs'

export class ReencryptSeed1567674609659 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const entries = await queryRunner.query(
      'SELECT encryptedEntropy FROM master_keys;',
    )

    if (!entries.length) return

    let password: string
    try {
      // If there are keys to re-encrypt, then we need to get the password.
      password = await getPassword()
    } catch (e) {
      // This may fail if the application was uninstalled and reinstalled, as
      // the android keystore is cleared on uninstall, but the database may
      // still remain (and is probably pre-migrations, given that this is
      // running in the first place). In that case we take no action, and let
      // the app init code handle things
      return
    }

    await Promise.all(
      entries.map((obj: any) => {
        const encryptedEntropy = obj.encryptedEntropy
        // encryptedEntropy is base64 encoded in the latest release (1.6.0), but is
        // hex encoded on the current develop branch (unreleased), and also
        // doesn't need re-encryption if it was created by code in the current
        // develop (already not using crypto-js)
        const reencrypted =
          encryptedEntropy.replace(/[0-9a-f]+/, '') != '' ?
          reencryptWithJolocomLib(encryptedEntropy, password) :
          encryptedEntropy

        return queryRunner.query(
          `UPDATE master_keys ` +
          `SET encryptedEntropy = '${reencrypted}' ` +
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

async function getPassword(): Promise<string> {
  // At the time of writing this file, the encryption password is stored in
  // react-native-keychain and accessesed through src/lib/keychain.ts, but code
  // is reproduced here in case things change in the future

  if (typeof navigator !== 'undefined' && navigator.product == 'ReactNative') {
    // We load react-native-keychain here conditionally because it is not
    // transpiled and cannot be loaded into ts-node (if running migrations locally
    // on dev machine)
    const Keychain = require('react-native-keychain')

    const keyChainData = await Keychain.getGenericPassword()
    if (keyChainData && keyChainData.password) {
      return keyChainData.password
    } else {
      throw new Error(
        "Can't load password from react-native-keychain"
      )
    }
  } else {
    const password = process.env.SMARTWALLET_PASSWORD
    if (!password) {
      throw new Error(
        "Node envrionment detected. " +
        "Please set a password in the environment variable SMARTWALLET_PASSWORD"
      )
    }
    return password
  }
}
