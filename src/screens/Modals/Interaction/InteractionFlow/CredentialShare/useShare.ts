import { CredentialType } from "@jolocom/sdk/js/credentials"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useCredentialShareFlow } from "~/hooks/interactions/useCredentialShareFlow"
import { useAgent } from "~/hooks/sdk"
import { getAttributesToSelect } from "~/modules/interaction/selectors"
import { IIncomingRequestDocCardProps, IIncomingRequestOtherProps } from "../components/card/types"

export const useSelectAttributes = () => {
  const attributesToBeSelected = useSelector(getAttributesToSelect)
  const { handleSelectCredential } = useCredentialShareFlow()
  useEffect(() => {
    handleSelectCredential(attributesToBeSelected)
  }, [JSON.stringify(attributesToBeSelected)])
}

export const useShareDetails = (credentials: SignedCredential[]) => {
  const agent = useAgent()
  const [shareCredDetails, setShareCredDetails] = useState<
    IIncomingRequestDocCardProps[] | IIncomingRequestOtherProps[]
  >(null)

  const getShareDisplay = () => {
    credentials.forEach(async (c) => {
      const metadata = await agent.storage.get.credentialMetadata(c)
      if (metadata.credential) {
        const credType = new CredentialType(metadata.type, metadata.credential)
        const displayVal = credType.display(c.claim)
        setShareCredDetails(displayVal)
      }
    })
  }

  useEffect(() => {
    getShareDisplay()
  }, [])

  return shareCredDetails
}

