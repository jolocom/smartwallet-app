export enum Categories {
  Personal,
  Contact,
  Other
}

export const categoryUIDefinition: {[key: string] : string[][]} = {
  'Contact': [
    ['Credential', 'ProofOfEmailCredential'],
    ['Credential', 'ProofOfMobilePhoneNumberCredential'],
  ],
  'Personal': [
    ['Credential', 'ProofOfNameCredential'],
  ]
}
