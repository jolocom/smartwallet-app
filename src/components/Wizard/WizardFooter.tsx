import React from 'react'
import { IWizardFooterProps, useWizard } from '.'
import Btn, { BtnTypes } from '../Btn'

const WizardFooter: React.FC<IWizardFooterProps> = ({ onSubmit }) => {
  const { activeStep, setActiveStep, config, isLastStep } = useWizard()
  const handleSubmit = () => {
    if (!isLastStep) {
      setActiveStep((prevState) => prevState + 1)
    }
    onSubmit()
  }
  return (
    <Btn type={BtnTypes.senary} onPress={handleSubmit}>
      {config[activeStep].submitLabel}
    </Btn>
  )
}

export default WizardFooter
