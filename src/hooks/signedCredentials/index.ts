import { Agent } from "@jolocom/sdk";
import { SignedCredential } from "jolocom-lib/js/credentials/signedCredential/signedCredential";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDid } from "~/modules/account/selectors";
import { setCredentials } from "~/modules/credentials/actions";
import { useAgent } from "../sdk";
import { mapCredentialsToUI, separateCredentialsAndAttributes } from "./utils";

function* credentialsMaker (allCredentials: SignedCredential[], did: string, agent: Agent) {
  const credentials: SignedCredential[] = yield separateCredentialsAndAttributes(allCredentials, did);
  yield credentials.map((c) => mapCredentialsToUI(agent, c));
}

export const useAllCredentials = () => {
  const agent = useAgent();
  const did = useSelector(getDid);
  const dispatch = useDispatch();

  const [allCredentials, setAllCredentials] = useState<SignedCredential[]>([])
  
  //TODO: double check if this should be here
  const credentialsIter = useMemo(() => credentialsMaker(allCredentials, did, agent), [allCredentials.length]);

  const getAllCredentials = async () => {
    const allCredentials: SignedCredential[] = await agent.storage.get.verifiableCredential();
    setAllCredentials(allCredentials);
  }
  
  useEffect(() => { 
    getAllCredentials();    
  }, [])
  
  useEffect(() => {
    // TODO: add generator types
    const {value: credentials} = credentialsIter.next();
    const {value: uiCredentialsPromise} = credentialsIter.next(credentials); 
    Promise.all(uiCredentialsPromise).then(uiCredentials => {
      // TODO: setCredentials
      // console.log('* final', {uiCredentials});
      dispatch(setCredentials(uiCredentials));
    });
  }, [allCredentials.length])


  return () => {}
}