import React, { createContext, useMemo, useState } from 'react'
import { useCustomContext } from '~/hooks/context'
import { IAttributeClaimFieldWithValue, IAttributeConfig } from '~/types/credentials'
import WizardBody from './WizardBody'
import WizardFooter from './WizardFooter'
import WizardForm from './WizardForm'
import WizardFormContainer from './WizardFormContainer'
import WizardHeader from './WizardHeader'

interface IWizardConfig {
  label: string
  form: IAttributeConfig
  submitLabel: string
}

export interface IWizardBodyProps {
  step: number
}

export interface IWizardFooterProps {
  onSubmit: () => void
}

export interface IWizardFormProps extends IWizardBodyProps {
  onSubmit: (fields: IAttributeClaimFieldWithValue[]) => void
}

interface IWizardContext {
  config: Record<number, IWizardConfig>
  activeStep: number
  setActiveStep: React.Dispatch<React.SetStateAction<number>>
  isLastStep: boolean
}

interface IWizardComposition {
  Header: React.FC
  Body: React.FC<IWizardBodyProps>
  Footer: React.FC<IWizardFooterProps>
  FormContainer: React.FC
  Form: React.FC<IWizardFormProps>
}

interface IWizardProps {
  config: Record<number, IWizardConfig>
}

const WizardContext = createContext<IWizardContext>({
  config: {},
  activeStep: 0,
  setActiveStep: () => { },
  isLastStep: false,
})
WizardContext.displayName = 'WizardContext'

export const useWizard = useCustomContext(WizardContext)

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
Wizard.FormContainer = WizardFormContainer
Wizard.Form = WizardForm

export default Wizard
