import { useEffect, useState } from "react"
import { useInteraction } from "~/hooks/interactions"
import { IIncomingOfferDocProps, IIncomingOfferOtherProps, isIncomingOfferCard } from "../components/card/types"

// NOTE: this complexity is not necessary
function* makeDetailsIterator(details: any) {
  yield details.every((d: any) => isIncomingOfferCard(d))
}

const useGetOfferDetails = () => {
  const getInteraction = useInteraction()

  return async () => {
    const interaction = await getInteraction()
    const offerDetails = await interaction.flow.getOfferDisplay()

    const detailsIterator = makeDetailsIterator(offerDetails)
    if (detailsIterator.next().value) {
      return offerDetails
    }
    return null
  }
}

export const useOfferDetails = () => {
  const [offerDetails, setOfferDetails] = useState<
    IIncomingOfferDocProps[] | IIncomingOfferOtherProps[] | null
  >(null)
  const getOfferDetails = useGetOfferDetails()

  const handleGettingOfferDetails = async () => {
    const details = await getOfferDetails()
    setOfferDetails(details)
  }
  useEffect(() => {
    handleGettingOfferDetails()
  }, [])

  return offerDetails
}
