import React, { useEffect, useState } from 'react'
import { LayoutAnimation, Platform, View } from 'react-native'
import { useKeyboard } from '@react-native-community/hooks'
import { useSafeArea } from 'react-native-safe-area-context'
import { RouteProp } from '@react-navigation/native'
import {
  withNextInputAutoFocusInput,
  withNextInputAutoFocusForm,
} from 'react-native-formik'
import { Formik } from 'formik'

import Input from '~/components/Input'
import { useCreateAttributes } from '~/hooks/attributes'
import { useLoader } from '~/hooks/loader'
import { useToasts } from '~/hooks/toasts'
import useInteractionToasts from '~/hooks/interactions/useInteractionToasts'
import { strings } from '~/translations/strings'
import { attributeConfig } from '~/config/claims'
import { useSwitchScreens } from '~/hooks/navigation'
import { ScreenNames } from '~/types/screens'
import ScreenDismissArea from '~/components/ScreenDismissArea'
import Block from '~/components/Block'
import { Colors } from '~/utils/colors'
import { InteractionStackParamList } from '../index'
import { assembleFormInitialValues } from '~/utils/dataMapping'
import InteractionTitle from '../InteractionFlow/components/InteractionTitle'
import InteractionDescription from '../InteractionFlow/components/InteractionDescription'
import { Space } from '../InteractionFlow/components/styled'
import useTranslation from '~/hooks/useTranslation'

type InteractionAddCredentialRouteProps = RouteProp<
  InteractionStackParamList,
  ScreenNames.InteractionAddCredential
>

interface IInteractionAddCredential {
  route: InteractionAddCredentialRouteProps
}

const AutofocusInput = withNextInputAutoFocusInput(Input.Block)
const AutofocusContainer = withNextInputAutoFocusForm(View)

const InteractionAddCredential: React.FC<IInteractionAddCredential> = ({
  route,
}) => {
  const loader = useLoader()
  const { scheduleInfo } = useToasts()
  const { scheduleErrorInteraction } = useInteractionToasts()
  const handleSwitchScreens = useSwitchScreens(ScreenNames.InteractionFlow)

  const createAttribute = useCreateAttributes()

  const { type: inputType } = route.params

  const { keyboardHeight, keyboardShown } = useKeyboard()
  const [pushUpTo, setPushUpTo] = useState(0)

  const { t } = useTranslation();

  useEffect(() => {
    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.linear,
      duration: 200,
    })
    if (keyboardShown) {
      const extraMargin = Platform.select({
        ios: keyboardHeight + 8,
        // NOTE: margin independent from keyboard, since android
        // has native keyboard behavior
        android: 60,
        default: 0,
      })
      setPushUpTo(extraMargin)
    } else {
      setPushUpTo(0)
    }
  }, [keyboardShown, keyboardHeight])

  const formConfig = attributeConfig[inputType]
  const title = t(strings.ADD_YOUR_ATTRIBUTE, {attribute: formConfig.label.toLowerCase()})
  const description =
    strings.ONCE_YOU_CLICK_DONE_IT_WILL_BE_DISPLAYED_IN_THE_PERSONAL_INFO_SECTION

  const handleSubmit = async (claims: Record<string, string>) => {
    if (Object.keys(claims).length) {
      // TODO: update check of non-primitive validity
      const claimsValid = Object.values(claims).every((c) => c && !!c.length)

      if (claimsValid) {
        const handleDone = (success: boolean) => {
          if (!success) scheduleErrorInteraction()
        }
        await loader(
          async () => {
            await createAttribute(inputType, claims)
            handleSwitchScreens()
          },
          { showSuccess: false },
          handleDone,
        )
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

  const { bottom } = useSafeArea()
  const initialValues = assembleFormInitialValues(
    attributeConfig[inputType].fields,
  )

  return (
    <>
      <ScreenDismissArea onDismiss={handleSwitchScreens} />
      <View
        style={{
          padding: 8,
          alignItems: 'center',
          paddingBottom: pushUpTo || bottom,
        }}
      >
        <Block
          customStyle={{
            borderRadius: 20,
            backgroundColor: Colors.codGrey,
            padding: 16,
            paddingBottom: 34,
          }}
        >
          <InteractionTitle label={title} />
          <InteractionDescription
            label={description}
          />
          <Space />
          <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            {({ handleChange, values }) => (
              <AutofocusContainer>
                {attributeConfig[inputType].fields.map((field, idx) => (
                  <AutofocusInput
                    // @ts-ignore
                    name={field.key}
                    key={field.key}
                    // @ts-ignore
                    value={values[field.key]}
                    updateInput={handleChange(field.key)}
                    placeholder={field.label}
                    autoFocus={idx === 0}
                    containerStyle={{ marginBottom: 10 }}
                    placeholderTextColor={Colors.white30}
                    {...field.keyboardOptions}
                  />
                ))}
              </AutofocusContainer>
            )}
          </Formik>
        </Block>
      </View>
    </>
  )
}

export default InteractionAddCredential
