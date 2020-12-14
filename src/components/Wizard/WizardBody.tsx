import React from 'react'
import { IWizardBodyProps, useWizard } from '.'

const WizardBody: React.FC<IWizardBodyProps> = ({ step, children }) => {
  const { activeStep } = useWizard()
  if (activeStep !== step) return null
  return children
}

export default WizardBody
