import React, { ReactElement } from 'react'

export const OptionalContainer: React.FC<{
  container: (children: React.ReactNode) => ReactElement<any>
  condition: boolean
}> = ({ children, container, condition }) =>
  condition ? container(children) : (children as ReactElement<any>)
