import React from 'react'
import { View } from 'react-native'

import Section from '../components/Section'
import Option from '../components/Option'
import ToggleSwitch from '~/components/ToggleSwitch'
import { useToasts } from '~/hooks/toasts'
import { useRedirect } from '~/hooks/navigation'
import { ScreenNames } from '~/types/screens'
import useErrors from '~/hooks/useErrors'
import { SWErrorCodes } from '~/errors/codes'
import { usePopupMenu } from '~/hooks/popupMenu'

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

  return (
    <>
      <Section>
        <Section.Title>[DEV] Interactions</Section.Title>
        <Section.Block>
          <Option onPress={() => redirect(ScreenNames.InteractionPasteTest)}>
            <Option.Title title="Paste interaction token" />
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
          <Option onPress={() => redirect(ScreenNames.NotificationsTest)}>
            <Option.Title title="Notifications" />
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
