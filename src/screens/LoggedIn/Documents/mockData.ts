import { CredentialCategories, DocumentFields } from '~/types/credentials'

export const DOCUMENTS = [
  {
    id: 1,
    type: CredentialCategories.document,
    details: {
      mandatoryFields: [
        {
          name: DocumentFields.DocumentName,
          value: 'Nederlandse identitekaart',
        },
        {
          name: 'Given Name',
          value: 'De Bruijn Willeke Liselotte',
        },
      ],
      optionalFields: [
        { name: 'Date of birth', value: Date.now() },
        {
          name: 'Nationality',
          value: 'Dutch',
        },
        { name: 'Date of expiry', value: Date.now() },
      ],
      highlight: 'SPECI2014',
      photo:
        'https://i.pinimg.com/564x/64/4d/dc/644ddca56c43e4b01af5aec27e010feb.jpg',
    },
  },
  {
    id: 2,
    type: CredentialCategories.document,
    details: {
      mandatoryFields: [
        {
          name: DocumentFields.DocumentName,
          value:
            'Nederlandse identitekaart Nederlandse identitekaart Nederlandse identitekaart',
        },
        {
          name: 'Given Name',
          value:
            'Adolph Blaine Charles David Earl Frederick Gerald Hubert Irvin Gerald Hubert Irvin',
        },
      ],
      optionalFields: [
        {
          name: 'Extra long description of the input',
          value:
            'Information that should be previewed here Information that should be previewed here',
        },
        {
          name:
            'Some more info that can fit in here and if it is not going over two lines agreed previou',
          value:
            'Some more info that can fit in here and if it is not going over two lines agreed previou over two lines agreed previou',
        },
        {
          name: 'Extra long description of the input',
          value:
            'Information that should be previewed here Information that should be previewed here',
        },
      ],
      //highlight: 'SPECI2014',
      photo:
        'https://i.pinimg.com/564x/64/4d/dc/644ddca56c43e4b01af5aec27e010feb.jpg',
    },
  },
  {
    id: 3,
    type: CredentialCategories.document,
    details: {
      mandatoryFields: [
        {
          name: DocumentFields.DocumentName,
          value: 'Nederlandse identitekaart',
        },
        {
          name: 'Given Name',
          value: 'De Bruijn Willeke Liselotte',
        },
      ],
      optionalFields: [
        {
          name: 'Extra long description of the input',
          value:
            'Information that should be previewed here Information that should be previewed here',
        },
        {
          name:
            'Some more info that can fit in here and if it is not going over two lines agreed previou',
          value:
            'Some more info that can fit in here and if it is not going over two lines agreed previou over two lines agreed previou',
        },
        {
          name: 'Extra long description of the input',
          value:
            'Information that should be previewed here Information that should be previewed here',
        },
      ],
    },
  },
]

export const OTHER = [
  {
    id: 4,
    type: CredentialCategories.other,
    details: {
      mandatoryFields: [
        { name: DocumentFields.DocumentName, value: 'Name of the event' },
      ],
      optionalFields: [
        {
          name: 'Extra long description of the input',
          value: 'Information that should be previewed here',
        },
        {
          name:
            'Some more info that can fit in here and if it is not going over two lines agreed previou',
          value: 'Information that should be',
        },
        {
          name: 'Extra long description of the input',
          value: 'Information',
        },
      ],
      logo:
        'https://i.pinimg.com/564x/db/3f/9b/db3f9bce5262323d79cc020950db08bc.jpg',
    },
  },
  {
    id: 5,
    type: CredentialCategories.other,
    details: {
      mandatoryFields: [{ name: DocumentFields.DocumentName, value: 'Name' }],
      optionalFields: [
        {
          name: 'Title',
          value: 'Info',
        },
        {
          name: 'Title',
          value: 'Information that should bу probably previewed here or not',
        },
      ],
    },
  },
  {
    id: 6,
    type: CredentialCategories.other,
    details: {
      mandatoryFields: [
        {
          name: DocumentFields.DocumentName,
          value:
            'Systemischer Agile Coach - Infos zu unserer Weiterbildung Systemischer Agile Coach - Infos zu unserer Weiterbildung',
        },
      ],
      optionalFields: [
        {
          name: 'Extra long description of the input',
          value: 'Information that should be previewed here',
        },
        {
          name: 'Extra long description of the input',
          value: 'Information that should be previewed here',
        },
        {
          name: 'Extra long description of the input',
          value: 'Information that should be previewed here',
        },
      ],
      logo:
        'https://i.pinimg.com/564x/db/3f/9b/db3f9bce5262323d79cc020950db08bc.jpg',
    },
  },
]
