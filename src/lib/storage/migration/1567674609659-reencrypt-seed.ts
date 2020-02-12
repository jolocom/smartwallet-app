/**
 * This migration re-encrypts the encryptedEntropy in the wallet database using
 * the jolocom-lib (which uses node crypto) instead of the previously used
 * crypto-js dependency
 */

import { MigrationInterface, QueryRunner } from 'typeorm/browser'
import CryptoJS from './../../compat/cryptojs'
import { getPassword } from './util'
import { MasterKeyEntity } from '../entities'
import { encryptWithLib3 } from './../../compat/jolocomLib'

const getMasterKeys = (queryRunner: QueryRunner): Promise<MasterKeyEntity[]> =>
  queryRunner.query('SELECT encryptedEntropy FROM master_keys;')

export class ReencryptSeed1567674609659 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    let password: string
    try {
      password = await getPassword()
    } catch (e) {
      // This may fail if the application was uninstalled and reinstalled, as
      // the android keystore is cleared on uninstall, but the database may
      // still remain (and is probably pre-migrations, given that this is
      // running in the first place). In that case we take no action, and let
      // the app init code handle things
      return
    }

    const entries = await getMasterKeys(queryRunner)
    return Promise.all(
      entries.map(({ encryptedEntropy }) => {
        // If the seed is base64 encoded, it must be migrated (CryptoJS encoded base64)
        // If the seed is hex encoded, it must not be migrated (The newer version of the lib use HEX)
        if (/^[0-9a-fA-F]*$/.test(
          encryptedEntropy)) return

        const decrypted = CryptoJS.AES.decrypt(
          encryptedEntropy,
          password,
        ,
        ).toString()
        const reencrypted = encryptWithLib3(
          Buffer.from(decrypted, 'hex'),
         
          password,
        ).toString('hex')

        return queryRunner.query(
          `UPDATE master_keys ` +
            `SET encryptedEntropy = '${reencrypted}' ` +
            `WHERE encryptedEntropy = '${encryptedEntropy}'`,
        ,
        )
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    throw new Error("There's no going back")
    // because why?
  }
}
