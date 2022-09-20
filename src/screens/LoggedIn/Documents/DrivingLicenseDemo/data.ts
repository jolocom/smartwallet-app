export const mdlMetadata = {
  type: ['VerifiableCredential', 'DrivingLicenseCredential'],
  name: 'Führerschein',
  context: [
    {
      name: 'schema:name',
      given_name: 'schema:given_name',
      family_name: 'schema:family_name',
      birth_date: 'schema:birth_date',
      document_number: 'schema:document_number',
      issuing_authority: 'schema:issuing_authority',
      expiry_date: 'schema:expiry_date',
      issue_date: 'schema:issue_date',
      issuing_country: 'schema:issuing_country',
      un_distinguishing_sign: 'schema:un_distinguishing_sign',
      driving_privileges: 'schema:driving_privileges',
      portrait: 'schema:portrait',
    },
  ],
}

export const makeMdlManifest = (did: string) => {
  return {
    type: 'DrivingLicenseCredential',
    credential: {
      schema: 'https://schemas.jolocom.io/DrivingLicenseCredential',
      name: 'Führerschein',
      display: {
        properties: [
          {
            path: ['$.given_name'],
            label: 'Vorname',
            mime_type: 'text/plain',
            preview: false,
          },
          {
            path: ['$.family_name'],
            label: 'Familienname',
            mime_type: 'text/plain',
            preview: false,
          },
          {
            path: ['$.birth_date'],
            label: 'Geburtsdatum',
            mime_type: 'text/plain',
            preview: true,
          },
          {
            path: ['$.document_number'],
            label: 'Führerscheinnummer',
            mime_type: 'text/plain',
            preview: true,
          },
          {
            path: ['$.issuing_authority'],
            label: 'Ausstellende Behörde',
            mime_type: 'text/plain',
            preview: false,
          },
          {
            path: ['$.expiry_date'],
            label: 'Gültig bis',
            mime_type: 'text/plain',
            preview: true,
          },
          {
            path: ['$.issue_date'],
            label: 'Letztes Update',
            mime_type: 'text/plain',
            preview: false,
          },
          {
            path: ['$.issuing_country'],
            label: 'Ausstellungsland',
            mime_type: 'text/plain',
            preview: true,
          },
          {
            path: ['$.un_distinguishing_sign'],
            label: 'Länderkennzeichen',
            mime_type: 'text/plain',
            preview: false,
          },
          {
            path: ['$.driving_privileges'],
            label: 'Führerscheinrechte',
            mime_type: 'text/plain',
            preview: false,
          },
          {
            path: ['$.portrait'],
            label: 'Portrait',
            mime_type: 'image/png',
            preview: false,
          },
        ],
      },
      styles: {
        thumbnail: {
          uri: 'https://cdn.icon-icons.com/icons2/1694/PNG/512/eueuropeanunionflag_111740.png',
          alt: '',
        },
        hero: {
          uri: 'https://www.esa.int/var/esa/storage/images/esa_multimedia/images/2014/11/german_flag/15079489-2-eng-GB/German_flag_pillars.png',
          alt: '',
        },
        background: {
          image_url: {
            uri: 'https://i.ibb.co/p1Zz70C/istockphoto-1072694792-612x612.jpg',
            alt: '',
          },
        },
        text: {
          color: '',
        },
      },
    },
    issuer: {
      did: did,
      publicProfile: {
        name: 'Jolocom',
        description:
          'Jolocom is a decentralized identity platform that enables users to own and control their own digital identity.',
        image:
          'https://cloudsignatureconsortium.org/wp-content/uploads/2019/11/Logo_300dpi-300x160-1.png',
        url: 'https://jolocom.io',
      },
    },
  }
}
