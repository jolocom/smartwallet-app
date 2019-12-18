import React, { useState } from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'
import { ThunkDispatch } from '../../../store'
import {
  createInfoNotification,
  createWarningNotification,
  INotification,
  NotificationPayload,
  NotificationType,
} from '../../../lib/notifications'
import { scheduleNotification } from '../../../actions/notifications'
import { connect } from 'react-redux'
import { Container, JolocomButton } from '../../structure'
import { NavigationScreenProps } from 'react-navigation'
import { debug } from '../../../styles/presets'
import { RootState } from '../../../reducers'
import { fontMain } from '../../../styles/typography'
import { blackMain, iBackgroundWhite } from '../../../styles/colors'
import { NotificationComponent } from '../components/notifications'
import { ToggleSwitch } from '../../structure/toggleSwitch'

const styles = StyleSheet.create({
  topSection: {
    flex: 0.9,
    width: '100%',
    justifyContent: 'flex-start',
    ...debug,
  },
  buttonSection: {
    flex: 0.1,
    ...debug,
  },
  inputs: {
    paddingHorizontal: 20,
  },
  config: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  configText: {
    fontFamily: fontMain,
    color: blackMain,
    fontSize: 16,
  },
  notification: {
    marginTop: 10,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.9)',
    paddingBottom: 18,
    paddingTop: 20,
  },
})

export type InteractiveNotification = {
  interact: boolean
  dismiss: boolean
} & NotificationPayload

interface Props
  extends NavigationScreenProps,
    ReturnType<typeof mapDispatchToProps>,
    ReturnType<typeof mapStateToProps> {}

const DevNotificationScheduler = (props: Props) => {
  const { showNotification, notificationQueue } = props

  const [title, setTitle] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [interact, setInteract] = useState(false)
  const [dismiss, setDismiss] = useState(true)
  const [warning, setWarning] = useState(false)
  const [sticky, setSticky] = useState(false)

  const defaultNotification: NotificationPayload = {
    type: NotificationType.info,
    title: 'Default Notification',
    message: 'An example of a notification that does nothing exceptional',
  }

  const creator = warning ? createWarningNotification : createInfoNotification

  const assembledNotification = creator({
    title,
    message,
    ...(interact && {
      interact: {
        label: 'Next',
        onInteract: () => false,
      },
    }),
    ...(dismiss && { dismiss: false }),
    ...(sticky && { dismiss: {} }),
  })

  const onPress = () => {
    if (!title.length && !message.length) {
      showNotification(createInfoNotification(defaultNotification))
    } else {
      showNotification(assembledNotification)
    }
  }

  return (
    <Container style={{ backgroundColor: iBackgroundWhite }}>
      <View style={styles.topSection}>
        <View style={styles.inputs}>
          <TextInput
            value={title}
            style={{
              fontSize: 16,
              fontFamily: fontMain,
              borderBottomWidth: 1,
              borderBottomColor: blackMain,
            }}
            placeholder={'Notification title...'}
            onChangeText={setTitle}
          />
          <TextInput
            value={message}
            placeholder={'Notification message...'}
            onChangeText={setMessage}
            style={{
              padding: 4,
              marginTop: 10,
              fontSize: 14,
              fontFamily: fontMain,
              borderWidth: 1,
              borderColor: blackMain,
            }}
            numberOfLines={3}
            multiline={true}
            textAlignVertical={'top'}
          />
        </View>
        <View
          style={{
            width: '100%',
            paddingVertical: 10,
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}
        >
          <View style={styles.config}>
            <ToggleSwitch
              value={interact}
              onToggle={() => setInteract(!interact)}
            />
            <Text style={styles.configText}>{'Interact'}</Text>
          </View>
          <View style={styles.config}>
            <ToggleSwitch
              value={dismiss}
              onToggle={() => setDismiss(!dismiss)}
            />
            <Text style={styles.configText}>{'Dismiss'}</Text>
          </View>
          <View style={styles.config}>
            <ToggleSwitch value={sticky} onToggle={() => setSticky(!sticky)} />
            <Text style={styles.configText}>{'Sticky'}</Text>
          </View>
          <View style={styles.config}>
            <ToggleSwitch
              value={warning}
              onToggle={() => setWarning(!warning)}
            />
            <Text style={styles.configText}>{'Warning'}</Text>
          </View>
        </View>
        <View style={styles.notification}>
          <NotificationComponent
            notification={assembledNotification}
            onPressDismiss={() => false}
            onPressInteract={() => false}
          />
        </View>
        <View
          style={{ width: '100%', paddingVertical: 50, alignItems: 'center' }}
        >
          <Text style={[styles.configText, { fontSize: 30 }]}>Queue</Text>
          <Text style={[styles.configText, { fontSize: 30 }]}>
            {notificationQueue.length}
          </Text>
        </View>
      </View>
      <View style={styles.buttonSection}>
        <JolocomButton onPress={onPress} text={'Schedule notification'} />
      </View>
    </Container>
  )
}

const mapStateToProps = (state: RootState) => ({
  notificationQueue: state.notifications.queue,
})

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  showNotification: (notification: INotification) =>
    dispatch(scheduleNotification(notification)),
})

export const NotificationScheduler = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DevNotificationScheduler)
