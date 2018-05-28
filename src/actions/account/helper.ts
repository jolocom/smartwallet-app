
import { IVerifiableCredentialAttrs } from 'jolocom-lib/js/credentials/verifiableCredential/types'

export interface Claim {
  id: string
  type?: string
  claimField: string
  claimValue?: string
  multiLine?: boolean
  category: string
  [key: string]: Claim[keyof Claim]
 }

export interface Claims {
  [key: string]: Claim[]
}

const categoryUIDefinition: {[key: string] : string} = {
  name: 'personal',
  birthDate: 'personal',
  gender: 'personal',
  email: 'contact',
  telephone: 'contact',
  socialMedia: 'contact'
}

export const prepareClaimsForState = (claims: IVerifiableCredentialAttrs[]) : Claims => {
  const preparedClaims : Claim[] = []
  claims.map((claim: IVerifiableCredentialAttrs) => {
    const nestedClaims = Object.keys(claim.claim)
    nestedClaims.splice(nestedClaims.indexOf('id'), 1)

    nestedClaims.map((nClaim) => {
      const cl: Claim = {
        id: claim.id,
        type: claim.type[1],
        claimField: nClaim,
        claimValue: claim.claim[nClaim],
        multiLine: typeof claim.claim[nClaim] === 'string' ? false : true,
        category: categoryUIDefinition[nClaim] ? categoryUIDefinition[nClaim] : 'other' 
      }
      preparedClaims.push(cl)
    })
  })

  const orderedClaims = arrayToObject(preparedClaims, 'category')
  return orderedClaims
}

const arrayToObject = (claimsArray: Claim[], category: string) : Claims => {
  return claimsArray.reduce((accumulator: Claims , claimItem: Claim) : Claims => {
    if (accumulator[claimItem.category]) {
      accumulator[claimItem.category].push(claimItem)
    } else {
      accumulator[claimItem.category] = [claimItem]
    }
    return accumulator
  }, {} )
}