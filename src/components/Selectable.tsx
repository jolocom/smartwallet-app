import React, { createContext, useContext, useMemo, useState } from 'react'

type TOptionExtend = string | number

interface IContext {
  selectedValue: TOptionExtend | null
  setSelectedValue: React.Dispatch<React.SetStateAction<TOptionExtend | null>>
}

const SelectableContext = createContext<IContext>({
  selectedValue: null,
  setSelectedValue: (value: TOptionExtend | null) => {},
})

export const SelectableProvider = <T extends TOptionExtend>({
  children,
}: React.PropsWithChildren<{}>) => {
  const [selectedValue, setSelectedValue] = useState<T | null>(null)

  const contextValue = useMemo(
    () => ({
      selectedValue,
      setSelectedValue,
    }),
    [selectedValue, setSelectedValue],
  )

  return (
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
