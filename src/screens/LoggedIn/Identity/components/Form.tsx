import React, {
  createContext,
  useCallback,
  useMemo,
  useState,
  useImperativeHandle,
} from 'react'
import FormBody from './FormBody'
import FormExpose from './FormExpose'
import FormHeader, { IFormHeaderComposition } from './FormHeader'
import { IAttributeClaimField } from '~/types/credentials'
import { useCustomContext } from '~/hooks/context'

export interface IFormState extends IAttributeClaimField {
  value: string
}

interface IConfig {
  id: string
  fields: IAttributeClaimField[]
}

interface IFormProps {
  config: IConfig
  onSubmit?: (collectedValues: IFormState[]) => void
  onCancel?: (collectedValues: IFormState[]) => void
}

export interface IFormContext {
  fields: IFormState[]
  updateField: (id: string, value: string) => void
  onSubmit: (collectedValues: IFormState[]) => void
  onCancel: (collectedValues: IFormState[]) => void
}

interface IFormComposition {
  Header: React.FC & IFormHeaderComposition
  Body: React.FC<{
    children: (
      _: Pick<IFormContext, 'fields' | 'updateField'>,
    ) => JSX.Element | JSX.Element[]
  }>
  Expose: React.FC
}

const FormContext = createContext<IFormContext>({
  fields: [],
  updateField: () => {},
  onSubmit: () => {},
  onCancel: () => {},
})

export const useForm = useCustomContext(FormContext)

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
    (key: string, value: string) => {
      setState((prevState) => {
        return prevState.map((field) => {
          if (field.key === key) {
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
      onSubmit: onSubmit
        ? () => onSubmit(state)
        : () => {
            console.log('Submitting with values', { state })
          },
      onCancel: onCancel
        ? () => onCancel(state)
        : () => {
            console.log('Canceling with values', { state })
          },
      updateField,
    }),
    [state, onSubmit, onCancel, updateField],
  )
  return <FormContext.Provider children={children} value={contextValue} />
}) as FormReturnType

Form.Header = FormHeader
Form.Body = FormBody
Form.Expose = FormExpose

export default Form
