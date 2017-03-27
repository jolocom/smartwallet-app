import EntropyService from './entropy'

export default function create() {
  return {
    entropy: new EntropyService()
  }
}
