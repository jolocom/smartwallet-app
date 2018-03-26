import {AnyAction} from 'redux'

export const setLoadingMsg = (loadingMsg: string) => {
  return {
    type: 'SET_LOADING_MSG',
    value: loadingMsg
  }
}

export const startLoading = (loading: boolean) => {
  return {
    type: 'START_LOADING',
    value: loading
  }
}

export const finishLoading = (loading: boolean) => {
  return {
    type: 'FINISH_LOADING',
    value: loading
  }
}

export const generateAndEncryptKeyPairs = () => {
  return (dispatch: (actions: AnyAction) => void) => {
    dispatch(startLoading(true))
  }
}
