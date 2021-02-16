import React, { Children } from 'react';
import { StyleSheet, View, Image } from "react-native";

import JoloText, { JoloTextKind, JoloTextWeight } from "~/components/JoloText"
import { JoloTextSizes } from "~/utils/fonts";
import { Colors } from "~/utils/colors";
import { debugView } from "~/utils/dev";
import BP from '~/utils/breakpoints';

export const CardImage: React.FC = ({children}) => <View style={styles.cardImage} children={children} />

export const HeaderContainer: React.FC = ({children}) => {
  return (
    <View style={styles.headerContainer} children={children} />
  )
}

export const BodyContainer: React.FC = ({ children }) => {
  return (
    <View style={styles.bodyContainer} children={children} />
  )
}

export const BodyFieldsContainer: React.FC = ({ children }) => {
  const childrenToDisplay = Children.map(children, (child, idx) => {
    if (idx > 3) return null;
    // field label
    else if (idx / 2 === 0) return child 
    // field value: add prop number of lines; last one should only have 1 line
    else if (idx / 2 !== 0) { 
      return React.cloneElement(child, {
        numberOfLines: idx === 3 ? 1 : 2
      })
    } 
    else return child;
  })
  
  return (
    <View style={styles.bodyFieldsContainer} children={childrenToDisplay} />
  )
}

export const BodyImageContainer: React.FC = ({ children }) => {
  return (
    <View style={styles.bodyImageContainer} children={children}></View>
  )
}

export const CredentialName: React.FC = ({ children }) => {
  return (
    <JoloText
      size={JoloTextSizes.big}
      weight={JoloTextWeight.regular}
      color={Colors.black80}
      customStyles={{marginTop: -5}}
      numberOfLines={1}
    >{children}</JoloText>
  )
}

export const CredentialHolderName: React.FC = ({ children }) => {
  return (
    <JoloText
      kind={JoloTextKind.title}
      color={Colors.black90}
      customStyles={{textAlign: 'left', lineHeight: BP({default: 28, xsmall: 24})}}
      numberOfLines={2}
    >
      {children}
    </JoloText>
  )
}

export const FieldLabel: React.FC = ({ children }) => {
  return (
    <JoloText
      kind={JoloTextKind.title}
      size={JoloTextSizes.tiniest}
      weight={JoloTextWeight.regular}
      color={Colors.black50}
      customStyles={{marginTop: -5}}
      numberOfLines={1}
    >
      {children}
    </JoloText>
  )
}

// TODO: should support scaling 
export const FieldValue: React.FC = ({ children, ...props }) => {
  console.log({props});
  
  return (
    <JoloText
      kind={JoloTextKind.title}
      size={JoloTextSizes.mini}
      weight={JoloTextWeight.regular}
      color={Colors.black}
      customStyles={{ marginTop: -7, textAlign: 'left', lineHeight: BP({default: 18, xsmall: 14}) }}
      // numberOfLines={2}
      {...props}
    >
      {children}
    </JoloText>
  )
}

export const CredentialImage: React.FC = ({ imageUrl }) => {
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



const styles = StyleSheet.create({
  cardImage: {
    width: 368,
    height: 232,
    backgroundColor: Colors.white,
    borderRadius: 14,
    // justifyContent: 'space-between'
  },
  headerContainer: {
    // ...debugView(),
    flex: 0.5,
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20
  },
  bodyContainer: {
    // ...debugView(),
    flex: 0.5,
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
    zIndex: 100,
    paddingRight: 20,
  },
  image: {
    position: 'absolute',
    bottom: 0,
    width: 105,
    height: 105,
    borderRadius: 105/2,
    zIndex: 100
  },
  highlight: {
    position: 'absolute',
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: Colors.black,
    height: 50,
    width: '100%',
    paddingHorizontal: 20,
    borderBottomLeftRadius: 13,
    borderBottomRightRadius: 13,
    zIndex: 0
  }
})