import { Dispatch, SetStateAction } from "react";

export interface IResponsiveCardContext {
  scaleRatio: number
  setScaleRation: Dispatch<SetStateAction<number>>
}

export interface IResponsiveCardComposition {
  Container: React.FC
  Image: React.FC<ICredentialImageProps>
  Highlight: React.FC
}

interface ICredentialImageProps {
  imageUrl: string
}