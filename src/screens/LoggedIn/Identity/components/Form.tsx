import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import FormBody from './FormBody'
import FormExpose from './FormExpose'
import FormHeader, { IFormHeaderComposition } from './FormHeader'
import { AttributeKeys, IAttributeClaimField, IAttributeClaimFieldWithValue } from '~/types/credentials'
import { useCustomContext } from '~/hooks/context'

interface IFormConfig {
  key: AttributeKeys
  fields: IAttributeClaimField[] | IAttributeClaimFieldWithValue[]
}

export interface IFormContext {
  fields: IAttributeClaimFieldWithValue[]
  updateField: (id: string, value: string) => void
  onSubmit: (collectedValues: IAttributeClaimFieldWithValue[]) => void | Promise<void>
  onCancel: (collectedValues: IAttributeClaimFieldWithValue[]) => void | Promise<void>
}

interface IFormProps
  extends Partial<Pick<IFormContext, 'onSubmit' | 'onCancel'>> {
  config: IFormConfig
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

export const useForm = useCustomContext(FormContext);

function isFieldWithValue(fields: any): fields is IAttributeClaimFieldWithValue[] {
  return fields[0].hasOwnProperty('value');
}

const getPopulatedFieldsWithValue = (config: IFormConfig) => {
  const { fields } = config;
  if (isFieldWithValue(fields)) {
    return fields
  } else {
    return fields.map(el => ({
      ...el,
      value: ''
    }))
  }
}

const Form: React.FC<IFormProps> & IFormComposition = ({
  config,
  children,
  onSubmit,
  onCancel,
}) => {
  const initialState = getPopulatedFieldsWithValue(config);

  const [state, setState] = useState(initialState);

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

  useEffect(() => {
    setState(initialState);
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
