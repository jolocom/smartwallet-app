import React from 'react'
import InteractionFooter from './components/InteractionFooter'
import InteractionDescription from './components/InteractionDescription'
import InteractionLogo from './components/InteractionLogo'
import InteractionTitle from './components/InteractionTitle'
import { ContainerBAS, LogoContainerBAS } from './components/styled'
import InteractionImage from './components/InteractionAuthzImage'
import useAuthzSubmit from '~/hooks/interactions/useAuthzSubmit'
import { useSelector } from 'react-redux'
import { getAuthzUIDetails } from '~/modules/interaction/selectors'
import { strings } from '~/translations'
import { truncateFirstWord, capitalizeWord } from '~/utils/stringUtils'
import useTranslation from '~/hooks/useTranslation'
import Space from '~/components/Space'

const Authorization = () => {
  const {
    action,
    imageURL: image,
    description, // NOTE: it isn't used
  } = useSelector(getAuthzUIDetails)

  const { t } = useTranslation()

  const cta = action
    ? capitalizeWord(truncateFirstWord(action))
    : strings.AUTHORIZE

  const handleSubmit = useAuthzSubmit()

  return (
    <ContainerBAS>
      <LogoContainerBAS>
        <InteractionLogo />
      </LogoContainerBAS>
      <InteractionTitle
        label={t(strings.WOULD_YOU_LIKE_TO_ACTION, { action })}
      />
      <InteractionDescription
        label={strings.SERVICE_IS_NOW_READY_TO_GRANT_YOU_ACCESS}
      />
      <Space />
      <InteractionImage source={image} />
      <InteractionFooter onSubmit={handleSubmit} submitLabel={cta} />
    </ContainerBAS>
  )
}

export default Authorization
