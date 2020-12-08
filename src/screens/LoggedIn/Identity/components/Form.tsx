import React, { createContext, useContext, useMemo } from 'react'
import FormField from './FormField'
import FormHeader, { IFormHeaderComposition } from './FormHeader'

interface IFormProps {
  config: Record<string, string>
  onSubmit: () => void
  onCancel: () => void
}

interface IFormContext extends IFormProps {}
interface IFormComposition {
  Header: React.FC & IFormHeaderComposition
  Field: React.FC
}

const FormContext = createContext<IFormContext>({
  config: {},
  onCancel: () => {},
  onSubmit: () => {},
})

export const useForm = () => useContext(FormContext) // TODO: use useCustomContext instead

const Form: React.FC<IFormProps> & IFormComposition = ({
  config,
  children,
  onSubmit,
  onCancel,
}) => {
  const contextValue = useMemo(
    () => ({
      config,
      onSubmit,
      onCancel,
    }),
    [config, onSubmit],
  )
  return <FormContext.Provider children={children} value={contextValue} />
}

Form.Header = FormHeader
Form.Field = FormField

export default Form
