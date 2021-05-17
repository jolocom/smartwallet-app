import React from 'react'

import ScreenContainer from '~/components/ScreenContainer'
import Info from '~/components/Info'
import { strings } from '~/translations'
import { Colors } from '~/utils/colors'

const LostSeedPhraseInfo = () => {
  return (
    <ScreenContainer backgroundColor={Colors.black65}>
      <Info.Content>
        <Info.Title>
          {strings.WHAT_TO_DO_IF_YOU_FORGOT_YOUR_SECRET_PHRASE}
        </Info.Title>
        <Info.Description>
          <Info.Highlight>
            {strings.FORGOT_SEED_INFO_HIGHLIGHT_1 +
              Info.newline +
              strings.FORGOT_SEED_INFO_HIGHLIGHT_2 +
              Info.newline}
          </Info.Highlight>
          {strings.FORGOT_SEED_INFO_3 + Info.newline}
          <Info.Highlight>
            {strings.FORGOT_SEED_INFO_HIGHLIGHT_4 + Info.newline}
          </Info.Highlight>
        </Info.Description>
      </Info.Content>
      <Info.Button>{strings.CONTINUE}</Info.Button>
    </ScreenContainer>
  )
}

export default LostSeedPhraseInfo
