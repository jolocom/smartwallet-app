import React from 'react'
import InteractionFooter from './components/InteractionFooter'
import InteractionDescription from './components/InteractionDescription'
import InteractionLogo from './components/InteractionLogo'
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

const Authorization = () => {
  const {
    action,
    imageURL: image,
    description,
  } = useSelector(getAuthzUIDetails)
  const { name } = useSelector(getServiceDescription)

  const { t } = useTranslation()

  const cta = action
    ? capitalizeWord(truncateFirstWord(action))
    : t('Authorization.acceptBtn')

  const handleSubmit = useAuthzSubmit()

  return (
    <ContainerBAS>
      <LogoContainerBAS>
        <InteractionLogo />
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
      <InteractionImage source={image} />
      <InteractionFooter onSubmit={handleSubmit} submitLabel={cta} />
    </ContainerBAS>
  )
}

export default Authorization
