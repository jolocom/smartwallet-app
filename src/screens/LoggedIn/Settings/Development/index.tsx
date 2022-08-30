import React from 'react'
import { Linking, View } from 'react-native'

import Section from '../components/Section'
import Option from '../components/Option'
import ToggleSwitch from '~/components/ToggleSwitch'
import { useToasts } from '~/hooks/toasts'
import { useRedirect } from '~/hooks/navigation'
import { ScreenNames } from '~/types/screens'
import useErrors from '~/hooks/useErrors'
import { SWErrorCodes } from '~/errors/codes'
import { usePopupMenu } from '~/hooks/popupMenu'
import { DeeplinkParams } from '~/hooks/deeplinks'

const TC_TOKEN =
  'https://servicekonto.test.governikus-eid.de/AutentIDConnect/npa/authorize?scope=openid&response_type=code&redirect_uri=https%3A%2F%2Fservicekonto.test.governikus-eid.de%2Ftest-client%2Fopenid-connect%2Fauthcode&state=1&nonce=nonce&client_id=tNwyiRVez8xM8t1YZ9YnaMXd2tviISKw&acr_values=integrated'

const TEST_URL = encodeURIComponent('https://smartwallet.free.beeceptor.com')

const DevelopmentSection = () => {
  const { scheduleInfo } = useToasts()
  const { showErrorDisplay } = useErrors()

  const redirect = useRedirect()
  const { showPopup } = usePopupMenu()

  const handleToggle = (toggled: boolean) => {
    scheduleInfo({
      title: 'ToggleSwitch',
      message: `I am ${toggled ? 'toggled' : 'not toggled'}!`,
    })
  }

  const EID_DEEPLINK = new URL('https://jolocom.app.link/eid')
  EID_DEEPLINK.searchParams.append(
    DeeplinkParams.tcTokenUrl,
    encodeURIComponent(TC_TOKEN),
  )
  EID_DEEPLINK.searchParams.append(DeeplinkParams.redirectUrl, TEST_URL)
  EID_DEEPLINK.searchParams.append(DeeplinkParams.postRedirect, 'true')

  console.log({ EID_DEEPLINK })
  return (
    <>
      <Section>
        <Section.Title>[DEV] Interactions</Section.Title>
        <Section.Block>
          <Option onPress={() => redirect(ScreenNames.InteractionPasteTest)}>
            <Option.Title title="Paste interaction token" />
          </Option>
        </Section.Block>
        <Section.Block>
          <Option onPress={() => Linking.openURL(EID_DEEPLINK.href)}>
            <Option.Title title="Initiate eID flow" />
          </Option>
        </Section.Block>
      </Section>
      <Section>
        <Section.Title>[DEV] Error handling</Section.Title>
        <Section.Block>
          <Option
            onPress={() => showErrorDisplay(new Error(SWErrorCodes.SWUnknown))}
          >
            <Option.Title title="Throw error" />
          </Option>
        </Section.Block>
      </Section>

      <Section>
        <Section.Title>[DEV] UI component</Section.Title>
        <Section.Block>
          <Option>
            <Option.Title title="Toggle Switch" />
            <View style={{ position: 'absolute', right: 16 }}>
              <ToggleSwitch onToggle={handleToggle} />
            </View>
          </Option>
          <Option onPress={() => redirect(ScreenNames.ButtonsTest)}>
            <Option.Title title="Buttons" />
          </Option>
          <Option onPress={() => redirect(ScreenNames.LoaderTest)}>
            <Option.Title title="Loader" />
          </Option>
          <Option
            onPress={() =>
              showPopup([
                { title: 'Help', onPress: console.log },
                { title: 'Me', onPress: console.log },
                { title: 'Please', onPress: console.log },
              ])
            }
          >
            <Option.Title title="Popup menu" />
          </Option>
          <Option onPress={() => redirect(ScreenNames.CardStack)}>
            <Option.Title title="Card Stack" />
          </Option>
          <Option onPress={() => redirect(ScreenNames.NotificationsTest)}>
            <Option.Title title="Notifications" />
          </Option>
          <Option onPress={() => redirect(ScreenNames.CardsTest)}>
            <Option.Title title="Cards" />
          </Option>
          <Option onPress={() => redirect(ScreenNames.InputTest)}>
            <Option.Title title="Inputs" />
          </Option>
          <Option onPress={() => redirect(ScreenNames.PasscodeTest)}>
            <Option.Title title="Passcode" />
          </Option>
          <Option onPress={() => redirect(ScreenNames.CollapsibleTest)}>
            <Option.Title title="Collapsible" />
          </Option>
        </Section.Block>
      </Section>
    </>
  )
}

export default DevelopmentSection
