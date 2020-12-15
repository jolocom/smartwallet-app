import React, { createContext, useMemo, useState } from 'react'
import { useCustomContext } from '~/hooks/context'
import { IFormState } from '~/screens/LoggedIn/Identity/components/Form'
import { IAttributeConfig } from '~/types/credentials'
import WizardBody from './WizardBody'
import WizardFooter from './WizardFooter'
import WizardForm from './WizardForm'
import WizardFormContainer from './WizardFormContainer'
import WizardHeader from './WizardHeader'

interface IWizardConfig {
  label: string
  form: IAttributeConfig
}

export interface IWizardBodyProps {
  step: number
}

export interface IWizardFooterProps {
  onSubmit: () => void
}

export interface IWizardFormProps extends IWizardBodyProps {
  onSubmit: (fields: IFormState[]) => void
}

interface IWizardContext {
  config: Record<number, IWizardConfig>
  activeStep: number
  setActiveStep: React.Dispatch<React.SetStateAction<number>>
  submitLabel?: string
}

interface IWizardComposition {
  Header: React.FC
  Body: React.FC<IWizardBodyProps>
  Footer: React.FC<IWizardFooterProps>
  FormContainer: React.FC
  Form: React.FC<IWizardFormProps>
}

interface IWizardProps {
  submitLabel?: string
  config: Record<number, IWizardConfig>
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
  submitLabel,
}) => {
  const [activeStep, setActiveStep] = useState(0)

  const contextValue = useMemo(
    () => ({
      config,
      submitLabel,
      activeStep,
      setActiveStep,
    }),
    [activeStep, setActiveStep, JSON.stringify(config), submitLabel],
  )
  return <WizardContext.Provider value={contextValue} children={children} />
}

Wizard.Header = WizardHeader
Wizard.Body = WizardBody
Wizard.Footer = WizardFooter
Wizard.FormContainer = WizardFormContainer
Wizard.Form = WizardForm

export default Wizard
