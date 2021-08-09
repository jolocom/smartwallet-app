import React from 'react'

import ScreenContainer from '~/components/ScreenContainer'
import { Colors } from '~/utils/colors'
import Info from '~/components/Info'
import useTranslation from '~/hooks/useTranslation'

const SeedPhraseInfo = () => {
  const { t } = useTranslation()
  return (
    <ScreenContainer backgroundColor={Colors.black65}>
      <Info.Content>
        <Info.Title>{t('SeedphraseInfo.header')}</Info.Title>
        <Info.Description>
          {t('SeedphraseInfo.textOne') + Info.newline}
          <Info.Highlight>
            {t('SeedphraseInfo.textTwoHighlight') + ' '}
          </Info.Highlight>
          {t('SeedphraseInfo.textTwoDefault') + Info.newline}
          <Info.Highlight>
            {t('SeedphraseInfo.textThree') + Info.newline}
          </Info.Highlight>
          {t('SeedphraseInfo.textFour')}
        </Info.Description>
      </Info.Content>
      <Info.Button>{t('SeedphraseInfo.confirmBtn')}</Info.Button>
    </ScreenContainer>
  )
}

export default SeedPhraseInfo
