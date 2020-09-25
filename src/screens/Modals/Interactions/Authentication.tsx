import React from 'react'

import BasWrapper from '~/components/ActionSheet/BasWrapper'
import InteractionHeader from './InteractionHeader'
import { strings } from '~/translations/strings'
import { getCounterpartyName } from '~/modules/interaction/selectors'
import { useSelector } from 'react-redux'

const Authentication: React.FC = () => {
  const serviceName = useSelector(getCounterpartyName)
  const title = strings.IS_IT_REALLY_YOU
  const description = strings.SERVICE_WOULD_LIKE_TO_CONFIRM_YOUR_DIGITAL_IDENTITY(
    serviceName,
  )

  return (
    <BasWrapper
      customStyle={{
        marginTop: 5,
      }}
    >
      <InteractionHeader {...{ title, description }} />
    </BasWrapper>
  )
}

export default Authentication
