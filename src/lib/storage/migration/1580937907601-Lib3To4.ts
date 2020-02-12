import { MigrationInterface, QueryRunner } from 'typeorm'
import { getPassword } from './util'
import { MasterKeyEntity } from '../entities'
import {
  encryptWithLib4,
  decryptWithLib4,
  decryptWithLib3,
  encryptWithLib3,
} from '../../compat/jolocomLib'

const getMasterKeys = (queryRunner: QueryRunner): Promise<MasterKeyEntity[]> =>
  queryRunner.query('SELECT encryptedEntropy FROM master_keys;')

// Migration for JolocomLib 3.0.0 to JolocomLib 4.0.0.
export class Lib3To41580937907601 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    let pass: string
    try {
      pass = await getPassword()
    } catch (e) {
      return
    }

    const entries = await getMasterKeys(queryRunner)
    return Promise.all(
      entries.map(async ({ encryptedEntropy }) => {
        const decrypted = decryptWithLib3(
          Buffer.from(encryptedEntropy, 'hex'),
          pass,
        )
        const reencrypted = await encryptWithLib4(decrypted, pass)

        return queryRunner.query(
          `UPDATE master_keys ` +
            `SET encryptedEntropy = '${reencrypted.toString('hex')}' ` +
            `WHERE encryptedEntropy = '${encryptedEntropy}'`,
        )
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    let pass: string

    try {
      pass = await getPassword()
    } catch (e) {
      return
    }

    const entries = await getMasterKeys(queryRunner)
    return Promise.all(
      entries.map(({ encryptedEntropy }) => {
        const decrypted = decryptWithLib4(
          Buffer.from(encryptedEntropy, 'hex'),
          pass,
        )
        const reencrypted = encryptWithLib3(decrypted, pass).toString('hex')

        return queryRunner.query(
          `UPDATE master_keys ` +
            `SET encryptedEntropy = '${reencrypted}' ` +
            `WHERE encryptedEntropy = '${encryptedEntropy}'`,
        )
      }),
    )
  }
}
