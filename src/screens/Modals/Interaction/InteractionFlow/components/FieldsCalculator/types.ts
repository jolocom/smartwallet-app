import { TextLayoutEvent } from "~/components/Card/Field";
import { IWithCustomStyle } from "~/components/Card/types";

export interface IFieldValueProps extends IWithCustomStyle {
  idx: number,
  onNumberOfFieldLinesToDisplay: (idx: number, lines: Record<number, number>) => number
}
export interface IBodyFieldsCalculatorProps {
  cbChildVisibility: (child: React.ReactNode, idx: number, lines: Record<number, number>) => React.ReactNode
}

export interface IFieldsCalculatorContext {
  lines: Record<number, number>
  onTextLayout: (e: TextLayoutEvent, idx: number) => void
}

export interface IBodyFieldsCalculatorComposition {
  FieldValue: React.FC<IFieldValueProps>
}