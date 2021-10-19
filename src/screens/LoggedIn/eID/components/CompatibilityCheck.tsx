import React from 'react'
import { View, StyleSheet } from 'react-native'

import ScreenContainer from '~/components/ScreenContainer'
import JoloText, { JoloTextKind, JoloTextWeight } from '~/components/JoloText'
import Btn, { BtnTypes } from '~/components/Btn'
import { Colors } from '~/utils/colors'
import { eIDScreens } from '../types'
import { useRedirect } from '~/hooks/navigation'
import {
  useAusweisCompatibilityCheck,
  useAusweisContext,
  useAusweisInteraction,
} from '../hooks'
import { JoloTextSizes } from '~/utils/fonts'
import { PurpleTickSuccess } from '~/assets/svg'
import { AusweisButtons } from '../styled'
import BP from '~/utils/breakpoints'
import BtnGroup from '~/components/BtnGroup'
import { CheckboxOption } from '~/components/CheckboxOption'

const Header: React.FC = ({ children }) => (
  <JoloText
    kind={JoloTextKind.title}
    customStyles={{ marginBottom: BP({ large: 12, default: 8 }) }}
  >
    {children}
  </JoloText>
)

const Description: React.FC = ({ children }) => (
  <JoloText color={Colors.osloGray} weight={JoloTextWeight.medium}>
    {children}
  </JoloText>
)

export const CompatibilityCheck = () => {
  const redirect = useRedirect()
  const { providerName } = useAusweisContext()
  const { cancelFlow } = useAusweisInteraction()
  const { startCheck, compatibility } = useAusweisCompatibilityCheck()

  const handleCheckCompatibility = () => {
    startCheck()
  }

  const handleShowPinInstructions = () => {
    // @ts-expect-error
    redirect(eIDScreens.PasscodeDetails)
  }

  const handleSubmit = () => {
    // @ts-expect-error
    redirect(eIDScreens.RequestDetails)
  }

  const handleIgnore = () => {
    cancelFlow()
  }

  return (
    <ScreenContainer
      backgroundColor={Colors.mainDark}
      customStyles={{ justifyContent: 'flex-start' }}
    >
      <View>
        <JoloText
          kind={JoloTextKind.title}
          color={Colors.error}
          customStyles={{ marginTop: 36, marginBottom: 40 }}
        >
          Before you proceed your device must meet certain technical
          requirements
        </JoloText>
        <View
          style={{
            width: '100%',
            paddingHorizontal: 24,
            marginBottom: BP({ large: 60, default: 30 }),
          }}
        >
          <Header>Compatibility Check</Header>
          <Description>
            To complete your hotel check-in {providerName} is requesting
            specific set of data.
          </Description>
          <View style={{ marginTop: BP({ large: 24, default: 16 }) }}>
            {compatibility &&
            !compatibility.deactivated &&
            !compatibility.inoperative ? (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <View style={{ width: 20, height: 20, marginRight: 9 }}>
                  <PurpleTickSuccess />
                </View>
                <JoloText
                  color={Colors.success}
                  kind={JoloTextKind.title}
                  size={JoloTextSizes.mini}
                >
                  Successfully passed
                </JoloText>
              </View>
            ) : (
              <Btn
                onPress={handleCheckCompatibility}
                type={BtnTypes.quaternary}
              >
                {compatibility?.deactivated || compatibility?.inoperative
                  ? 'Try again'
                  : 'Start'}
              </Btn>
            )}
          </View>
        </View>
        <View style={{ width: '100%', paddingHorizontal: 24 }}>
          <Header>6-digit pin status</Header>
          <View>
            <Description>
              To complete your hotel check-in {providerName} is requesting
              specific set of data.{' '}
              <JoloText
                onPress={handleShowPinInstructions}
                color={Colors.activity}
              >
                ...more info
              </JoloText>
            </Description>
          </View>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
      >
        <View style={{ paddingHorizontal: 20 }}>
          <CheckboxOption
            description={
              'Skip this step when performing similar interaction again'
            }
            onPress={() => {}}
          />
        </View>
        <BtnGroup customStyles={{ marginTop: 32 }}>
          <AusweisButtons
            submitLabel="Done"
            cancelLabel="Ignore"
            onSubmit={handleSubmit}
            onCancel={handleIgnore}
          />
        </BtnGroup>
      </View>
    </ScreenContainer>
  )
}
