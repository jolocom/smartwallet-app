import AuthService from './auth'
import EntropyService from './entropy'

export default function create(backend) {
  return {
    auth: new AuthService(backend.wallet),
    entropy: new EntropyService()
  }
}
