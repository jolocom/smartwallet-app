import { Dispatch, SetStateAction } from "react";

export interface IResponsiveCardContext {
  scaleRatio: number
  setScaleRation: Dispatch<SetStateAction<number>>,
  holderNameLines: number,
  setHolderNameLines: Dispatch<SetStateAction<number>>,
}

export interface IResponsiveCardComposition {
  Container: React.FC
  Image: React.FC<ICredentialImageProps>
  Highlight: React.FC
  HolderName: React.FC<ICredentialHolderNameProps>
}

interface ICredentialImageProps {
  imageUrl: string
}

interface ICredentialHolderNameProps {
  isTruncated: boolean
}