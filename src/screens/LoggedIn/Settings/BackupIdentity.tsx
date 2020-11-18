import React from 'react'
import { ScrollView, View } from 'react-native'

import JoloText, { JoloTextKind } from '~/components/JoloText'
import ScreenContainer from '~/components/ScreenContainer'
import { JoloTextSizes } from '~/utils/fonts'
import Section from './components/Section'
import { strings } from '~/translations'
import Block from '~/components/Block'
import Btn, { BtnTypes } from '~/components/Btn'
import { Colors } from '~/utils/colors'
import { debugView } from '~/utils/dev'

const BackupBlock: React.FC<{
  title: string
  description: string
  btnText: string
  onPress: () => void
}> = ({ title, description, btnText, onPress }) => (
  <Block customStyle={{ padding: 24, marginBottom: 28 }}>
    <JoloText
      color={Colors.white90}
      kind={JoloTextKind.subtitle}
      size={JoloTextSizes.big}
      customStyles={{ marginBottom: 8 }}
    >
      {title}
    </JoloText>
    <JoloText
      kind={JoloTextKind.subtitle}
      size={JoloTextSizes.mini}
      customStyles={{ marginBottom: 18 }}
    >
      {description}
    </JoloText>
    <Btn type={BtnTypes.quaternary} onPress={onPress}>
      {btnText}
    </Btn>
  </Block>
)

const BackupIdentity = () => {
  const lastBackup = '18.07.2020'

  return (
    <ScreenContainer
      hasHeaderBack
      customStyles={{ justifyContent: 'space-between', paddingTop: 12 }}
    >
      <View style={{ width: '100%' }}>
        <Section title={strings.BACKUP_OPTIONS} />
        <BackupBlock
          title={strings.BACKUP_YOUR_DATA}
          description={strings.DOWNLOAD_AN_ENCRYPTED_COPY_OF_THE_DATA}
          btnText={strings.EXPORT_BACKUP_FILE}
          onPress={() => {}}
        />
        <BackupBlock
          title={strings.RESTORE_YOUR_DATA}
          description={strings.IN_CASE_YOU_DELETED_SOMETHING_IMPORTANT}
          btnText={strings.IMPORT_FILE}
          onPress={() => {}}
        />
      </View>
      <View style={{ width: '100%', paddingBottom: 32 }}>
        <JoloText color={Colors.white30}>{strings.LAST_BACKUP}</JoloText>
        <JoloText color={Colors.white30}>{lastBackup}</JoloText>
      </View>
    </ScreenContainer>
  )
}

export default BackupIdentity
