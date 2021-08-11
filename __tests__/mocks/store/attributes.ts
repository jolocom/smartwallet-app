export const mockedNoAttributes = {
  account: { did: 'did-1' },
  toasts: { active: null },
  attrs: {
    all: {},
  },
}

export const mockedAttributes = {
  attrs: {
    all: {
      ProofOfEmailCredential: [
        { id: 'claimId', value: { givenName: 'Karl', familyName: 'Muller' } },
      ],
    },
  },
}

export const getMockedEmailAttribute = (
  attrId1: string,
  attrId2: string,
  email1: string,
  email2: string,
) => ({
  attrs: {
    all: {
      ProofOfEmailCredential: [
        { id: attrId1, value: { email: email1 } },
        { id: attrId2, value: { email: email2 } },
      ],
    },
  },
})
