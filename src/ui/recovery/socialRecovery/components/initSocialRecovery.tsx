import React from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'
import { Container, JolocomButton } from 'src/ui/structure'
import { Colors, Spacing, Typography } from 'src/styles'
import { largeText } from '../../../../styles/typography'
import { sandLight, white } from '../../../../styles/colors'

interface Props {
  amountOfShards: number
  threshold: number
  shardEntropy: () => void
  onAmountChange: (e: string) => void
  onThresholdChange: (e: string) => void
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: Colors.blackMain,
    padding: '5%',
  },
  header: {
    ...largeText,
    margin: Spacing.XL,
  },
  note: {
    ...Typography.noteText,
    ...Typography.centeredText,
  },
  phraseSection: {
    flex: 1,
  },
  seedPhrase: {
    ...Typography.largeText,
    ...Typography.centeredText,
  },
  buttonSection: {
    marginTop: 'auto',
  },
})
const textInput = (
  value: number,
  label: string,
  onChange: (e: string) => void,
) => (
  <View
    style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '60%',
    }}
  >
    <Text style={{ color: sandLight }}>{label + ':'}</Text>
    {
      // @ts-ignore
      <TextInput
        style={{ color: white }}
        textAlign={'center'}
        value={value.toString()}
        underlineColorAndroid={sandLight}
        keyboardType={'numeric'}
        onChangeText={onChange}
      />
    }
  </View>
)

export const InitSocialRecoveryComponent: React.FunctionComponent<Props> = ({
  amountOfShards,
  threshold,
  shardEntropy,
  onAmountChange,
  onThresholdChange,
}) => {
  return (
    <Container style={styles.container}>
      <Text style={styles.header}>Social Recovery</Text>
      <Text style={styles.note}>
        We will create recovery parts that you can share with your friends. In
        case of recovery you can recollect this parts to recover your identity.
        To increase the fault tolerance of the system not all parts are required
        for recovery.
      </Text>
      <Text style={[styles.note, { marginBottom: 20 }]}>
        We recommend to create at least 5 parts with 3 parts required for
        recovery.
      </Text>
      {textInput(amountOfShards, 'Overall amount of parts', onAmountChange)}
      {textInput(threshold, 'Parts required to recover', onThresholdChange)}

      <View style={{ flex: 2 }} />
      <JolocomButton text={'Initialize'} onPress={shardEntropy} />
    </Container>
  )
}
