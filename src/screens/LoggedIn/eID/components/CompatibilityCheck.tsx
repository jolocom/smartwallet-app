import React from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'

import ScreenContainer from '~/components/ScreenContainer'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import Btn, { BtnTypes } from '~/components/Btn'
import { Colors } from '~/utils/colors'
import { eIDScreens } from '../types'
import { useRedirect } from '~/hooks/navigation'
import eIDHooks from '../hooks'
import { JoloTextSizes } from '~/utils/fonts'
import { PurpleTickSuccess } from '~/assets/svg'
import { AusweisButtons } from '../styled'
import BP from '~/utils/breakpoints'
import BtnGroup from '~/components/BtnGroup'
import { CheckboxOption } from '~/components/CheckboxOption'
import useTranslation from '~/hooks/useTranslation'
import AbsoluteBottom from '~/components/AbsoluteBottom'

const Header: React.FC = ({ children }) => (
  <JoloText
    kind={JoloTextKind.title}
    customStyles={{ marginBottom: BP({ large: 12, default: 8 }) }}
  >
    {children}
  </JoloText>
)

const Description: React.FC = ({ children }) => (
  <JoloText color={Colors.osloGray}>{children}</JoloText>
)

export const CompatibilityCheck = () => {
  const { t } = useTranslation()
  const redirect = useRedirect()
  const { cancelInteraction, cancelFlow } = eIDHooks.useAusweisInteraction()
  const { startCheck, compatibility } = eIDHooks.useAusweisCompatibilityCheck()
  const { setShouldSkip } = eIDHooks.useAusweisSkipCompatibility()

  eIDHooks.useAusweisCancelBackHandler()

  const handleCheckCompatibility = () => {
    startCheck()
  }

  const handleShowPinInstructions = () => {
    // @ts-expect-error
    redirect(eIDScreens.PasscodeDetails, {
      onDismiss: cancelFlow,
    })
  }

  const handleSubmit = () => {
    // @ts-expect-error
    redirect(eIDScreens.RequestDetails)
  }

  const handleIgnore = () => {
    cancelInteraction()
  }

  const handleSkip = (selected: boolean) => {
    setShouldSkip(selected)
  }

  return (
    <ScreenContainer
      backgroundColor={Colors.mainDark}
      customStyles={{ justifyContent: 'flex-start' }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        overScrollMode={'never'}
        contentContainerStyle={{
          paddingBottom: 230,
        }}
      >
        <JoloText
          kind={JoloTextKind.title}
          color={Colors.error}
          customStyles={styles.header}
        >
          {t('AusweisCompatibility.header')}
        </JoloText>
        <View style={styles.contentContainer}>
          <Header>{t('AusweisCompatibility.checkHeader')}</Header>
          <Description>{t('AusweisCompatibility.checkSubtitle')}</Description>
          <View style={{ marginTop: BP({ large: 24, default: 16 }) }}>
            {compatibility &&
            !compatibility.deactivated &&
            !compatibility.inoperative ? (
              <View style={styles.statusContainer}>
                <View style={styles.tickContainer}>
                  <PurpleTickSuccess />
                </View>
                <JoloText
                  color={Colors.success}
                  kind={JoloTextKind.title}
                  size={JoloTextSizes.mini}
                >
                  {t('AusweisCompatibility.checkSuccess')}
                </JoloText>
              </View>
            ) : (
              <Btn
                onPress={handleCheckCompatibility}
                type={BtnTypes.quaternary}
              >
                {compatibility?.deactivated || compatibility?.inoperative
                  ? t('AusweisCompatibility.checkTryAgain')
                  : t('AusweisCompatibility.checkStart')}
              </Btn>
            )}
          </View>
        </View>
        <View style={styles.pinContainer}>
          <Header>{t('AusweisCompatibility.pinTitle')}</Header>
          <View>
            <Description>
              {t('AusweisCompatibility.pinSubtitle')}
              <JoloText
                onPress={handleShowPinInstructions}
                color={Colors.activity}
              >
                {`...${t('AusweisCompatibility.pinBtn')}`}
              </JoloText>
            </Description>
          </View>
        </View>
      </ScrollView>
      <AbsoluteBottom customStyles={{ backfaceVisibility: 'hidden' }}>
        <CheckboxOption
          description={t('AusweisCompatibility.skipBtn')}
          onPress={handleSkip}
        />
        <BtnGroup customStyles={{ marginTop: 32 }}>
          <AusweisButtons
            submitLabel={t('AusweisCompatibility.proceedBtn')}
            cancelLabel={t('AusweisCompatibility.ignoreBtn')}
            onSubmit={handleSubmit}
            onCancel={handleIgnore}
          />
        </BtnGroup>
      </AbsoluteBottom>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  header: {
    marginTop: 36,
    marginBottom: 40,
  },
  contentContainer: {
    width: '100%',
    paddingHorizontal: 24,
    marginBottom: BP({ large: 60, default: 30 }),
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tickContainer: {
    width: 20,
    height: 20,
    marginRight: 9,
  },
  pinContainer: {
    width: '100%',
    paddingHorizontal: 24,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 12,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
})
