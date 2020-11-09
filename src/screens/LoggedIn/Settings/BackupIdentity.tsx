import React from 'react'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import ScreenContainer from '~/components/ScreenContainer'
import { JoloTextSizes } from '~/utils/fonts'

const BackupIdentity = () => (
  <ScreenContainer hasHeaderBack>
    <JoloText kind={JoloTextKind.title} size={JoloTextSizes.middle}>
      Backup Identity
    </JoloText>
  </ScreenContainer>
)

export default BackupIdentity
