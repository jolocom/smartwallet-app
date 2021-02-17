import React from 'react'
import { useSelector } from 'react-redux'

import BasWrapper from '~/components/ActionSheet/BasWrapper'
import InteractionHeader from './components/InteractionHeader'
import { strings } from '~/translations/strings'
import { getCounterpartyName } from '~/modules/interaction/selectors'
import useAuthSubmit from '~/hooks/interactions/useAuthSubmit'
import InteractionFooter from './components/InteractionFooter'

const Authentication: React.FC = () => {
  const serviceName = useSelector(getCounterpartyName)
  const title = strings.IS_IT_REALLY_YOU
  const description = strings.SERVICE_WOULD_LIKE_TO_CONFIRM_YOUR_DIGITAL_IDENTITY(
    serviceName,
  )
  const cta = strings.AUTHENTICATE
  const handleSubmit = useAuthSubmit()

  return (
    <BasWrapper
      customStyles={{
        marginTop: 5,
      }}
    >
      <InteractionHeader {...{ title, description }} />
      <InteractionFooter cta={cta} onSubmit={handleSubmit} />
    </BasWrapper>
  )
}

export default Authentication
