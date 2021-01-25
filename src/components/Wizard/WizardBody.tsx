import React from 'react'
import { View } from 'react-native'

import { IWizardBodyProps, useWizard } from '.'

const WizardBody: React.FC<IWizardBodyProps> = ({ step, children }) => {
  const { activeStep } = useWizard()
  if (activeStep !== step) return null
  return <View>{children}</View>
}

export default WizardBody
