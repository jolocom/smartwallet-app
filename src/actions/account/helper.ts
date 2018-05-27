import { Claim, Claims } from 'src/ui/home/components/claimOverview'
import { VerifiableCredential } from 'jolocom-lib/js/credentials/verifiableCredential'

const categoryUIDefinition: {[key: string] : string} = {
  name: 'personal',
  birthDate: 'personal',
  gender: 'personal',
  email: 'contact',
  telephone: 'contact',
  socialMedia: 'contact'
}

// TODO: check types from class
export const prepareClaimsForState = (claims: VerifiableCredential[]) : Claims => {
  const preparedClaims : Claim[] = []
  claims.map((claim: VerifiableCredential) => {
    const singleClaim = {
      id: claim.id,
      type: claim.type[1]
    }
    
    const nestedClaims = Object.keys(claim.claim)
    nestedClaims.splice(nestedClaims.indexOf('id'), 1)

    nestedClaims.map((nClaim) => {
      const nestedInfo = {
        claimField: nClaim,
        claimValue: claim.claim[nClaim],
        multiLine: typeof claim.claim[nClaim] === 'string' ? false : true,
        category: categoryUIDefinition[nClaim] ? categoryUIDefinition[nClaim] : 'other' 
      }

      preparedClaims.push(Object.assign({}, singleClaim, nestedInfo))
    })
  })

  const orderedClaims = arrayToObject(preparedClaims, 'category')
  return orderedClaims
}

const arrayToObject = (claimsArray: Claim[], category: string) : Claims => {
  return claimsArray.reduce((accumulator: Claims , claimItem: Claim) : Claims => {
    if (accumulator[claimItem[category]]) {
      accumulator[claimItem[category]].push(claimItem)
    } else {
      accumulator[claimItem[category]] = [claimItem]
    }
    return accumulator
  }, {} )
}