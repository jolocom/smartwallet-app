import { Agent } from "@jolocom/sdk";
import { CredentialType } from "@jolocom/sdk/js/credentials";
import { SignedCredential } from "jolocom-lib/js/credentials/signedCredential/signedCredential";
import { ClaimKeys } from "~/types/credentials";
import { DisplayCredential } from "./types";

export const separateCredentialsAndAttributes = (allCredentials: SignedCredential[], did: string): SignedCredential[] => {
  let selfIssuedCredentials: SignedCredential[] = [];
  let credentials: SignedCredential[] = [];
  allCredentials.map(c => {
    if(c.issuer === did) {
      selfIssuedCredentials = [...selfIssuedCredentials, c];
    } else {
      credentials = [...credentials, c];
    }
  })
  return credentials;
}

export async function mapCredentialsToUI (agent: Agent, c: SignedCredential): Promise<DisplayCredential[]> { 
  // @ts-expect-error - until types are corrected in sdk
  const {type, renderInfo, issuer, credential} = await agent.storage.get.credentialMetadata(c)
  let updatedCredentials = {
    id: c.id,
    type,
    renderInfo,
    issuer,
    name: '',
    properties: [],
  };
  if (credential) {
    const credType = new CredentialType(type, credential);
    
    const {name, display: {properties}} = credType.display(c.claim);
    // @ts-expect-error - until types are corrected in sdk

    // TODO: key and value are undefined for properties other than givenName familyName and photo
    const formattedProperties = properties.map(p => ({...p, key: p.key?.split('.')[1] ?? 'notSpecified'}));

    const holderProperties = formattedProperties.filter(p => p.key === ClaimKeys.givenName || p.key === ClaimKeys.familyName)
    const holderName = holderProperties.length ? holderProperties.reduce((acc, v) => `${acc} ${v.value}`, '') : undefined;

    const photo = formattedProperties.find(p => p.key === ClaimKeys.photo)?.value;

    updatedCredentials = {...updatedCredentials, name, properties: formattedProperties, holderName, photo}
  }
  // @ts-expect-error - until types are corrected in sdk
  return updatedCredentials
}