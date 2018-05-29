
import { IVerifiableCredentialAttrs } from 'jolocom-lib/js/credentials/verifiableCredential/types'

interface ClaimValues {
  claimField: string,
  claimValue?: string
}

export interface Claim {
  id: string
  type?: string
  issuer?: string
  claim: ClaimValues[]
  multiLine?: boolean
  category: string
  [key: string]: Claim[keyof Claim]
 }

export interface Claims {
  [key: string]: Claim[]
}

const categoryUIDefinition: {[key: string] : string} = {
  TelephoneCredential: 'contact',
  EmailCredential: 'contact',
  NameCreddential: 'personal'
}

export const prepareClaimsForUI = (claims: IVerifiableCredentialAttrs[]) : Claims => {
  const preparedClaims : Claim[] = []
  claims.map((claim: IVerifiableCredentialAttrs) => {
    delete claim.claim['id']
    const claimVal = flattenInnerClaim(claim.claim)   
    const cl: Claim = {
      id: claim.id,
      type: claim.type[1],
      issuer: claim.issuer,
      claim: claimVal,
      category: categoryUIDefinition[claim.type[1]] ? categoryUIDefinition[claim.type[1]] : 'other',
      multiLine: Object.keys(claim.claim).length > 1 ? true : false
    }
    preparedClaims.push(cl)
  })

  const orderedClaims = arrayToObject(preparedClaims, 'category')
  return orderedClaims
}

type SingleClaim  = string | {}

interface InsideClaim {
  [key: string]: SingleClaim 
}

const flattenInnerClaim = (claim: InsideClaim, arr?: InsideClaim[]) => {
  let clArray : InsideClaim[] = []
  if (arr) { clArray = arr }
  
  Object.keys(claim).map((key) => {
    if (typeof claim[key] === 'object') { 
      flattenInnerClaim(claim[key], clArray) 
    } else {
      clArray.push({claimField: key, claimValue: claim[key]})
    }   
  })
  
  return clArray
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