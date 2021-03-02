import { Dispatch, PropsWithChildren, SetStateAction } from "react";
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
  HolderName: React.FC
  FieldsCalculator: (props: PropsWithChildren<IFieldsCalculatorProps>) => React.ReactNode
  FieldValue: React.FC<IFieldValueProps>
  FieldPlaceholder: React.FC<IFieldPlaceholderProps>
}

interface ICredentialImageProps {
  imageUrl: string
}

export interface IFieldValueProps extends IWithCustomStyle {
  idx: number,
  onNumberOfFieldLinesToDisplay: (idx: number, fieldLines: Record<number, number>) => number
}

interface IFieldsCalculatorProps {
  cbFieldsVisibility: (child: React.ReactNode, idx: number, lines: Record<number, number>, holderNameLines: number) => React.ReactNode
}

interface IFieldPlaceholderProps {
  width: number
}
