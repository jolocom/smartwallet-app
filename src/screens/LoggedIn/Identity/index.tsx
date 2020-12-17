import React, { useState } from 'react'

import ScreenContainer from '~/components/ScreenContainer'
import ToggleSwitch from '~/components/ToggleSwitch'
import BusinessCardWizard from '~/components/Wizard/BusinessCardWizard'

const Identity = () => {
  const [isWizardVisible, setWizardVisibility] = useState(true)
  const toggleWizardVisibility = () => {
    setWizardVisibility((prevState) => !prevState)
  }
  return (
    <ScreenContainer>
      <ToggleSwitch on={isWizardVisible} onToggle={toggleWizardVisibility} />
      {isWizardVisible && <BusinessCardWizard />}
      {/* {isWizardVisible && <SingleCredentialWizard />} */}
    </ScreenContainer>
  )
}

export default Identity
