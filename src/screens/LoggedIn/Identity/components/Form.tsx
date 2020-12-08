import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react'
import FormBody from './FormBody'
import FormField from './FormField'
import FormHeader, { IFormHeaderComposition } from './FormHeader'

interface IFormProps {
  config: Record<string, string>
  onSubmit: () => void
  onCancel: () => void
}

interface IFormContext extends IFormProps {
  state: any // TODO: update types
  updateField: (name: string, value: string | number) => void
}
interface IFormComposition {
  Header: React.FC & IFormHeaderComposition
  Field: React.FC
  Body: React.FC
}

const FormContext = createContext<IFormContext | undefined>(undefined)

export const useForm = () => useContext(FormContext) // TODO: use useCustomContext instead

const reducer = (state, action) => {
  switch (action.type) {
    case 'updateField':
      const { name, value } = action.payload
      return { ...state, [name]: { ...state[name], value: value } }
  }
}

const Form: React.FC<IFormProps> & IFormComposition = ({
  config,
  children,
  onSubmit,
  onCancel,
}) => {
  const initialState = config.fields.map((el) => ({ ...el, value: '' }))

  const [state, dispatch] = useReducer(reducer, initialState)

  const updateField = useCallback(
    (name, value) => {
      dispatch({ type: 'updateField', payload: { name: config.id, value } })
    },
    [dispatch],
  )
  const contextValue = useMemo(
    () => ({
      type: config.id,
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
Form.Field = FormField
Form.Body = FormBody

export default Form
