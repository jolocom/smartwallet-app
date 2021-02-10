// Tag object type
export type TagObject = {
  title: string // tag title
  tlX?: number // top left x coordinate
  tlY?: number // top left y coordinate
  brX?: number // bottom right x coordinate
  brY?: number // bottom right y coordinate
  isBeingDragged?: boolean // whether the tag is currently being dragged or not
}

// PanResponder's gesture state type
export type GestureState = {
  dx: number // accumulated distance of the gesture since the touch started
  dy: number // accumulated distance of the gesture since the touch started
  moveX: number // the latest screen coordinates of the recently-moved touch
  moveY: number // the latest screen coordinates of the recently-moved touch
  numberActiveTouches: number // Number of touches currently on screen
  stateID: number // ID of the gestureState- persisted as long as there at least one touch on screen
  vx: number // current velocity of the gesture
  vy: number // current velocity of the gesture
  x0: number // the screen coordinates of the responder grant
  y0: number // the screen coordinates of the responder grant
}
