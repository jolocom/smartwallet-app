import { SignedCredential } from "jolocom-lib/js/credentials/signedCredential/signedCredential";
import { useDispatch, useSelector } from "react-redux";
import { getDid } from "~/modules/account/selectors";
import { initAttrs } from "~/modules/attributes/actions";
import { setCredentials } from "~/modules/credentials/actions";
import { DisplayCredentialCustom } from "~/types/credentials";
import { useAgent } from "../sdk";
import { mapCredentialsToDisplay, mapDisplayToCustomDisplay, separateCredentialsAndAttributes, mapAttributesToDisplay } from "./utils";

export const useInitializeCredentials = () => {
  const agent = useAgent();
  const did = useSelector(getDid);
  const dispatch = useDispatch();

  const getCredentialCustomDisplay = async (credentials: SignedCredential[]): Promise<DisplayCredentialCustom[]> => {
    const displayCredentials = await Promise.all(credentials.map((c) => mapCredentialsToDisplay(agent, c)))
    return displayCredentials.map(mapDisplayToCustomDisplay);
  }

  const initializeCredentials = async () => {
    try {
      const allCredentials: SignedCredential[] = await agent.storage.get.verifiableCredential();
      const {credentials, selfIssuedCredentials} = separateCredentialsAndAttributes(allCredentials, did);
      
      const attributes = mapAttributesToDisplay(selfIssuedCredentials)
      // TODO: namings are inconsistent across modules: initAttrs vs setCredentials
      dispatch(initAttrs(attributes));
      
      const customDisplayCredentials = await getCredentialCustomDisplay(credentials);
      dispatch(setCredentials(customDisplayCredentials))    
    } catch(err) {
      console.warn('Failed getting verifiable credentials or its metadata', err)
    }
  }

  return {
    initializeCredentials,
    getCredentialCustomDisplay
  };
}