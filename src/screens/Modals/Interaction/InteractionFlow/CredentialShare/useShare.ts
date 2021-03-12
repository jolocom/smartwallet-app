import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useCredentialShareFlow } from "~/hooks/interactions/useCredentialShareFlow"
import { getAttributesToSelect } from "~/modules/interaction/selectors"

export const useSelectAttributes = () => {
  const attributesToBeSelected = useSelector(getAttributesToSelect)
  const { handleSelectCredential } = useCredentialShareFlow()
  useEffect(() => {
    handleSelectCredential(attributesToBeSelected)
  }, [JSON.stringify(attributesToBeSelected)])
}

