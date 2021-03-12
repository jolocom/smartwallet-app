import { useAgent } from './sdk'
import { useDispatch, useSelector } from 'react-redux'
import { UICredential } from '~/types/credentials'
import { isCredentialDocument } from '~/utils/dataMapping'
import { setCredentials, deleteCredential } from '~/modules/credentials/actions'
import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential'
import { CredentialType } from '@jolocom/sdk/js/credentials'
import { getDid } from '~/modules/account/selectors'
import { useEffect, useState } from 'react'
import { LogoContainerFAS } from '~/screens/Modals/Interaction/InteractionFlow/components/styled'
import { Agent } from '@jolocom/sdk'

/**
 * Used for mapping and syncing credentials with the SDK storage. Currently no CRUD
 * operations with the credentials module (e.g. after a credential offer. not
 * syncing with the storage, but adding the new mapped @UICredential(s) to the store).
 */

// TODO: remove this - potentially break up into functions if functionality should be reused somewhere else again 
export const useSyncStorageCredentials = () => {
  const agent = useAgent()
  const dispatch = useDispatch()

  const credentialToUICredential = async (
    cred: SignedCredential,
  ): Promise<UICredential> => {
    const { renderInfo } = await agent.storage.get.credentialMetadata(cred)
    const {
      name,
      expires,
      claim,
      issued,
      id,
      issuer: issuerDid,
      type: typeArr,
    } = cred
    const issuer = await agent.storage.get.publicProfile(issuerDid)
    const type = typeArr[typeArr.length - 1]

    return {
      id,
      type,
      claim,
      issuer,
      renderInfo,
      metadata: {
        name,
        expires,
        issued,
      },
    }
  }

  return async () => {
    const allCreds = await agent.storage.get.verifiableCredential()

    
    // TODO: remove this

    // console.log({allCreds});

    // const displayCredentials = allCreds.map(async c => {
    //   const {type, renderInfo, issuer, credential} = await agent.storage.get.credentialMetadata(c);
      
    //   let updatedCredentials = {
    //     type,
    //     renderInfo,
    //     issuer
    //   };
    //   if (credential) {
    //     const credType = new CredentialType(type, credential);
    //     // console.log({credType});
        
    //     const {name, display: {properties}} = credType.display(c.claim);
    //     updatedCredentials = {...updatedCredentials, name, properties}
    //   }
    //   return updatedCredentials
    // })
    // Promise.all(displayCredentials).then(val =>console.log({val}));
    
    
    const credentials = await allCreds.reduce<Promise<UICredential[]>>(
      async (accPromise, cred) => {
        const acc = await accPromise

        if (isCredentialDocument(cred, agent.idw.did)) {
          const uiCredential = await credentialToUICredential(cred)
          acc.push(uiCredential)
        }

        return acc
      },
      Promise.resolve([]),
    )
    dispatch(setCredentials(credentials))
  }
}

export const useDeleteCredential = () => {
  const agent = useAgent()
  const dispatch = useDispatch()

  return async (id: string) => {
    await agent.storage.delete.verifiableCredential(id)

    dispatch(deleteCredential(id))
  }
}


