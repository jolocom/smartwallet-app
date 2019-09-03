import React from 'react'
import { Modal, Text, TouchableHighlight, View } from 'react-native'
import { Container } from 'src/ui/structure'
import QRCode from 'react-native-qrcode-svg'
import { white } from '../../../styles/colors'
import { LabeledShard } from '../container/receivedShards'

interface Props {
  modalOpen: boolean
  selectedShard: string | LabeledShard
  closeModal: () => void
}

export const ShardModal: React.FunctionComponent<Props> = ({
  modalOpen,
  selectedShard,
  closeModal,
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
            height: '70%',
            width: '80%',
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: white,
            borderWidth: 2,
            borderRadius: 5,
          }}
        >
          <Text style={{ marginBottom: 20 }}>
            {typeof selectedShard === 'string'
              ? 'Ask a Friend to scan this QR-Code!'
              : `Share this with ${selectedShard.label}`}
          </Text>
          <QRCode
            backgroundColor={'white'}
            size={250}
            value={
              'shard:' +
              (typeof selectedShard == 'string'
                ? selectedShard
                : selectedShard.value)
            }
          />
          <TouchableHighlight
            style={{ marginTop: 50, padding: 20 }}
            onPress={() => closeModal()}
          >
            <Text>Dismiss</Text>
          </TouchableHighlight>
        </View>
      </Container>
    </View>
  </Modal>
)
