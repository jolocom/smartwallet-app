import React from 'react'
import { useForm } from '.'

const FormExpose: React.FC = ({ children }) => {
  const formContext = useForm()
  if (children && typeof children === 'function') {
    return children(formContext)
  }
  return children
}

export default FormExpose
