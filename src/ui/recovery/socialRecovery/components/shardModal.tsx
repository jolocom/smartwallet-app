import React from 'react'
import { Modal, Text, TouchableHighlight, View } from 'react-native'
import { Container } from 'src/ui/structure'
import QRCode from 'react-native-qrcode-svg'
import { white } from '../../../../styles/colors'
import { Colors } from '../../../../styles'
import { ShardEntity } from '../../../../lib/storage/entities/shardEntity'

interface Props {
  modalOpen: boolean
  selectedShard: ShardEntity
  closeModal: () => void
  deleteShard?: () => void
  isOwnShard?: boolean
}

export const ShardModal: React.FunctionComponent<Props> = ({
  modalOpen,
  selectedShard,
  closeModal,
  deleteShard,
  isOwnShard,
}) => (
  <Modal
    animationType="fade"
    transparent={true}
    visible={!!selectedShard && modalOpen}
  >
    <View style={{ marginTop: 22 }}>
      <Container>
        <View
          style={{
            backgroundColor: white,
            height: '80%',
            width: '80%',
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: white,
            borderWidth: 2,
            borderRadius: 5,
          }}
        >
          <Text style={{ marginBottom: 20 }}>
            {isOwnShard
              ? 'Ask a Friend to scan this QR-Code!'
              : `Share this with ${selectedShard.label}`}
          </Text>
          <QRCode
            backgroundColor={'white'}
            size={250}
            value={
              (isOwnShard ? 'share-shard:' : 'collect-shard:') +
              selectedShard.value
            }
          />
          {isOwnShard && (
            <TouchableHighlight
              style={{
                marginTop: 50,
                padding: 15,
                backgroundColor: Colors.purpleMain,
                borderRadius: 5,
              }}
              onPress={() => {
                if (deleteShard) deleteShard()
                return closeModal()
              }}
            >
              <Text>{'Sharing Complete (Delete this part)'}</Text>
            </TouchableHighlight>
          )}
          <TouchableHighlight
            style={{ marginTop: 5, padding: 15 }}
            onPress={() => closeModal()}
          >
            <Text>{'Dismiss'}</Text>
          </TouchableHighlight>
        </View>
      </Container>
    </View>
  </Modal>
)
