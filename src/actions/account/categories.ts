export enum Categories {
  Personal,
  Contact
}

export const categoryForType: {[key: string] : string[][]} = {
  'Contact': [
    ['Credential', 'ProofOfEmailCredential'],
    ['Credential', 'ProofOfMobilePhoneNumberCredential'],
  ],
  'Personal': [
    ['Credential', 'ProofOfNameCredential'],
  ]
}
