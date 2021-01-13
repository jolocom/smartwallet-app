import React from 'react'

import ScreenContainer from '~/components/ScreenContainer'
import { Colors } from '~/utils/colors'
import Info from '~/components/Info'
import { strings } from '~/translations'

const SeedPhraseInfo = () => {
  return (
    <ScreenContainer backgroundColor={Colors.black}>
      <Info.Content>
        <Info.Title>{strings.WHY_THESE_WORDS_ARE_IMPORTANT_TO_YOU}</Info.Title>
        <Info.Description>
          {strings.SEEDPHRASE_INFO_1 + Info.newline}
          <Info.Highlight>
            {strings.SEEDPHRASE_INFO_HIGHLIGHT_2 + ' '}
          </Info.Highlight>
          {strings.SEEDPHRASE_INFO_3 + Info.newline}
          <Info.Highlight>
            {strings.SEEDPHRASE_INFO_HIGHLIGHT_4 + Info.newline}
          </Info.Highlight>
          {strings.SEEDPHRASE_INFO_5}
        </Info.Description>
      </Info.Content>
      <Info.Button>{strings.GOT_THIS}</Info.Button>
    </ScreenContainer>
  )
}

export default SeedPhraseInfo
