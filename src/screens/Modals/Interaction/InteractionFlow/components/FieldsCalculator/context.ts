import { createContext } from "react";
import { useCustomContext } from "~/hooks/context";
import { IFieldsCalculatorContext } from "./types";

export const FieldsCalculatorContext = createContext<IFieldsCalculatorContext | undefined>(undefined);
FieldsCalculatorContext.displayName = 'FieldsCalculatorContext';

export const useFieldCalculator = useCustomContext(FieldsCalculatorContext);
