import { useSelector } from 'react-redux'
import { getAllCredentials } from '~/modules/credentials/selectors'

const useBackup = () => {
  const credentials = useSelector(getAllCredentials)

  const shouldWarnBackup = () => {
    return !!credentials.length
  }

  return { shouldWarnBackup }
}

export default useBackup
