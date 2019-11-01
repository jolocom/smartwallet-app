import {
  CLEAR_NOTIFICATIONS,
  notificationsReducer as reducer,
  REMOVE_NOTIFICATION,
  SCHEDULE_NOTIFICATION,
} from 'src/reducers/notifications/'
import {
  clearAllNotifications,
  infoNotification,
  removeNotification,
  scheduleNotification,
} from '../../../src/actions/notifications'

describe('notifications reducer', () => {
  it('should initialize correctly', () => {
    expect(reducer([], { type: '@INIT' })).toEqual([])
  })

  const testNotification = infoNotification({
    title: 'Test Title',
    message: 'Test Message',
  })

  it(`should correctly handle the ${SCHEDULE_NOTIFICATION} action `, () => {
    const state = reducer([], scheduleNotification(testNotification))
    expect(state.length).toEqual(1)
    expect(state[0]).toStrictEqual(testNotification)
  })

  it(`should correctly handle the ${REMOVE_NOTIFICATION} action `, () => {
    const state = reducer(
      [testNotification],
      removeNotification(testNotification),
    )
    expect(state.length).toEqual(0)
    const stillEmpty = reducer(state, removeNotification(testNotification))
    expect(stillEmpty.length).toEqual(0)
  })

  it(`should correctly handle the ${CLEAR_NOTIFICATIONS} action `, () => {
    expect(
      reducer(
        [testNotification, testNotification, testNotification],
        clearAllNotifications(),
      ),
    ).toEqual([])
  })
})
