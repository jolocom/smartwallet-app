import React from 'react'

import ScreenContainer from '~/components/ScreenContainer'
import Info from '~/components/Info'
import { Colors } from '~/utils/colors'
import useTranslation from '~/hooks/useTranslation'

const LostSeedPhraseInfo = () => {
  const { t } = useTranslation()

  return (
    <ScreenContainer backgroundColor={Colors.black65}>
      <Info.Content>
        <Info.Title>{t('RecoveryInfo.header')}</Info.Title>
        <Info.Description>
          <Info.Highlight>
            {t('RecoveryInfo.textPartOne') +
              Info.newline +
              t('RecoveryInfo.textPartTwo') +
              Info.newline}
          </Info.Highlight>
          {t('RecoveryInfo.textPartThree') + Info.newline}
          <Info.Highlight>
            {t('RecoveryInfo.textPartFour') + Info.newline}
          </Info.Highlight>
        </Info.Description>
      </Info.Content>
      <Info.Button>{t('RecoveryInfo.closeBtn')}</Info.Button>
    </ScreenContainer>
  )
}

export default LostSeedPhraseInfo
