import { Agent } from "@jolocom/sdk";
import { CredentialType } from "@jolocom/sdk/js/credentials";
import { SignedCredential } from "jolocom-lib/js/credentials/signedCredential/signedCredential";
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
  const {type, renderInfo, issuer, credential} = await agent.storage.get.credentialMetadata(c)
  let updatedCredentials = {
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
    updatedCredentials = {...updatedCredentials, name, properties}
  }
  // @ts-expect-error - until types are corrected in sdk
  return updatedCredentials
}