import React, { createContext, useMemo, useState } from 'react'
import { useCustomContext } from '~/hooks/context'
import WizardBody from './WizardBody'
import WizardFooter from './WizardFooter'
import WizardHeader from './WizardHeader'

interface IHeader {
  label: string
}

export interface IWizardBodyProps {
  step: number
}

export interface IWizardFooterProps {
  onSubmit: () => void
}

interface IWizardContext {
  config: Record<number, IHeader>
  activeStep: number
  setActiveStep: React.Dispatch<React.SetStateAction<number>>
}

interface IWizardComposition {
  Header: React.FC
  Body: React.FC<IWizardBodyProps>
  Footer: React.FC<IWizardFooterProps>
}

interface IWizardProps {
  config: Record<number, IHeader>
}

const WizardContext = createContext<IWizardContext>({
  config: {},
  activeStep: 0,
  setActiveStep: () => {},
})
WizardContext.displayName = 'WizardContext'

export const useWizard = useCustomContext(WizardContext)

const Wizard: React.FC<IWizardProps> & IWizardComposition = ({
  children,
  config,
}) => {
  const [activeStep, setActiveStep] = useState(0)

  const contextValue = useMemo(
    () => ({
      config,
      activeStep,
      setActiveStep,
    }),
    [activeStep, setActiveStep, JSON.stringify(config)],
  )
  return <WizardContext.Provider value={contextValue} children={children} />
}

Wizard.Header = WizardHeader
Wizard.Body = WizardBody
Wizard.Footer = WizardFooter

export default Wizard
