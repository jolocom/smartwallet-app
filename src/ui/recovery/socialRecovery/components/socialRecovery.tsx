import React from 'react'
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import { Container } from 'src/ui/structure'
import { Colors, Spacing, Typography } from 'src/styles'
import { largeText } from '../../../../styles/typography'
import { ShardModal } from './shardModal'
import { ShardEntity } from '../../../../lib/storage/entities/shardEntity'

interface Props {
  shards: ShardEntity[]
  shardsCreated: boolean
  modalOpen: boolean
  selectedShard?: ShardEntity
  toggleModal: (shardId?: number) => void
  openReceivedShards: () => void
  deleteShard: (shard: ShardEntity) => void
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
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

export const SocialRecoveryComponent: React.FunctionComponent<Props> = ({
  shards,
  modalOpen,
  shardsCreated,
  selectedShard,
  toggleModal,
  openReceivedShards,
  deleteShard,
}) => {
  const setupCompleted = shardsCreated && shards.length === 0
  return (
    <Container style={styles.container}>
      <Text style={styles.header}>Distribute Shards</Text>
      {shards.map((shard, i) => (
        <View
          key={i}
          style={{ width: '100%' }}
          onTouchEnd={() => toggleModal(i)}
        >
          <View
            style={{ width: '100%', height: 1, backgroundColor: 'white' }}
          />
          <Text style={[styles.note, { margin: 20 }]}>{`Shard ${shard.id +
            1} - Tap to share`}</Text>
        </View>
      ))}
      {setupCompleted && (
        <Text style={styles.note}>Social recovery setup completed!</Text>
      )}
      {selectedShard && (
        <ShardModal
          modalOpen={modalOpen}
          selectedShard={selectedShard}
          closeModal={toggleModal}
          isOwnShard
          deleteShard={() => deleteShard(selectedShard)}
        />
      )}
      <View style={{ flex: 2 }} />
      <TouchableHighlight style={{ padding: 20 }} onPress={openReceivedShards}>
        <Text style={[styles.note]}>Help a Friend</Text>
      </TouchableHighlight>
    </Container>
  )
}
