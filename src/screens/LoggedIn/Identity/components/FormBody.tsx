import React, { useRef } from 'react'
import { TextInput } from 'react-native'
import { useForm } from './Form'

const FormBody: React.FC = ({ children }) => {
  const formContext = useForm()

  const inputs = useRef<TextInput[]>([])

  if (children && typeof children === 'function') {
    return React.Children.map(children(formContext), (child, idx) => {
      return React.cloneElement(child, {
        onSubmitEditing: () => {
          if (inputs.current[idx + 1]) {
            inputs.current[idx + 1].focus()
          } else {
            formContext.onSubmit(formContext.fields)
          }
        },
        blurOnSubmit: !Boolean(inputs.current[idx + 1]),
        ref: (ref: TextInput) => (inputs.current[idx] = ref),
      })
    })
  }
  return children
}

export default FormBody
