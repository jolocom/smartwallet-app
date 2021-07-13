import React from 'react'
import { View } from 'react-native'

import JoloText, { JoloTextKind } from '~/components/JoloText'
import ScreenContainer from '~/components/ScreenContainer'
import { JoloTextSizes } from '~/utils/fonts'
import Section from './components/Section'
import Block from '~/components/Block'
import Btn, { BtnTypes } from '~/components/Btn'
import { Colors } from '~/utils/colors'
import BP from '~/utils/breakpoints'
import Collapsible from '~/components/Collapsible'
import NavigationHeader, { NavHeaderType } from '~/components/NavigationHeader'
import useTranslation from '~/hooks/useTranslation'

const BackupBlock: React.FC<{
  title: string
  description: string
  btnText: string
  onPress: () => void
}> = ({ title, description, btnText, onPress }) => (
  <Block
    customStyle={{
      paddingVertical: BP({ default: 24, xsmall: 20 }),
      paddingHorizontal: BP({ default: 24, xsmall: 12 }),
      marginBottom: BP({ default: 24, xsmall: 16 }),
    }}
  >
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
  const { t } = useTranslation()
  // FIXME: add proper values
  const lastBackup = '18.07.2020'

  return (
    <Collapsible>
      <Collapsible.Header>
        <NavigationHeader type={NavHeaderType.Back}>
          <Collapsible.HeaderText>
            {t('BackupOptions.header')}
          </Collapsible.HeaderText>
        </NavigationHeader>
      </Collapsible.Header>
      <ScreenContainer customStyles={{ justifyContent: 'space-between' }}>
        <Collapsible.ScrollView
          customStyles={{
            flexGrow: 1,
            justifyContent: 'space-between',
            paddingBottom: 0,
          }}
        >
          <Collapsible.HidingTextContainer>
            <Section.Title>{t('BackupOptions.header')}</Section.Title>
          </Collapsible.HidingTextContainer>
          <View>
            <BackupBlock
              title={t('BackupOptions.exportHeader')}
              description={t('BackupOptions.exportSubheader')}
              btnText={t('BackupOptions.exportBtn')}
              onPress={() => {}}
            />
            <BackupBlock
              title={t('BackupOptions.importHeader')}
              description={t('BackupOptions.importSubheader')}
              btnText={t('BackupOptions.importBtn')}
              onPress={() => {}}
            />
          </View>
          <View
            style={{
              width: '100%',
              paddingBottom: 32,
              paddingTop: 20,
            }}
          >
            <JoloText color={Colors.white30}>
              {t('BackupOptions.lastBackupInfo')}
            </JoloText>
            <JoloText color={Colors.white30}>{lastBackup}</JoloText>
          </View>
        </Collapsible.ScrollView>
      </ScreenContainer>
    </Collapsible>
  )
}

export default BackupIdentity
