import React from 'react'
import { strings } from '~/translations'
import { IWizardFooterProps, useWizard } from '.'
import Btn, { BtnTypes } from '../Btn'

const WizardFooter: React.FC<IWizardFooterProps> = ({ onSubmit }) => {
  const {
    activeStep,
    setActiveStep,
    config,
    submitLabel,
    isLastStep,
  } = useWizard()
  const btnLabel = !isLastStep
    ? strings.NEXT
    : submitLabel
    ? submitLabel
    : strings.DONE
  const handleSubmit = () => {
    if (!isLastStep) {
      setActiveStep((prevState) => prevState + 1)
    }
    onSubmit()
  }
  return (
    <Btn type={BtnTypes.senary} onPress={handleSubmit}>
      {btnLabel}
    </Btn>
  )
}

export default WizardFooter
