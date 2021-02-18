import React, { useMemo, useState } from 'react'
import WizardBody from './WizardBody'
import WizardFooter from './WizardFooter'
import WizardForm from './WizardForm'
import WizardHeader from './WizardHeader'
import { IWizardProps, IWizardComposition } from './types'
import { WizardContext } from './context'

const Wizard: React.FC<IWizardProps> & IWizardComposition = ({
  children,
  config,
}) => {
  const [activeStep, setActiveStep] = useState(0)
  const isLastStep = Object.keys(config).length - 1 === activeStep

  const contextValue = useMemo(
    () => ({
      config,
      activeStep,
      setActiveStep,
      isLastStep,
    }),
    [activeStep, setActiveStep, JSON.stringify(config)],
  )
  return <WizardContext.Provider value={contextValue} children={children} />
}

Wizard.Header = WizardHeader
Wizard.Body = WizardBody
Wizard.Footer = WizardFooter
Wizard.Form = WizardForm

export default Wizard
