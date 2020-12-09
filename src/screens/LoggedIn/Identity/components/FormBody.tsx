import React from 'react'
import { useForm } from './Form'

const FormBody: React.FC = ({ children }) => {
  const formContext = useForm()
  const { fields, updateField } = formContext
  if (typeof children === 'function') {
    return children({ fields, updateField })
  }
  return children
}

export default FormBody
