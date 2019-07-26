import * as React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { JolocomTheme } from 'src/styles/jolocom-theme'
const styles = StyleSheet.create({
  selector: {
    width: 109,
    height: 32,
    borderRadius: 4,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#942f51',
    margin: 10,
  },
  text: {
    textAlign: 'center',
    lineHeight: 26,
    color: JolocomTheme.primaryColorSand,
    fontSize: JolocomTheme.labelFontSize,
    fontFamily: JolocomTheme.contentFontFamily,
  },
})

interface PlaceholderProps {
  i: number
  onPress: (key: number) => void
  sorting: {}
}

const Placeholder = ({ i, onPress, sorting }: PlaceholderProps) => (
  <TouchableOpacity style={styles.selector} onPress={() => onPress(i)}>
    <Text style={styles.text}>{sorting[i] ? sorting[i] : i + 1 + '.'}</Text>
  </TouchableOpacity>
)

export default Placeholder
