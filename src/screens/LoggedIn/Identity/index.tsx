import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import ScreenContainer from '~/components/ScreenContainer'
import ToggleSwitch from '~/components/ToggleSwitch'
import BusinessCardWizard from '~/components/Wizard/BusinessCardWizard'
import { getAttributes } from '~/modules/attributes/selectors'

const Identity = () => {
  const attributes = useSelector(getAttributes)
  const [isWizardVisible, setWizardVisibility] = useState(true)
  const toggleWizardVisibility = () => {
    setWizardVisibility((prevState) => !prevState)
  }
  return (
    <ScreenContainer>
      <ToggleSwitch on={isWizardVisible} onToggle={toggleWizardVisibility} />
      {isWizardVisible && <BusinessCardWizard />}
    </ScreenContainer>
  )
}

export default Identity
