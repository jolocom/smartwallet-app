import React, { createContext, useContext, useMemo, useState } from 'react'

export type TOptionExtend = string | number

export interface IOption<T> {
  id: string
  value: T
}

interface IContext<T> {
  options: IOption<T>[]
  selectedValue: IOption<T> | null
  setSelectedValue: React.Dispatch<React.SetStateAction<IOption<T> | null>>
  onSelect: (val: IOption<T>) => void
}

const SelectableContext = createContext<IContext<string | number> | undefined>(
  undefined,
)

export const SelectableProvider = <T extends TOptionExtend>({
  options,
  onSelect,
  children,
}: React.PropsWithChildren<{
  options: IOption<T>[]
  onSelect: (val: IOption<T>) => void
}>) => {
  const [selectedValue, setSelectedValue] = useState<IOption<T> | null>(null)

  const contextValue: IContext<T> = useMemo<IContext<T>>(
    () => ({
      options,
      selectedValue,
      setSelectedValue,
      onSelect,
    }),
    [selectedValue, setSelectedValue],
  )

  return (
    //@ts-ignore
    <SelectableContext.Provider value={contextValue}>
      {children}
    </SelectableContext.Provider>
  )
}

export const useSelectableState = () => {
  const context = useContext(SelectableContext)
  if (!context)
    throw new Error('This component must be used inside SelecatbleProvider')
  return context
}
