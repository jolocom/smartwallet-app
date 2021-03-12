import { Agent } from "@jolocom/sdk";
import { SignedCredential } from "jolocom-lib/js/credentials/signedCredential/signedCredential";
import { useDispatch, useSelector } from "react-redux";
import { getDid } from "~/modules/account/selectors";
import { setCredentials } from "~/modules/credentials/actions";
import { useAgent } from "../sdk";
import { mapCredentialsToUI, separateCredentialsAndAttributes } from "./utils";

async function* credentialsMaker (did: string, agent: Agent) {
  const allCredentials: SignedCredential[] = await agent.storage.get.verifiableCredential();
  const serviceIssuedCredentials: SignedCredential[] = yield separateCredentialsAndAttributes(allCredentials, did);
  return yield Promise.all(serviceIssuedCredentials.map((c) => mapCredentialsToUI(agent, c)));
}

export const useAllCredentials = () => {
  const agent = useAgent();
  const did = useSelector(getDid);
  const dispatch = useDispatch();
  const credentialsIter = credentialsMaker(did, agent);
    
  return async () => {    
    let isComplete = false;
    let value = undefined;
    while(!isComplete) {
      const {value: iterReturn, done} = await credentialsIter.next(value);
      isComplete = !!done;
      value = iterReturn
    }
    dispatch(setCredentials(value));
  }
}