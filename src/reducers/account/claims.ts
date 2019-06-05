import { AnyAction } from 'redux'
import {
  ClaimsState,
  CategorizedClaims,
  DecoratedClaims,
} from 'src/reducers/account'

const categorizedClaims: CategorizedClaims = {
  Personal: [
    {
      credentialType: 'Name',
      claimData: {
        givenName: '',
        familyName: '',
      },
      id: '',
      issuer: {
        did: '',
      },
      subject: '',
    },
  ],
  Contact: [
    {
      credentialType: 'Email',
      claimData: {
        email: '',
      },
      id: '',
      issuer: {
        did: '',
      },
      subject: '',
      keyboardType: 'email-address',
    },
    {
      credentialType: 'Mobile Phone',
      claimData: {
        telephone: '',
      },
      id: '',
      issuer: {
        did: '',
      },
      subject: '',
      keyboardType: 'phone-pad',
    },
    {
      credentialType: 'Postal Address',
      claimData: {
        addressLine1: '',
        addressLine2: '',
        postalCode: '',
        city: '',
        country: '',
      },
      id: '',
      issuer: {
        did: '',
      },
      subject: '',
    },
  ],
  // /** @dev FOR TESTING */
  Other: [],
}

export const initialState: ClaimsState = {
  loading: false,
  selected: {
    credentialType: '',
    claimData: {},
    id: '',
    issuer: {
      did: '',
    },
    subject: '',
  },
  pendingExternal: {
    offeror: {
      did: '',
    },
    offer: [],
  },
  decoratedCredentials: categorizedClaims,
}

export const claims = (
  state = initialState,
  action: AnyAction,
): ClaimsState => {
  switch (action.type) {
    case 'TOGGLE_CLAIMS_LOADING':
      return { ...state, loading: action.value }
    case 'SET_CLAIMS_FOR_DID':
      return { ...state, decoratedCredentials: addDefaultValues(action.claims) }
    case 'SET_EXTERNAL':
      return { ...state, pendingExternal: action.value }
    case 'RESET_EXTERNAL':
      return { ...state, pendingExternal: initialState.pendingExternal } // TODO Remove in favor of calling set external with empty array
    case 'SET_SELECTED':
      return { ...state, selected: action.selected }
    case 'RESET_SELECTED':
      return { ...state, selected: initialState.selected }
    case 'HANDLE_CLAIM_INPUT':
      return {
        ...state,
        selected: {
          ...state.selected,
          claimData: {
            ...state.selected.claimData,
            [action.fieldName]: action.fieldValue,
          },
        },
      }
    default:
      return state
  }
}

const addDefaultValues = (claims: CategorizedClaims) =>
  Object.keys(categorizedClaims).reduce(
    (acc: CategorizedClaims, category: string) => ({
      ...acc,
      [category]: injectPlaceholdersIfNeeded(category, claims[category]),
    }),
    {},
  )

const injectPlaceholdersIfNeeded = (
  category: string,
  claims: DecoratedClaims[],
): DecoratedClaims[] => {
  if (!claims || claims.length === 0) {
    return categorizedClaims[category]
  }

  const missing = categorizedClaims[category].filter(
    defaultClaim =>
      !claims.some(
        claim => claim.credentialType === defaultClaim.credentialType,
      ),
  )

  if (missing) {
    return [...missing, ...claims]
  }

  return claims
}
