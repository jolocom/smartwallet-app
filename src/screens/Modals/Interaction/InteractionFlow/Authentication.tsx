import React from 'react'
import Space from '~/components/Space'
import InteractionFooter from './components/InteractionFooter'
import InteractionDescription from './components/InteractionDescription'
import InteractionTitle from './components/InteractionTitle'
import { ContainerBAS, LogoContainerBAS } from './components/styled'
import useAuthSubmit from '~/hooks/interactions/useAuthSubmit'
import { useSelector } from 'react-redux'
import {
  getAuthenticationDetails,
  getServiceDescription,
} from '~/modules/interaction/selectors'
import useTranslation from '~/hooks/useTranslation'
import { ServiceLogo } from '~/components/ServiceLogo'

const Authentication = () => {
  const handleSubmit = useAuthSubmit()
  const { description } = useSelector(getAuthenticationDetails)
  const { name, image } = useSelector(getServiceDescription)
  const { t } = useTranslation()

  return (
    <ContainerBAS>
      <LogoContainerBAS>
        <ServiceLogo source={image} />
      </LogoContainerBAS>
      <InteractionTitle label={t('Authentication.header')} />
      <InteractionDescription
        label={
          description && !!description.length
            ? description
            : t('Authentication.subheader', { serviceName: name })
        }
      />
      <Space />
      <InteractionFooter
        onSubmit={handleSubmit}
        submitLabel={t('Authentication.confirmBtn')}
      />
    </ContainerBAS>
  )
}

export default Authentication
