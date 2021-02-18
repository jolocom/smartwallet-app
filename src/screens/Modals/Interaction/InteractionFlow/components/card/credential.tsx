import React from 'react';
import { StyleSheet, View, Image } from "react-native";

import JoloText, { JoloTextKind, JoloTextWeight } from "~/components/JoloText"
import { Colors } from "~/utils/colors";
import BP from '~/utils/breakpoints';
import { debugView } from '~/utils/dev';
import { IWithCustomStyle } from '~/components/Card/types';

export const CardImage: React.FC = ({children}) => <View style={styles.cardImage} children={children} />

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

const styles = StyleSheet.create({
  cardImage: {
    width: 368,
    height: 232,
    backgroundColor: Colors.white,
    borderRadius: 14,
  },
  headerContainer: {
    // ...debugView(),
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20
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
    width: 105,
    height: 105,
    borderRadius: 105/2,
    zIndex: 100
  },
  highlight: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: Colors.black,
    height: 50,
    width: '100%',
    paddingHorizontal: 20,
    borderBottomLeftRadius: 13,
    borderBottomRightRadius: 13,
    zIndex: 0
  },
  fieldGroup: {
    textAlign: 'left',
    alignItems: 'flex-start'
  },
  otherContainer: {
    width: '73%',
    height: '100%',
    ...debugView()
  }
})