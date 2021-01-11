import React from 'react'

import InfoActionSheet from '~/components/InfoActionSheet'
import JoloText from '~/components/JoloText'
import { Colors } from '~/utils/colors'
import { strings } from '~/translations'

interface Props {
  onClose: () => void
  isVisible: boolean
}

const ForgotSeedInfo: React.FC<Props> = ({ onClose, isVisible }) => {
  return (
    <InfoActionSheet
      onClose={onClose}
      isVisible={isVisible}
      title={strings.WHAT_TO_DO_IF_YOU_FORGOT_YOUR_SECRET_PHRASE}
      closeBtnText={strings.CONTINUE}
    >
      <JoloText color={Colors.white60}>
        {strings.FORGOT_SEED_INFO_HIGHLIGHT_1 +
          '\n\n' +
          strings.FORGOT_SEED_INFO_HIGHLIGHT_2 +
          '\n\n'}
      </JoloText>
      {strings.FORGOT_SEED_INFO_3 + '\n\n'}
      <JoloText color={Colors.white60}>
        {strings.FORGOT_SEED_INFO_HIGHLIGHT_4 + '\n\n'}
      </JoloText>
    </InfoActionSheet>
  )
}

export default ForgotSeedInfo
