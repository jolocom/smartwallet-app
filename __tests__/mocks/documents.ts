export const mockedDocuments = {
  documents: [
    {
      id: 'abscbajhfjdhfjdshfsdjhfa',
      type: 'document',
      claim: {
        id: 'id1',
        message: 'message1',
      },
      metadata: {
        name: 'Document 1',
      },
      issuer: {
        did: 'did:jun:example',
      },
    },
    {
      id: 'dsfjsjdfjhdfasjdhfasdhjfajsdhf',
      type: 'document 2',
      claim: {
        id: 'id2',
        message: 'message2',
      },
      metadata: {
        name: 'Document 2',
      },
      issuer: {
        did: 'did:jun:example',
        publicProfile: {
          name: 'Issuer name',
          description: 'I am the issuer',
        },
      },
    },
  ],
  other: [
    {
      id: 'adfdjfahdfahdfajsdhf dfye',
      type: 'other',
      claim: {
        id: 'id3',
        message: 'message3',
      },
      metadata: {
        name: 'Document 3',
      },
      issuer: {
        did: 'did:jun:example',
        publicProfile: {
          name: 'Issuer name',
          description: 'I am the issuer',
        },
      },
    },
  ],
}

export const mockedFields = [
  {
    id: 1,
    type: 'document',
    details: {
      mandatoryFields: [
        { label: 'givenName', value: 'Test Given Name' },
        { label: 'Document Name', value: 'some doc' },
      ],
      optionalFields: [{ label: 'c', value: 'd' }],
    },
  },
  {
    id: 2,
    type: 'other',
    details: {
      mandatoryFields: [{ label: 'givenName', value: 'f' }],
      optionalFields: [{ label: 'g', value: 'h' }],
    },
  },
]