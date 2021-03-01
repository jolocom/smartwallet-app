import React from 'react';
import { StyleSheet, View } from "react-native";

import JoloText, { JoloTextWeight } from "~/components/JoloText"
import { Colors } from "~/utils/colors";
import BP from '~/utils/breakpoints';
import { IWithCustomStyle } from '~/components/Card/types';
import { JoloTextSizes } from '~/utils/fonts';
import { debugView } from '~/utils/dev';

const PADDING_BASE = 20;
const PADDING_SMALL = 15;

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

export const HelperDescription: React.FC = ({ children }) => {
  return (
    <JoloText
      weight={JoloTextWeight.regular}
      size={JoloTextSizes.tiniest}
      style={{ fontSize: 14, alignSelf: 'flex-start' }}
      color={Colors.black50}
    >
      {children}
    </JoloText>
  )
}

export const FieldPlaceholder = () => {
  return (
    <View style={styles.fieldPlaceholder} />
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    // ...debugView(),
    alignItems: 'flex-start',
    paddingHorizontal: BP({default: PADDING_BASE, xsmall: PADDING_SMALL}),
    paddingTop: 10,
  },
  bodyContainer: {
    // ...debugView(),
    flexDirection: 'row',
    paddingBottom: BP({default: PADDING_BASE, xsmall: PADDING_SMALL}),
  },
  bodyFieldsContainer: {
    flex: 0.68,
    // ...debugView(),
    alignItems: 'flex-start',
    paddingLeft: BP({default: PADDING_BASE, xsmall: PADDING_SMALL}),
  },
  bodyImageContainer: {
    flex: 0.32,
    // ...debugView(),
    alignItems: 'flex-start',
    paddingRight: BP({default: PADDING_BASE, xsmall: PADDING_SMALL}),
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
    paddingHorizontal: BP({default: PADDING_BASE, xsmall: PADDING_SMALL}),
    alignItems: 'flex-start'
  },
  fieldPlaceholder: {
    width: 156, // TODO: update to value from the designs
    height: 20,
    borderRadius: 5,
    backgroundColor: Colors.alto
  },
})