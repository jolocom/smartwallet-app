import { useCredentialShareFlow } from './useCredentialShareFlow'
import { useCompleteInteraction } from './useCompleteInteraction'

const useCredentialShareSubmit = () => {
  const { assembleShareResponseToken } = useCredentialShareFlow()
  const { completeInteraction } = useCompleteInteraction(async () => {
    await assembleShareResponseToken()

    /*
     * NOTE:
     * 1. in case you want to override a general
     * interaction success toast, return an object
     * with `successToast` property.
     * 2. in case you choose to pause an execution of
     * the interaction flow and inject custom logic
     * to be run meanwhile return an object
     * `{pause: true, pauseFn: () => void}`
     */
    return undefined
  })

  return completeInteraction
}

export default useCredentialShareSubmit
