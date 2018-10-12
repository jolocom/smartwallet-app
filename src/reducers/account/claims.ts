import { AnyAction } from 'redux'
import Immutable from 'immutable'
import { ClaimsState, CategorizedClaims, DecoratedClaims } from 'src/reducers/account'

const categorizedClaims: CategorizedClaims = {
  Personal: [
    {
      credentialType: 'Name',
      claimData: {
        givenName: '',
        familyName: ''
      },
      id: '',
      issuer: '',
      subject: ''
    }
  ],
  Contact: [
    {
      credentialType: 'Email',
      claimData: {
        email: ''
      },
      id: '',
      issuer: '',
      subject: ''
    },
    {
      credentialType: 'Mobile Phone',
      claimData: {
        telephone: ''
      },
      id: '',
      issuer: '',
      subject: ''
    }
  ]
}

export const initialState: ClaimsState = {
  loading: false,
  selected: {
    credentialType: '',
    claimData: {},
    id: '',
    issuer: '',
    subject: ''
  },
  decoratedCredentials: categorizedClaims
}

export const claims = (state = Immutable.fromJS(initialState), action: AnyAction): ClaimsState => {
  switch (action.type) {
    case 'SET_LOADING':
      return state.setIn(['loading'], action.loading)
    case 'SET_CLAIMS_FOR_DID':
      return state.set('decoratedCredentials', Immutable.fromJS(addDefaultValues(action.claims))).set('loading', false)
    case 'SET_SELECTED':
      return state.setIn(['selected'], Immutable.fromJS(action.selected))
    case 'HANLDE_CLAIM_INPUT':
      return state.setIn(['selected', 'claimData', action.fieldName], action.fieldValue)
    default:
      return state
  }
}

const addDefaultValues = (claims: CategorizedClaims) => {
  return Object.keys(categorizedClaims).reduce((acc: CategorizedClaims, category: string) => {
    return { ...acc, [category]: injectPlaceholdersIfNeeded(category, claims[category]) }
  }, {})
}

const injectPlaceholdersIfNeeded = (category: string, claims: DecoratedClaims[]): DecoratedClaims[] => {
  if (!claims || claims.length === 0) {
    return categorizedClaims[category]
  }

  const missing = categorizedClaims[category].filter(
    defaultClaim => !claims.some(claim => claim.credentialType === defaultClaim.credentialType)
  )

  if (missing) {
    return [...missing, ...claims]
  }

  return claims
}
