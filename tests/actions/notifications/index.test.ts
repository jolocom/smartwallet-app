import MockDate from 'mockdate'
import { createMockStoreWithReducers } from 'tests/utils'
import {
  scheduleNotification,
  invokeInteract,
  invokeDismiss,
  removeNotification,
} from 'src/actions/notifications'
import {
  createInfoNotification,
  createStickyNotification,
  Notification,
} from 'src/lib/notifications'

jest.useFakeTimers()

describe('Notifications Actions', () => {
  let curId = 1
  let mockStore: ReturnType<typeof createMockStoreWithReducers>
  const getId = () => curId++
  const timeout = 3000
  beforeEach(() => {
    mockStore = createMockStoreWithReducers()
    curId = 1
  })

  const newSticky = (notif: Partial<Notification> = {}) =>
    createStickyNotification({
      id: getId().toString(),
      title: 'hello',
      message: 'sup',
      ...notif,
    })

  const newSlidy = () =>
    createInfoNotification({
      id: getId().toString(),
      title: 'hello',
      message: 'sup',
    })

  describe('scheduleNotification', () => {
    beforeEach(() => {
      mockStore.reset()
      MockDate.set(0)
    })
    afterEach(() => MockDate.reset())

    it('should set an active notification if there are none in queue', () => {
      mockStore.dispatch(scheduleNotification(newSlidy()))
      expect(mockStore.getActions()).toMatchSnapshot()
    })

    it('should not change the active notification if it is not expired', () => {
      const notification = newSlidy()
      notification.dismiss = { timeout }

      mockStore.dispatch(scheduleNotification(notification))
      MockDate.set(timeout / 2)
      mockStore.dispatch(
        scheduleNotification({
          ...notification,
          id: '2',
        }),
      )

      expect(mockStore.getActions()).toMatchSnapshot()
      jest.runAllTimers()
      expect(mockStore.getActions()).toMatchSnapshot()
    })

    it('should change to the next notification when active expires', () => {
      const notification = newSlidy()
      notification.dismiss = { timeout }
      mockStore.dispatch(scheduleNotification(notification))

      MockDate.set(timeout / 2)

      mockStore.dispatch(
        scheduleNotification({
          ...notification,
          id: '2',
        }),
      )

      expect(mockStore.getActions()).toMatchSnapshot()

      MockDate.set(timeout + 100)
      jest.runAllTimers()
      expect(mockStore.getActions()).toMatchSnapshot()
    })

    it('should change to the next notification immediately if active is non-dismissible', () => {
      const sticky = newSticky()
      const slidy = newSlidy()
      slidy.dismiss = { timeout }

      mockStore.dispatch(scheduleNotification(sticky))
      mockStore.dispatch(scheduleNotification(slidy))
      expect(mockStore.getActions()).toMatchSnapshot()

      MockDate.set(timeout + 100)
      jest.runAllTimers()
      expect(mockStore.getActions()).toMatchSnapshot()
    })

    it('should not change to a new non-dismissible if active is dismissible', () => {
      const sticky = newSticky()
      const slidy = newSlidy()
      slidy.dismiss = { timeout }

      mockStore.dispatch(scheduleNotification(slidy))
      mockStore.dispatch(scheduleNotification(sticky))
      expect(mockStore.getActions()).toMatchSnapshot()

      MockDate.set(timeout + 100)
      jest.runAllTimers()
      expect(mockStore.getActions()).toMatchSnapshot()
    })
  })

  describe('invokeDismiss', () => {
    beforeEach(() => {
      mockStore.reset()
      MockDate.set(0)
    })
    afterEach(() => MockDate.reset())

    it('should call the onDismiss callback and remove the notification', () => {
      const onDismiss = jest.fn()
      const slidy = newSticky({
        dismiss: { onDismiss },
      })

      mockStore.dispatch(scheduleNotification(slidy))
      expect(mockStore.getActions()).toMatchSnapshot()
      mockStore.dispatch(invokeDismiss(slidy))
      jest.runAllTimers()
      expect(mockStore.getActions()).toMatchSnapshot()
      expect(onDismiss).toHaveBeenCalledTimes(1)
    })
  })

  describe('invokeInteract', () => {
    beforeEach(() => {
      mockStore.reset()
      MockDate.set(0)
    })
    afterEach(() => MockDate.reset())

    it('should call the onInteract callback and remove the notification', () => {
      const onInteract = jest.fn()
      const sticky = newSticky({
        interact: {
          label: 'DO IT',
          onInteract,
        },
      })

      mockStore.dispatch(scheduleNotification(sticky))
      expect(mockStore.getActions()).toMatchSnapshot()
      mockStore.dispatch(invokeInteract(sticky))
      jest.runAllTimers()
      expect(mockStore.getActions()).toMatchSnapshot()
      expect(onInteract).toHaveBeenCalledTimes(1)
    })

    it('should keep the notification if onInteract returns true', () => {
      const onInteract = jest.fn().mockReturnValue(true)
      const sticky = newSticky({
        interact: {
          label: 'DO IT',
          onInteract,
        },
      })

      mockStore.dispatch(scheduleNotification(sticky))
      expect(mockStore.getActions()).toMatchSnapshot()
      mockStore.dispatch(invokeInteract(sticky))
      expect(mockStore.getActions()).toMatchSnapshot()
      jest.runAllTimers()
      expect(mockStore.getActions()).toMatchSnapshot()
      expect(onInteract).toHaveBeenCalledTimes(1)
    })
  })

  describe('removeNotification', () => {
    beforeEach(() => {
      mockStore.reset()
      MockDate.set(0)
    })
    afterEach(() => MockDate.reset())

    it('should remove the notification from the queue', () => {
      const slidy = newSlidy()
      const slidy2 = newSlidy()

      mockStore.dispatch(scheduleNotification(slidy))
      mockStore.dispatch(scheduleNotification(slidy2))
      mockStore.dispatch(removeNotification(slidy2))
      expect(mockStore.getActions()).toMatchSnapshot()
      jest.runAllTimers()
      expect(mockStore.getActions()).toMatchSnapshot()
      expect(mockStore.getState().notifications).toMatchSnapshot()
    })

    it('should remove the notification from the queue, and unset it if it was active', () => {
      const slidy = newSlidy()
      mockStore.dispatch(scheduleNotification(slidy))
      mockStore.dispatch(removeNotification(slidy))
      expect(mockStore.getActions()).toMatchSnapshot()
      jest.runAllTimers()
      expect(mockStore.getActions()).toMatchSnapshot()
      expect(mockStore.getState().notifications).toMatchSnapshot()
    })
  })
})
