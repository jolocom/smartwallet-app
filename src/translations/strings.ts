const loaderMsgs = {
  CREATING: 'Creating your personal secret number',
  MATCHING: 'Matching two instances',
  SUCCESS: 'Success!',
  FAILED: 'Failed',
  LOADING: 'Loading',
  EMPTY: '',
}

const entropy = {
  SET_UP_YOUR_IDENTITY: 'Set up your identity',
  TAP_THE_SCREEN_AND_DRAW_RANDOMLY_ON_IT_UNTIL_YOU_COLLECT_100:
    'Tap the screen and draw randomly on it until you collect 100%',
}

export const strings = {
  ...loaderMsgs,
  ...entropy,
  // ErrorBoundary
  UNKNOWN_ERROR: 'Unknown Error',
  AND_IF_THIS_IS_NOT_THE_FIRST_TIME_WE_STRONGLY_RECOMMEND_LETTING_US_KNOW:
    'And if this is not the first time we strongly recommend letting us know',
  CLOSE: 'Close',
}
