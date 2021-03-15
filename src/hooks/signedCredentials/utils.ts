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
  const metadata = await agent.storage.get.credentialMetadata(c)
  // @ts-expect-error - until types are corrected in sdk
  const {type, renderInfo, issuer, credential} = metadata;
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
    let formattedProperties = properties.map(p => ({...p, key: p.key?.split('.')[1] ?? 'notSpecified'}));

    // @ts-expect-error - until types are corrected in sdk
    const holderProperties = formattedProperties.filter(p => p.key === ClaimKeys.givenName || p.key === ClaimKeys.familyName)
    // @ts-expect-error - until types are corrected in sdk
    const holderName = holderProperties.length ? holderProperties.reduce((acc, v) => `${v.value} ${acc}`, '') : undefined; // TODO: fix spaces issue
    // @ts-expect-error - until types are corrected in sdk
    formattedProperties = formattedProperties.filter(p => p.key !== ClaimKeys.givenName && p.key !== ClaimKeys.familyName);
    
    
    // @ts-expect-error - until types are corrected in sdk
    const photo = formattedProperties.find(p => p.key === ClaimKeys.photo)?.value;
    // @ts-expect-error - until types are corrected in sdk
    formattedProperties = formattedProperties.filter(p => p.key !== ClaimKeys.photo);
    
    // @ts-expect-error - until types are corrected in sdk
    updatedCredentials = {...updatedCredentials, name, properties: formattedProperties, holderName, photo};
  }
  // @ts-expect-error - until types are corrected in sdk
  return updatedCredentials
}