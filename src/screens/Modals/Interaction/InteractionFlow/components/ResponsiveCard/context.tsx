import { createContext } from "react";
import { useCustomContext } from "~/hooks/context";
import { IResponsiveCardContext } from "./types";

export const ResponsiveCardContext = createContext<IResponsiveCardContext | undefined>(undefined);
ResponsiveCardContext.displayName = 'ResponsiveCardContext';

export const useResponsiveCard = useCustomContext(ResponsiveCardContext);