import React from 'react'
import InfoActionSheet from '~/components/InfoActionSheet'
import JoloText from '~/components/JoloText'
import { Colors } from '~/utils/colors'
import { strings } from '~/translations'

interface Props {
  onClose: () => void
  isVisible: boolean
}

const SeedphraseInfo: React.FC<Props> = ({ onClose, isVisible }) => {
  return (
    <InfoActionSheet
      onClose={onClose}
      isVisible={isVisible}
      title={strings.WHY_THESE_WORDS_ARE_IMPORTANT_TO_YOU}
      closeBtnText={strings.GOT_THIS}
    >
      {strings.SEEDPHRASE_INFO_1 + '\n\n'}
      <JoloText color={Colors.white60}>
        {strings.SEEDPHRASE_INFO_HIGHLIGHT_2 + ' '}
      </JoloText>
      {strings.SEEDPHRASE_INFO_3 + '\n\n'}
      <JoloText color={Colors.white60}>
        {strings.SEEDPHRASE_INFO_HIGHLIGHT_4 + '\n\n'}
      </JoloText>
      {strings.SEEDPHRASE_INFO_5}
    </InfoActionSheet>
  )
}

export default SeedphraseInfo
