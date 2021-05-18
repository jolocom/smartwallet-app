import React from 'react'
import { useWizard } from './context'
import { IWizardFooterProps } from './types'
import Btn, { BtnTypes } from '../Btn'
import { Colors } from '~/utils/colors'

const WizardFooter: React.FC<IWizardFooterProps> = ({
  onSubmit,
  isDisabled,
}) => {
  const { activeStep, config } = useWizard()
  return (
    <Btn
      type={BtnTypes.senary}
      onPress={onSubmit}
      disabled={isDisabled}
      customContainerStyles={{ backgroundColor: Colors.mainBlack }}
    >
      {config[activeStep].submitLabel}
    </Btn>
  )
}

export default WizardFooter
