import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { KeyboardTypeOptions } from 'react-native'
import FormBody from './FormBody'
import FormHeader, { IFormHeaderComposition } from './FormHeader'

interface IFieldConfig {
  id: string
  placeholder: string
  keyboardType: KeyboardTypeOptions
}

interface IState extends IFieldConfig {
  value: string
}

interface IConfig {
  id: string
  fields: IFieldConfig[]
}

interface IFormProps {
  config: IConfig
  onSubmit: () => void
  onCancel: () => void
}

export interface IFormContext
  extends Pick<IFormProps, 'onSubmit' | 'onCancel'> {
  fields: IState[]
  updateField: (id: string, value: string) => void
}

interface IFormComposition {
  Header: React.FC & IFormHeaderComposition
  Body: React.FC
}

const FormContext = createContext<IFormContext>({
  fields: [],
  onSubmit: () => {},
  onCancel: () => {},
  updateField: () => {},
})

export const useForm = () => useContext(FormContext) // TODO: use useCustomContext instead

const Form: React.FC<IFormProps> & IFormComposition = ({
  config,
  children,
  onSubmit,
  onCancel,
}) => {
  const initialState = config.fields.map((el) => ({ ...el, value: '' }))

  const [state, setState] = useState(initialState)

  const updateField = useCallback(
    (id: string, value: string) => {
      setState((prevState) => {
        return prevState.map((field) => {
          if (field.id === id) {
            return { ...field, value }
          }
          return field
        })
      })
    },
    [setState],
  )

  const contextValue = useMemo(
    () => ({
      fields: state,
      onSubmit,
      onCancel,
      updateField,
    }),
    [state, onSubmit, onCancel, updateField],
  )
  return <FormContext.Provider children={children} value={contextValue} />
}

Form.Header = FormHeader
Form.Body = FormBody

export default Form
