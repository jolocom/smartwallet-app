import React from 'react'
import { IWizardFooterProps, useWizard } from '.'
import Btn, { BtnTypes } from '../Btn'

const WizardFooter: React.FC<IWizardFooterProps> = ({ onSubmit, isDisabled }) => {
  const { activeStep, config } = useWizard()
  return (
    <Btn type={BtnTypes.senary} onPress={onSubmit} disabled={isDisabled}>
      {config[activeStep].submitLabel}
    </Btn>
  )
}

export default WizardFooter
