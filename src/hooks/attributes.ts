import { useDispatch, useSelector } from 'react-redux'
import { setAttrs, updateAttrs } from '~/modules/attributes/actions'
import {
  setInteractionAttributes,
  setInitialSelectedAttributes,
} from '~/modules/interaction/actions'
import { AttrKeys } from '~/types/attributes'
import { getAttributes } from '~/modules/attributes/selectors'

export const useGetAllAttributes = () => {
  const dispatch = useDispatch()
  const getAttributes = () => {
    try {
      const attributes = {
        name: [
          { id: 'abc1', value: 'John Smith' },
          { id: 'abc2', value: 'JSmith' },
        ],
        email: [{ id: 'abc3', value: 'johnsmith@example.com' }],
      }
      dispatch(setAttrs(attributes))
    } catch (err) {
      console.warn('Failed getting verifiable credentials')
    }
  }

  return getAttributes
}

export const useSetInteractionAttributes = () => {
  const dispatch = useDispatch()
  const attributes = useSelector(getAttributes)
  const updateInteractionAttributes = () => {
    // this will happen on Credentail Share flow
    const requestedAttributes = ['number', 'email']
    const interactionAttributues = requestedAttributes.reduce((acc, v) => {
      acc[v] = attributes[v] || []
      return acc
    }, {})
    dispatch(setInteractionAttributes(interactionAttributues))

    const selectedAttributes = Object.keys(interactionAttributues).reduce(
      (acc, v) => {
        if (!acc[v]) {
          acc[v] = interactionAttributues[v].length
            ? interactionAttributues[v][0].id
            : ''
        }
        return acc
      },
      {},
    )
    dispatch(setInitialSelectedAttributes(selectedAttributes))
  }

  return updateInteractionAttributes
}

const getId = () => '_' + Math.random().toString(36).substr(2, 9)
export const useCreateAttributes = () => {
  const dispatch = useDispatch()
  const createSelfIssuedCredential = async (
    attributeKey: AttrKeys,
    value: string,
  ) => {
    const id = getId()
    const attribute = { id, value }
    dispatch(updateAttrs({ attributeKey, attribute }))
  }

  return {
    addEmail: () =>
      createSelfIssuedCredential(AttrKeys.email, 'johns@example.com'),
    addName: () => createSelfIssuedCredential(AttrKeys.name, 'John Smith'),
  }
}
