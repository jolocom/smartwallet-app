import React, { useLayoutEffect, useState } from 'react'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'

import Input from '~/components/Input'
import { useCreateAttributes } from '~/hooks/attributes'
import { useLoader } from '~/hooks/loader'
import { useToasts } from '~/hooks/toasts'
import useInteractionToasts from '~/hooks/interactions/useInteractionToasts'
import InteractionHeader from '~/screens/Modals/Interaction/InteractionFlow/components/InteractionHeader'
import Form, { IFormState } from '~/screens/LoggedIn/Identity/components/Form'
import { strings } from '~/translations/strings'
import { attributeConfig } from '~/config/claims'
import { AttributeTypes, ClaimKeys } from '~/types/credentials'
import { useSwitchScreens } from '~/hooks/navigation'
import { ScreenNames } from '~/types/screens'
import ScreenDismissArea from '~/components/ScreenDismissArea'
import { LayoutAnimation, View } from 'react-native'
import Block from '~/components/Block'
import { Colors } from '~/utils/colors'
import { useKeyboard } from '@react-native-community/hooks'
import { useSafeArea } from 'react-native-safe-area-context'
import { RootStackParamList } from '~/RootNavigation'

type InteractionAddCredentialRouteProps = RouteProp<RootStackParamList, ScreenNames.InteractionAddCredential>

interface IInteractionAddCredential {
  route: InteractionAddCredentialRouteProps
}

const InteractionAddCredential: React.FC<IInteractionAddCredential> = ({route}) => {
  const loader = useLoader()
  const { scheduleInfo } = useToasts()
  const { scheduleErrorInteraction } = useInteractionToasts();
  const handleSwitchScreens = useSwitchScreens(ScreenNames.InteractionFlow);

  const createAttribute = useCreateAttributes()

  const navigation = useNavigation()
  const { type: inputType } = route.params;

    const { keyboardHeight } = useKeyboard();
  const [pushUpTo, setPushUpTo] = useState(0)

  useLayoutEffect(() => {
      LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.linear,
      duration: 200,
      })
    setPushUpTo(keyboardHeight + 8)
  }, [keyboardHeight])
  
  const formConfig = attributeConfig[inputType]
  const title = strings.ADD_YOUR_ATTRIBUTE(formConfig.label.toLowerCase())
  const description =
    strings.ONCE_YOU_CLICK_DONE_IT_WILL_BE_DISPLAYED_IN_THE_PERSONAL_INFO_SECTION

  const handleNavigateToInteraction = () => {
      navigation.goBack();
      setTimeout(() => {
        navigation.navigate(ScreenNames.InteractionFlow)
      }, 500)
  }
  
  const handleSubmit = async (collectedValues: IFormState[]) => {
    if (collectedValues.length) {
      const claims = collectedValues.reduce<Partial<Record<ClaimKeys, string>>>(
        (acc, v) => {
          acc[v.key] = v.value
          return acc
        },
        {},
      )

      const claimsValid = Object.values(claims).every((c) => c && !!c.length)

      if (claimsValid) {
        const success = await loader(
          async () => {
            await createAttribute(inputType, claims);
            handleSwitchScreens()
          },
          { showSuccess: false },
        )

        if (!success) {
          scheduleErrorInteraction()
        }
      } else {
        scheduleInfo({
          title: 'Oops',
          message: 'You need to fill in all the fields',
        })
      }
    } else {
      // TODO: focus keyboard
    }
  }

  const {bottom} = useSafeArea()

  return (
    <>
      <ScreenDismissArea onDismiss={handleNavigateToInteraction} />
      <View style={{ padding: 8, alignItems: 'center', paddingBottom: pushUpTo || bottom }}>
        <Block customStyle={{ borderRadius: 20, backgroundColor: Colors.codGrey, padding: 16, paddingBottom: 34 }}>
          <InteractionHeader {...{ title, description }} />
          <Form
            config={{
              key: formConfig.key,
              fields: formConfig.fields,
            }}
            onSubmit={handleSubmit}
          >
            <Form.Body>
              {({ fields, updateField }) =>
                fields.map((f, i) => {
                  const isLastInput = i === fields.length - 1
                  return (
                    <Input.Block
                      autoFocus={i === 0}
                      placeholder={f.label}
                      key={f.key}
                      updateInput={(val) => updateField(f.key, val)}
                      value={f.value}
                      returnKeyType={isLastInput ? 'done' : 'next'}
                      containerStyle={{ marginBottom: 8 }}
                      {...f.keyboardOptions}
                    />
                  )
                })
              }
            </Form.Body>
          </Form>
        </Block>
      </View>
      </>
  )
}

export default InteractionAddCredential
