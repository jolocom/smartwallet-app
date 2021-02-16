import React, { Children, useRef } from 'react';
import { StyleSheet, View, Image } from "react-native";

import JoloText, { JoloTextKind, JoloTextWeight } from "~/components/JoloText"
import { Colors } from "~/utils/colors";
import { debugView } from "~/utils/dev";
import BP from '~/utils/breakpoints';
import { TextLayoutEvent } from '~/components/Card/Field';

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

const handleChildren = (hasHighlight = false) => {
  let numberLinesFirstValue = 0;
  let calculatedLines = false;
  return (child, idx) => {
    switch (idx) {
      case 0: {
        return child;
      }
      case 1: {
        return React.cloneElement(child, {
          onTextLayout: (e: TextLayoutEvent) => {
            if (!calculatedLines) {
              numberLinesFirstValue += e.nativeEvent.lines.length;
              calculatedLines = true;
            }
          },
          numberOfLines: 2
        })
      }
      case 2: {
        if (hasHighlight) return null
        else return child
      }
      case 3: {
        if (hasHighlight) return null
        else return React.cloneElement(child, {
          // numberOfLines: calculatedLines && numberLinesFirstValue > 1 ? 1 : 2,
          numberOfLines: 1,
        })
      }
      default: return null
    }
  }
}

export const BodyFieldsContainer: React.FC = ({ children, isStretched, hasHighlight }) => {
  const childrenToDisplay = Children.map(children, handleChildren(hasHighlight))
  
  return (
    <View style={[styles.bodyFieldsContainer, {flex: isStretched ? 1 : 0.68, paddingRight: isStretched ? 20 : 0}]} children={childrenToDisplay} />
  )
}

export const BodyImageContainer: React.FC = () => {
  return (
    <View style={styles.bodyImageContainer} />
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
}
})