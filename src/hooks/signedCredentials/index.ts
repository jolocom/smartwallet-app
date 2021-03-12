import { Agent } from "@jolocom/sdk";
import { SignedCredential } from "jolocom-lib/js/credentials/signedCredential/signedCredential";
import { useDispatch, useSelector } from "react-redux";
import { getDid } from "~/modules/account/selectors";
import { setCredentials } from "~/modules/credentials/actions";
import { useAgent } from "../sdk";
import { mapCredentialsToUI, separateCredentialsAndAttributes } from "./utils";

async function* credentialsMaker (did: string, agent: Agent) {
  const allCredentials = await agent.storage.get.verifiableCredential();
  const credentials: SignedCredential[] = yield separateCredentialsAndAttributes(allCredentials, did);
  yield Promise.all(credentials.map((c) => mapCredentialsToUI(agent, c)));
}

export const useAllCredentials = () => {
  const agent = useAgent();
  const did = useSelector(getDid);
  const dispatch = useDispatch();
  const credentialsIter = credentialsMaker(did, agent);
    
  return async () => {    
    const {value: credentials} = await credentialsIter.next();
    const {value: uiCredentials} = await credentialsIter.next(credentials);
    dispatch(setCredentials(uiCredentials));
  }
}