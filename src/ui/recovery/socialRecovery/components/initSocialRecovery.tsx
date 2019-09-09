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
    <Text style={{ color: white }}>{label + ':'}</Text>
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
      <Text style={styles.header}>Initialize Social Recovery</Text>
      <Text style={styles.note}>
        Your Identity will be sharded into several shards. You need to share
        this shards with your friends. In case of recovery you need to collect
        only a part of the shards you distributed before. The threshold defines
        how many shards are needed to recovery your identity. We suggest to
        create 5 shards with a threshold of 3.
      </Text>
      {textInput(amountOfShards, 'Amount of shards', onAmountChange)}
      {textInput(threshold, 'Threshold', onThresholdChange)}

      <View style={{ flex: 2 }} />
      <JolocomButton text={'Initialize'} onPress={shardEntropy} />
    </Container>
  )
}
