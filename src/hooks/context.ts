import { useContext } from "react"

export const useCustomContext = <T extends any>(context: React.Context<T>) => {
  return () => {
    const customContext = useContext(context)
    if (!customContext)
      throw new Error(`Cannot be used outside of ${context.displayName}`)
    return customContext
  }
}