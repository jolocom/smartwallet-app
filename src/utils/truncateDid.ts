export default function truncateDid(did: string) {
  return did.slice(0, 14) + '...' + did.slice(did.length - 4, did.length)
}
