import React from 'react'

import Space from '~/components/Space'
import InteractionFooter from './components/InteractionFooter'
import InteractionDescription from './components/InteractionDescription'
import InteractionLogo from './components/InteractionLogo'
import InteractionTitle from './components/InteractionTitle'
import { ContainerBAS, LogoContainerBAS } from './components/styled'
import useAuthSubmit from '~/hooks/interactions/useAuthSubmit'
import { strings } from '~/translations'
import { useSelector } from 'react-redux'
import { getAuthenticationDetails } from '~/modules/interaction/selectors'

const Authentication = () => {
  const handleSubmit = useAuthSubmit()
  const { description } = useSelector(getAuthenticationDetails)

  return (
    <ContainerBAS>
      <LogoContainerBAS>
        <InteractionLogo />
      </LogoContainerBAS>
      <InteractionTitle label={strings.IS_IT_REALLY_YOU} />
      <InteractionDescription
        label={
          description && !!description.length
            ? description
            : strings.SERVICE_WOULD_LIKE_TO_CONFIRM_YOUR_DIGITAL_IDENTITY
        }
      />
      <Space />
      <InteractionFooter
        onSubmit={handleSubmit}
        submitLabel={strings.AUTHENTICATE}
      />
    </ContainerBAS>
  )
}

export default Authentication
