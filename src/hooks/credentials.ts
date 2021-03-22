import { useAgent } from './sdk'
import { useDispatch } from 'react-redux'
import { deleteCredential } from '~/modules/credentials/actions'

export const useDeleteCredential = () => {
  const agent = useAgent()
  const dispatch = useDispatch()

  return async (id: string) => {
    await agent.storage.delete.verifiableCredential(id)

    dispatch(deleteCredential(id))
  }
}
