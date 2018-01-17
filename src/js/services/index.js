import AuthService from './auth'
import EntropyService from './entropy'
import StorageService from './storage'

export default function create(backend) {
  return {
    auth: new AuthService(backend),
    entropy: new EntropyService(),
    storage: new StorageService()
  }
}
