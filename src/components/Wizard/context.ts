import { createContext } from 'react'
import { useCustomContext } from '~/hooks/context'
import { IWizardContext } from './types'

export const WizardContext = createContext<IWizardContext | undefined>({
  config: {},
  activeStep: 0,
  setActiveStep: () => {},
  isLastStep: false,
})
WizardContext.displayName = 'WizardContext'

export const useWizard = useCustomContext(WizardContext)
