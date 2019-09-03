import React from 'react'
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import { Container } from 'src/ui/structure'
import { Colors, Spacing, Typography } from 'src/styles'
import { largeText } from '../../../styles/typography'
import { ShardModal } from './shardModal'

interface Props {
  shards: string[]
  modalOpen: boolean
  selectedShard: string
  toggleModal: (shardId?: number) => void
  openReceivedShards: () => void
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    backgroundColor: Colors.blackMain,
    padding: '5%',
  },
  header: {
    ...largeText,
    margin: Spacing.XXL,
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

export const SocialRecoveryComponent: React.FunctionComponent<Props> = ({
  shards,
  modalOpen,
  selectedShard,
  toggleModal,
  openReceivedShards,
}) => (
  <Container style={styles.container}>
    <Text style={styles.header}>Distribute Shards</Text>
    {shards.map((shard, i) => (
      <View key={i} style={{ width: '100%' }} onTouchEnd={() => toggleModal(i)}>
        <View style={{ width: '100%', height: 1, backgroundColor: 'white' }} />
        <Text style={[styles.note, { margin: 20 }]}>{`Shard ${i +
          1} - Tap to share`}</Text>
      </View>
    ))}
    <ShardModal
      modalOpen={modalOpen}
      selectedShard={selectedShard}
      closeModal={toggleModal}
    />
    <View style={{ flex: 2 }} />
    <TouchableHighlight style={{ padding: 20 }} onPress={openReceivedShards}>
      <Text style={[styles.note]}>Help a Friend</Text>
    </TouchableHighlight>
  </Container>
)
