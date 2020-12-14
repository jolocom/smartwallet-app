import React from 'react'
import { Colors } from '~/utils/colors'
import JoloText, { JoloTextKind, JoloTextWeight } from '~/components/JoloText'
import { useWizard } from '.'

const WizardHeader: React.FC = () => {
  const { activeStep, config } = useWizard()
  const btnLabel = config[activeStep].label
  return (
    <JoloText
      kind={JoloTextKind.title}
      color={Colors.white90}
      weight={JoloTextWeight.regular}
    >
      {btnLabel}
    </JoloText>
  )
}

export default WizardHeader
