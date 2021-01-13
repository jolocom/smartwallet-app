import { useContext } from 'react'

export const useCustomContext = <T>(context: React.Context<T>) => {
  return () => {
    const customContext = useContext(context)
    if (customContext) return customContext

    throw new Error(`Cannot be used outside of ${context.displayName}`)
  }
}
