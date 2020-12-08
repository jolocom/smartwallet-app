import React from 'react'
import { useForm } from './Form'

const FormBody: React.FC = ({ children }) => {
  const { fields, updateField, type } = useForm()
  if (typeof children === 'function') {
    return children({ fields, updateField, type })
  }
  return children
}

export default FormBody
