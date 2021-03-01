import { Dispatch, SetStateAction } from "react";
import { TextLayoutEvent } from "~/components/Card/Field";
import { IWithCustomStyle } from "~/components/Card/types";

export interface IResponsiveCardContext {
  scaleRatio: number
  setScaleRation: Dispatch<SetStateAction<number>>,
  holderNameLines: number,
  setHolderNameLines: Dispatch<SetStateAction<number>>,
  fieldLines: Record<number, number>
  onFieldValueLayout: (e: TextLayoutEvent, idx: number) => void
}

export interface IResponsiveCardComposition {
  Container: React.FC
  Image: React.FC<ICredentialImageProps>
  Highlight: React.FC
  HolderName: React.FC<ICredentialHolderNameProps>
  FieldsCalculator: React.FC<IFieldsCalculatorProps>
  FieldValue: React.FC<IFieldValueProps>
}

interface ICredentialImageProps {
  imageUrl: string
}

interface ICredentialHolderNameProps {
  isTruncated: boolean
}

export interface IFieldValueProps extends IWithCustomStyle {
  idx: number,
  onNumberOfFieldLinesToDisplay: (idx: number, lines: Record<number, number>) => number
}

interface IFieldsCalculatorProps {
  cbChildVisibility: (child: React.ReactNode, idx: number, lines: Record<number, number>) => React.ReactNode
}
