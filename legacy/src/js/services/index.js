import EntropyService from './entropy'
import StorageService from './storage'

export default function create(backend) {
  return {
    entropy: new EntropyService(),
    storage: new StorageService()
  }
}
