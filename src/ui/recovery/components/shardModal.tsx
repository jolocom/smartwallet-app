import React from 'react'
import { Modal, Text, TouchableHighlight, View } from 'react-native'
import { Container } from 'src/ui/structure'
import QRCode from 'react-native-qrcode-svg'
import { blackMain, white } from '../../../styles/colors'

interface Props {
  modalOpen: boolean
  selectedShard: string
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
            backgroundColor: blackMain,
            height: '60%',
            width: '70%',
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: white,
            borderWidth: 2,
            borderRadius: 5,
          }}
        >
          <Text style={{ color: 'white', marginBottom: 20 }}>
            {'Ask a Friend to scan this QR-Code!'}
          </Text>
          <QRCode size={200} value={selectedShard} />
          <TouchableHighlight
            style={{ marginTop: 50, padding: 20 }}
            onPress={() => closeModal()}
          >
            <Text style={{ color: white }}>Dismiss</Text>
          </TouchableHighlight>
        </View>
      </Container>
    </View>
  </Modal>
)
