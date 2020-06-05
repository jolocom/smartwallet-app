import React from 'react'
import { useDispatch } from 'react-redux'

import { setLoader, dismissLoader } from '~/modules/loader/actions'
import { LoaderTypes } from '~/modules/loader/types'

import ScreenContainer from '~/components/ScreenContainer'
import Header, { HeaderSizes } from '~/components/Header'
import Btn from '~/components/Btn'

import useRedirectTo from '~/hooks/useRedirectTo'
import { ScreenNames } from '~/types/screens'
import { strings } from '~/translations/strings'
import useDelay from '~/hooks/useDelay'

const Claims: React.FC = () => {
  const dispatch = useDispatch()
  const openLoader = async () => {
    dispatch(
      setLoader({
        type: LoaderTypes.default,
        msg: strings.MATCHING,
      }),
    )
    await useDelay(
      () =>
        dispatch(
          setLoader({
            type: LoaderTypes.error,
            msg: strings.FAILED,
          }),
        ),
      2000,
    )
    await useDelay(() => dispatch(dismissLoader()), 10000)
  }

  const openScanner = useRedirectTo(ScreenNames.Interactions)

  return (
    <ScreenContainer>
      <Header size={HeaderSizes.large}>Claims</Header>
      <Btn onPress={openLoader}>Open loader</Btn>
      <Btn onPress={openScanner}>Open scanner</Btn>
    </ScreenContainer>
  )
}

export default Claims
