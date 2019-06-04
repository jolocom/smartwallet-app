import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { DocumentCard } from './documentCard'
//import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { DecoratedClaims } from 'src/reducers/account'

interface DocumentsListProps {
  onDocumentPress?: (document: DecoratedClaims) => void
  documents: DecoratedClaims[]
}

const styles = StyleSheet.create({
  documentContainer: {
    paddingTop: 15,
    paddingBottom: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export const DocumentsList: React.SFC<DocumentsListProps> = (
  props,
): JSX.Element => (
  <React.Fragment>
    {props.documents.map((document, idx) => (
      <TouchableOpacity
        key={idx}
        delayPressIn={5}
        style={styles.documentContainer}
        onPress={() => props.onDocumentPress && props.onDocumentPress(document)}
      >
        <DocumentCard document={document} />
        {/* <Icon size={20} name="chevron-right" color="rgb(209, 209, 214)" /> */}
      </TouchableOpacity>
    ))}
  </React.Fragment>
)
