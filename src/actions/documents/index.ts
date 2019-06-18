import { navigationActions } from '..'
import { routeList } from 'src/routeList'
import { DecoratedClaims } from 'src/reducers/account'
import { ThunkActionCreator } from 'src/store'

export const SET_DOC_DETAIL = 'SET_SELECTED_DOCUMENT_DETAIL'
export const CLEAR_DOC_DETAIL = 'CLEAR_SELECTED_DOCUMENT_DETAIL'

export const setSelectedDocument = (document: DecoratedClaims) => ({
  type: SET_DOC_DETAIL,
  value: document,
})

export const clearSelectedDocument = () => ({
  type: CLEAR_DOC_DETAIL,
})

export const openDocumentDetails: ThunkActionCreator = (
  document: DecoratedClaims,
) => async dispatch => {
  dispatch(setSelectedDocument(document))
  dispatch(
    navigationActions.navigate({
      routeName: routeList.DocumentDetails,
    }),
  )
}
