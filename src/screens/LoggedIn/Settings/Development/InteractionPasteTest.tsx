import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { SDKError } from 'react-native-jolocom'
import Btn from '~/components/Btn'
import Input from '~/components/Input'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import ScreenContainer from '~/components/ScreenContainer'
import { useInteractionStart } from '~/hooks/interactions/handlers'
import { ScreenNames } from '~/types/screens'
import { Colors } from '~/utils/colors'

const DEFAULT_TOKEN = ''

const InteractionPasteTest = () => {
  const [token, setToken] = useState(DEFAULT_TOKEN)
  const [error, setError] = useState('')

  const navigation = useNavigation()

  const { startInteraction } = useInteractionStart()

  const handleTokenSubmit = async () => {
    if (!token) setError('Please paste interaction token')
    try {
      await startInteraction(token)
      setToken(DEFAULT_TOKEN)
      navigation.navigate(ScreenNames.Interaction)
    } catch (e) {
      if (e instanceof SyntaxError) {
        setError(SDKError.codes.ParseJWTFailed)
      } else if (e.message === 'Token expired') {
        setError(SDKError.codes.TokenExpired)
      } else {
        setError(SDKError.codes.Unknown)
      }
      console.warn({ e })
    }
  }

  useEffect(() => {
    setError('')
  }, [token])

  return (
    <ScreenContainer
      hasHeaderBack
      customStyles={{ justifyContent: 'flex-start' }}
    >
      <Input.TextArea
        value={token}
        updateInput={setToken}
        placeholder="Paste interaction token here"
      />
      {error ? (
        <JoloText
          kind={JoloTextKind.subtitle}
          color={Colors.error}
          children={error}
        />
      ) : null}
      <Btn onPress={handleTokenSubmit}>Process</Btn>
    </ScreenContainer>
  )
}

export default InteractionPasteTest
