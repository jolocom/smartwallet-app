import { Agent } from "@jolocom/sdk";
import { CredentialType } from "@jolocom/sdk/js/credentials";
import { SignedCredential } from "jolocom-lib/js/credentials/signedCredential/signedCredential";
import { AttributeI, AttrsState } from "~/modules/attributes/types";
import { AttributeTypes, BaseUICredential, ClaimKeys, DisplayCredential, DisplayCredentialDocument, DisplayCredentialOther, isDocument, OtherCategory } from "~/types/credentials";
import { extractClaims, extractCredentialType } from "~/utils/dataMapping";

type CredentialKeys = 'credentials' | 'selfIssuedCredentials';

export const separateCredentialsAndAttributes = (allCredentials: SignedCredential[], did: string): Record<CredentialKeys, SignedCredential[]> => {
  let selfIssuedCredentials: SignedCredential[] = [];
  let credentials: SignedCredential[] = [];
  allCredentials.map(c => {
    if(c.issuer === did) {
      selfIssuedCredentials = [...selfIssuedCredentials, c];
    } else {
      credentials = [...credentials, c];
    }
  })
  return {credentials, selfIssuedCredentials};
}


function mapToBaseUICredential(c: SignedCredential): BaseUICredential {
  const {id, issuer, issued, type, expires, subject, name} = c;
  return {
    id,
    issuer,
    issued,
    type,
    expires,
    subject,
    name
  }
}

export async function mapCredentialsToDisplay (agent: Agent, c: SignedCredential): Promise<DisplayCredential> { 
  const metadata = await agent.storage.get.credentialMetadata(c)
  // @ts-expect-error - until types are corrected in sdk
  const {type, renderInfo, credential} = metadata;
  const baseUICredentials = mapToBaseUICredential(c);
  let updatedCredentials: DisplayCredential = {
    ...baseUICredentials,
    category: renderInfo?.renderAs ?? OtherCategory.other,
    properties: [],
  };
  
  if (credential) {
    const credType = new CredentialType(type, credential);
    const {name, display: {properties}} = credType.display(c.claim);
    updatedCredentials = {...updatedCredentials, name, properties};
  }
  return updatedCredentials
}

// TODO: this is so imperative
export function mapDisplayToCustomDisplay (credential: DisplayCredential): DisplayCredentialDocument | DisplayCredentialOther {
  const {properties} = credential;
  let formattedProperties = properties.map(p => ({...p, key: p.key?.split('.')[1] ?? 'notSpecified'}));
  
  const photo = formattedProperties.find(p => p.key === ClaimKeys.photo)?.value;
  formattedProperties = formattedProperties.filter(p => p.key !== ClaimKeys.photo);

  if(isDocument(credential)) {
    const holderProperties = formattedProperties.filter(p => p.key === ClaimKeys.givenName || p.key === ClaimKeys.familyName)
    // TODO: fix spaces issue
    const holderName = holderProperties.length ? holderProperties.reduce((acc, v) => `${v.value} ${acc}`, '') : 'Anonymous'; 
    formattedProperties = formattedProperties.filter(p => p.key !== ClaimKeys.givenName && p.key !== ClaimKeys.familyName);
    return {...credential, properties: formattedProperties, holderName, photo, highlight: credential.id};
  }
  return {...credential, properties: formattedProperties, photo}
}

export function mapAttributesToDisplay (credentials: SignedCredential[]): AttrsState<AttributeI> {
  return credentials.reduce((acc, cred) => {
      const type = extractCredentialType(cred) as AttributeTypes
      const entry = { id: cred.id, value: extractClaims(cred.claim) }
      const prevEntries = acc[type]

      acc[type] = prevEntries ? [...prevEntries, entry] : [entry]
      return acc
  }, {} as AttrsState<AttributeI>)
}

