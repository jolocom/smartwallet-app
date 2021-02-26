import React from 'react';
import { StyleSheet, View, Image } from "react-native";

import JoloText, { JoloTextKind, JoloTextWeight } from "~/components/JoloText"
import { Colors } from "~/utils/colors";
import BP from '~/utils/breakpoints';
import { IWithCustomStyle } from '~/components/Card/types';

export const HeaderContainer: React.FC<IWithCustomStyle> = ({children, customStyles = {flex: 0.5}}) => {
  return (
    <View style={[styles.headerContainer, customStyles]} children={children} />
  )
}

export const BodyContainer: React.FC<IWithCustomStyle> = ({ children, customStyles = { flex: 0.5 }}) => {
  return (
    <View style={[styles.bodyContainer, customStyles]} children={children} />
  )
}

interface IBodyFieldsContainerProps {
  isStretched: boolean
}
export const BodyFieldsContainer: React.FC<IBodyFieldsContainerProps> = ({ children, isStretched }) => {
  return (
    <View style={[styles.bodyFieldsContainer, {flex: isStretched ? 1 : 0.68, paddingRight: isStretched ? 20 : 0}]} children={children} />
  )
}

export const BodyFieldsGroup: React.FC = ({ children }) => {
  return (
    <View style={styles.fieldGroup} children={children} />
  )
}

export const BodyImageContainer: React.FC = () => {
  return (
    <View style={styles.bodyImageContainer} />
  )
}

interface ICredentialHolderNameProps {
  isTruncated: boolean
}
export const CredentialHolderName: React.FC<ICredentialHolderNameProps> = ({ children, isTruncated }) => {
  return (
    <JoloText
      kind={JoloTextKind.title}
      color={Colors.black90}
      customStyles={{textAlign: 'left', lineHeight: BP({default: 28, xsmall: 24})}}
      numberOfLines={isTruncated ? 1 : 2}
    >
      {children}
    </JoloText>
  )
}

interface ICredentialImageProps {
  imageUrl: string
}
export const CredentialImage: React.FC<ICredentialImageProps> = ({ imageUrl }) => {
  return (
    <Image style={styles.image} source={{uri: imageUrl}} />
  )
}

export const CredentialHighlight: React.FC = ({ children }) => {
  return (
    <View style={styles.highlight}>
      <JoloText
        weight={JoloTextWeight.regular}
        customStyles={{ fontSize: 24, marginTop: 6 }}
        color={Colors.white}
        >
        {children}
      </JoloText>
    </View>
  )
}

export const OtherContainer: React.FC = ({children}) => {
  return <View style={styles.otherContainer} children={children} />
}

export const OtherTitleContainer: React.FC = ({children}) => {
  return <View style={{
    position: 'absolute',
    right: 25,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }} children={children} />
}


export const OtherTitle: React.FC = ({ children }) => {
  return (
    <JoloText
      weight={JoloTextWeight.regular}
      color={Colors.black50}
      customStyles={{
        fontSize: 18,
        transform: [{ rotate: '90deg' }],
      }}
    >
      {children}
    </JoloText>
  )
}

export const EmptyContainer: React.FC = ({children}) => {
  return (
    <View style={styles.emptyContainer} children={children} />
  )
}

export const HelperTitle: React.FC<IWithCustomStyle> = ({children, customStyles}) => {
  return (
    <JoloText
      weight={JoloTextWeight.regular}
      customStyles={[{ fontSize: 16, alignSelf: 'flex-start'}, customStyles]}
      color={Colors.bastille}
      >
      {children}:
    </JoloText>
  )
}

export const HelperDescription: React.FC = ({children}) => {
  return (
    <JoloText
      weight={JoloTextWeight.regular}
      style={{ fontSize: 14, alignSelf: 'flex-start' }}
      color={Colors.black50}
    >
      {children}
    </JoloText>
  )
}

export const Container: React.FC = ({ children }) => {
  return (
    <View style={styles.container} children={children} />
  )
}

export const FieldPlaceholder = () => {
  return (
    <View style={styles.fieldPlaceholder} />
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    // ...debugView()
  },
  headerContainer: {
    // ...debugView(),
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  bodyContainer: {
    // ...debugView(),
    flexDirection: 'row',
    paddingBottom: 20,
  },
  bodyFieldsContainer: {
    flex: 0.68,
    // ...debugView(),
    alignItems: 'flex-start',
    paddingLeft: 20,
  },
  bodyImageContainer: {
    flex: 0.32,
    // ...debugView(),
    alignItems: 'flex-start',
    paddingRight: 20,
  },
  image: {
    position: 'absolute',
    bottom: 18,
    right: 18,
    width: BP({default: 1, xsmall: 0.8}) * 105,
    height: BP({default: 1, xsmall: 0.8}) * 105,
    borderRadius: BP({default: 1, xsmall: 0.8}) * 105/2,
    zIndex: 100
  },
  highlight: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: Colors.black,
    height: 50,
    width: '100%',
    paddingHorizontal: 20,
    borderBottomLeftRadius: BP({default: 13, xsmall: 11}),
    borderBottomRightRadius: BP({default: 13, xsmall: 11}),
    zIndex: 0,
    marginBottom: BP({default: 0, xsmall: -1})
  },
  fieldGroup: {
    textAlign: 'left',
    alignItems: 'flex-start'
  },
  otherContainer: {
    width: '73%',
    height: '100%',
    // ...debugView()
  },
  otherTitleContainer: {
    width: '37%',
    height: '100%',
    alignItems: 'flex-start',
    justifyContent: 'center',
    // ...debugView()
  },
  emptyContainer: {
    // ...debugView(),
    paddingHorizontal: 20,
    alignItems: 'flex-start'
  },
  fieldPlaceholder: {
    width: 156, // TODO: update to value from the designs
    height: 20,
    borderRadius: 5,
    backgroundColor: Colors.alto
  }
})