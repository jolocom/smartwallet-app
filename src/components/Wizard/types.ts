import React from 'react'
import { ObjectSchema, StringSchema } from 'yup'
import { ClaimKeys, IAttributeConfig } from '~/types/credentials'

export interface IWizardConfig {
  label: string
  form: IAttributeConfig
  submitLabel: string
  validationSchema: ObjectSchema<Record<ClaimKeys, StringSchema>>
}

export interface IWizardBodyProps {
  step: number
}

export interface IWizardFooterProps {
  onSubmit: () => void
  isDisabled: boolean
}

export interface IWizardFormProps extends IWizardBodyProps {
  onSubmit: (fields: Record<string, string>) => Promise<void> | void
}

export interface IWizardContext {
  config: Record<number, IWizardConfig>
  activeStep: number
  setActiveStep: React.Dispatch<React.SetStateAction<number>>
  isLastStep: boolean
}

export interface IWizardComposition {
  Header: React.FC
  Body: React.FC<IWizardBodyProps>
  Footer: React.FC<IWizardFooterProps>
  Form: React.FC<IWizardFormProps>
}

export interface IWizardProps {
  config: Record<number, IWizardConfig>
}
