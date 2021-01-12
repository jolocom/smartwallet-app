import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import FormBody from './FormBody'
import FormExpose from './FormExpose'
import FormHeader, { IFormHeaderComposition } from './FormHeader'
import { IAttributeClaimField, IAttributeConfig } from '~/types/credentials'
import { useCustomContext } from '~/hooks/context'

export interface IFormState extends IAttributeClaimField {
  value: string
}

type TFormConfig = Pick<IAttributeConfig, 'key' | 'fields'>

export interface IFormContext {
  fields: IFormState[]
  updateField: (id: string, value: string) => void
  onSubmit: (collectedValues: IFormState[]) => void | Promise<void>
  onCancel: (collectedValues: IFormState[]) => void | Promise<void>
}

interface IFormProps
  extends Partial<Pick<IFormContext, 'onSubmit' | 'onCancel'>> {
  config: TFormConfig
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
  updateField: () => { },
  onSubmit: () => { },
  onCancel: () => { },
})

// TODO: take care of types
export const useForm = useCustomContext(FormContext)

const Form: React.FC<IFormProps> & IFormComposition = ({
  config,
  children,
  onSubmit,
  onCancel,
}) => {
  const initialState = config.fields.map((el) => ({
    ...el,
    // TODO: add optional value property to a field object
    value: el.value || '',
  }))

  const [state, setState] = useState(initialState)

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

  // TODO: dirty you are
  useEffect(() => {
    setState(config.fields.map((el) => ({
      ...el,
      // TODO: add optional value property to a field object
      value: el.value || '',
    })))
  }, [JSON.stringify(config)])

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
}

Form.Header = FormHeader
Form.Body = FormBody
Form.Expose = FormExpose

export default Form
