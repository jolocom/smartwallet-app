import React from 'react'
import InteractionFooter from './components/InteractionFooter'
import InteractionDescription from './components/InteractionDescription'
import InteractionTitle from './components/InteractionTitle'
import { ContainerBAS, LogoContainerBAS } from './components/styled'
import InteractionImage from './components/InteractionAuthzImage'
import useAuthzSubmit from '~/hooks/interactions/useAuthzSubmit'
import { useSelector } from 'react-redux'
import {
  getAuthzUIDetails,
  getServiceDescription,
} from '~/modules/interaction/selectors'
import { truncateFirstWord, capitalizeWord } from '~/utils/stringUtils'
import useTranslation from '~/hooks/useTranslation'
import Space from '~/components/Space'
import { ServiceLogo } from '~/components/ServiceLogo'

const Authorization = () => {
  const {
    action,
    imageURL: authzImage,
    description,
  } = useSelector(getAuthzUIDetails)
  const { name, image } = useSelector(getServiceDescription)

  const { t } = useTranslation()

  const cta = action
    ? capitalizeWord(truncateFirstWord(action))
    : t('Authorization.acceptBtn')

  const handleSubmit = useAuthzSubmit()

  return (
    <ContainerBAS>
      <LogoContainerBAS>
        {/* There is no serviceUrl avaiable for redirecting when clicking logo 
        
        useSelector(getServiceDescription) only returns the following data
      {
      did: counterparty.did,
      name: counterparty.publicProfile?.name,
      image: counterparty.publicProfile?.image,
      isAnonymous: counterparty.publicProfile === undefined,
      }
        
        */}
        <ServiceLogo source={image} />
      </LogoContainerBAS>
      <InteractionTitle
        label={t('Authorization.header', { authAction: action })}
      />
      <InteractionDescription
        label={
          description && !!description.length
            ? description
            : t('Authorization.subheader', { sericeName: name })
        }
      />
      <Space />
      <InteractionImage source={authzImage} />
      <InteractionFooter onSubmit={handleSubmit} submitLabel={cta} />
    </ContainerBAS>
  )
}

export default Authorization
