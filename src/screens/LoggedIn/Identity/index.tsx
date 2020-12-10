import React, { useState } from 'react'
import { ScrollView } from 'react-native'
import { useSelector } from 'react-redux'
import Input from '~/components/Input'
import ScreenContainer from '~/components/ScreenContainer'
import Widget from '~/components/Widget'
import { getAttributes } from '~/modules/attributes/selectors'
import Form, { IFormContext } from './components/Form'
import FormField from './components/FormField'

const Identity = () => {
  const attributes = useSelector(getAttributes)
  return <ScreenContainer></ScreenContainer>
}

export default Identity
