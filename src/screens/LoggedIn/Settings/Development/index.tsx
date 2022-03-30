import React from 'react'
import { View } from 'react-native'

import Section from '../components/Section'
import Option from '../components/Option'
import ToggleSwitch from '~/components/ToggleSwitch'
import { useToasts } from '~/hooks/toasts'
import { useRedirect, useRedirectTo } from '~/hooks/navigation'
import { ScreenNames } from '~/types/screens'
import useErrors from '~/hooks/useErrors'
import { SWErrorCodes } from '~/errors/codes'
import { usePopupMenu } from '~/hooks/popupMenu'
import eIDHooks from '~/screens/LoggedIn/eID/hooks'
import { useLoader } from '~/hooks/loader'

const TC_TOKEN =
  'https://test.governikus-eid.de/Autent-DemoApplication/RequestServlet?provider=demo_epa_20&redirect=true'

const DevelopmentSection = () => {
  const { scheduleInfo } = useToasts()
  const { showErrorDisplay } = useErrors()
  const redirectToNotifications = useRedirectTo(ScreenNames.NotificationsTest)
  const redirectToInputs = useRedirectTo(ScreenNames.InputTest)
  const redirectToPasscode = useRedirectTo(ScreenNames.PasscodeTest)

  const { processAusweisToken } = eIDHooks.useAusweisInteraction()
  const loader = useLoader()

  const redirect = useRedirect()
  const { showPopup } = usePopupMenu()

  const handleToggle = (toggled: boolean) => {
    scheduleInfo({
      title: 'ToggleSwitch',
      message: `I am ${toggled ? 'toggled' : 'not toggled'}!`,
    })
  }

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
          <Option
            onPress={() =>
              loader(() => processAusweisToken(TC_TOKEN), {
                showSuccess: false,
              })
            }
          >
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
          <Option onPress={redirectToNotifications}>
            <Option.Title title="Notifications" />
          </Option>
          <Option onPress={redirectToInputs}>
            <Option.Title title="Inputs" />
          </Option>
          <Option onPress={redirectToPasscode}>
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
