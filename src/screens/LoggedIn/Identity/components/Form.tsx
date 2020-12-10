import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useImperativeHandle,
} from 'react'
import FormBody from './FormBody'
import FormHeader, { IFormHeaderComposition } from './FormHeader'
import { ClaimKeys } from '~/types/credentials'

interface IConfigField {
  id: ClaimKeys
  placeholder: string
  keyboardType: string
}

export interface IFormState extends IConfigField {
  value: string
}

interface IConfig {
  id: string
  fields: IConfigField[]
}

interface IFormProps {
  config: IConfig
  onSubmit?: () => void
  onCancel?: () => void
}

export interface IFormContext
  extends Pick<IFormProps, 'onSubmit' | 'onCancel'> {
  fields: IFormState[]
  updateField: (id: string, value: string) => void
}

interface IFormComposition {
  Header: React.FC & IFormHeaderComposition
  Body: React.FC<{
    children: (
      _: Pick<IFormContext, 'fields' | 'updateField'>,
    ) => JSX.Element | JSX.Element[]
  }>
}

const FormContext = createContext<IFormContext>({
  fields: [],
  onSubmit: () => {},
  onCancel: () => {},
  updateField: () => {},
})

export const useForm = () => useContext(FormContext) // TODO: use useCustomContext instead

type FormReturnType = React.ForwardRefExoticComponent<
  React.PropsWithChildren<IFormProps> &
    React.RefAttributes<{ state: IFormState[] }>
> &
  IFormComposition

const Form = React.forwardRef<
  { state: IFormState[] },
  React.PropsWithChildren<IFormProps>
>(({ config, children, onSubmit, onCancel }, ref) => {
  const initialState = config.fields.map((el) => ({ ...el, value: '' }))

  const [state, setState] = useState(initialState)

  useImperativeHandle(ref, () => ({
    state,
  }))

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
}) as FormReturnType

Form.Header = FormHeader
Form.Body = FormBody

export default Form
