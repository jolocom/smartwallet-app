import { FlowType } from "@jolocom/sdk"

export const mockedInteractionCredOffer = {
  id: '123',
  flow: {
    type: FlowType.CredentialOffer,
  },
  getSummary: jest.fn().mockReturnValue({
    initiator: {
      did: 'did123',
    },
    state: {
      offerSummary: [
        {
          type: 'FirstCredential',
          renderInfo: {},
        },
      ],
    },
  }),
}

export const mockedInteractionCredShare = {
  id: '123',
  flow: {
    type: FlowType.CredentialShare,
  },
  getSummary: jest.fn().mockReturnValue({
    initiator: {
      did: 'did123',
    },
    state: {
      constraints: [
        {
          requestedCredentialTypes: [
            ['Credential', 'ProofOfEmailCredential'],
            ['Credential', 'ProofOfNameCredential'],
            ['Credential', 'DemoCred'],
          ],
        },
      ],
    },
  }),
}

export const mockedInteractionAuth = {
  id: '123',
  flow: {
    type: FlowType.Authentication,
  },
  getSummary: jest.fn().mockReturnValue({
    initiator: {
      did: 'did123',
    },
    state: {
      description: 'Is it really you ?',
    },
  }),
}

export const mockedInteractionAuthz = {
  id: '123',
  flow: {
    type: FlowType.Authorization,
  },
  getSummary: jest.fn().mockReturnValue({
    initiator: {
      did: 'did123',
    },
    state: {
      description: 'Service would like you to',
      imageURL: 'adjakjda',
      action: 'Unlock'
    },
  }),
}

export const mockedNoCredentials = {
  credentials: {
    all: [],
  },
}

export const mockedHasCredentials = {
  credentials: {
    all: [{ type: 'DemoCred' }],
  },
}