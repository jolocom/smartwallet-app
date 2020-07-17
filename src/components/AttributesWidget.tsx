import React, { useReducer } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native'

import Paragraph, { ParagraphSizes } from './Paragraph'
import { strings } from '~/translations/strings'
import { Colors } from '~/utils/colors'
import { CloseIcon } from '~/assets/svg'

enum AttrActions {
  toggle,
}

interface Action {
  type: AttrActions
  payload: any // todo: add guards
}

enum Attributes {
  name,
  email,
  phone,
}
interface AttributeI {
  val: string
  isSelected: boolean
}

interface AttributesI<T> {
  [key: string]: T[]
}

interface PropsI {
  isSelectable?: boolean
  onSelect?: (value: string) => void
  containerComponent: React.FC
  attributes: AttributesI<string>
}

const getMappedAttrubited = (attributes: AttributesI<string>) =>
  Object.keys(attributes).reduce((acc, val) => {
    acc[val] = attributes[val].map((attr) => ({
      val: attr,
      isSelected: false,
    }))
    return acc
  }, {} as AttributesI<AttributeI>)

const toggleAttrValue = (
  attributeKey: Attributes,
  attributeSelectedValue: string,
) => ({
  type: AttrActions.toggle,
  payload: { attributeKey, attributeSelectedValue },
})

const reducer = (state: AttributesI<AttributeI>, action: Action) => {
  switch (action.type) {
    case AttrActions.toggle:
      const updatedAttr = state[action.payload.attributeKey].map((attr) =>
        attr.val === action.payload.attributeSelectedValue
          ? { ...attr, isSelected: !attr.isSelected }
          : attr,
      )
      return {
        ...state,
        [action.payload.attributeKey]: updatedAttr,
      }
    default:
      return state
  }
}

// 🚨 - write good guards
// type: isSelectable (onSelect, value, isSelected) / isStatic (value) / isEmpty
const Field = ({ type, value, isSelected, onSelect }) => {
  switch (type) {
    case 'isSelectable':
      return (
        <TouchableWithoutFeedback onPress={onSelect}>
          <View style={styles.field}>
            <Paragraph>{value}</Paragraph>
            {isSelected ? (
              <View style={[styles.radio, styles.selected]} />
            ) : (
              <View style={[styles.radio, styles.notSelected]} />
            )}
          </View>
        </TouchableWithoutFeedback>
      )
    case 'isStatic':
      return (
        <View style={styles.field}>
          <Paragraph>{value}</Paragraph>
        </View>
      )
    case 'isEmpty':
      return (
        <TouchableOpacity style={styles.field}>
          <Paragraph color={Colors.error}>{strings.MISSING_INFO}*</Paragraph>
        </TouchableOpacity>
      )
    default:
      return null
  }
}

const AttributesWidget: React.FC<PropsI> = ({
  isSelectable = false,
  onSelect = () => {},
  containerComponent: ContainerComponent,
  attributes,
}) => {
  console.log(getMappedAttrubited(attributes))

  const [state, dispatch] = useReducer(reducer, getMappedAttrubited(attributes))
  console.log({ state })

  return (
    <ContainerComponent>
      {Object.keys(state).map((sectionKey) => {
        const section = state[sectionKey]
        return (
          <View style={styles.attrSection} key={sectionKey}>
            <Header sectionKey={sectionKey} />
            {section.length ? (
              <>
                {section.map((entry) => {
                  return isSelectable ? (
                    <Field
                      key={entry.val}
                      type="isSelectable"
                      value={entry.val}
                      isSelected={entry.isSelected}
                      onSelect={() =>
                        dispatch(toggleAttrValue(sectionKey, entry.val))
                      }
                    />
                  ) : (
                    <Field key={entry.val} type="isStatic" value={entry.val} />
                  )
                })}
              </>
            ) : (
              <Field type="isEmpty" />
            )}
          </View>
        )
      })}
    </ContainerComponent>
  )
}

interface HeaderPropsI {
  sectionKey: string
}

const Header: React.FC<HeaderPropsI> = ({ sectionKey }) => {
  return (
    <View style={styles.header}>
      <Paragraph color={Colors.white70} customStyles={{ opacity: 0.6 }}>
        {strings[sectionKey.toUpperCase()]}
      </Paragraph>
      <TouchableOpacity style={styles.createNewBtn}>
        <View style={styles.plus}>
          <CloseIcon />
        </View>
        <Paragraph>{strings.CREATE_NEW_ONE}</Paragraph>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  attrSection: {
    marginBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  field: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 23,
    backgroundColor: Colors.black,
    borderRadius: 8,
    height: 50,
    marginVertical: 4,
  },
  createNewBtn: {
    flexDirection: 'row',
  },
  plus: {
    transform: [{ rotate: '45deg' }, { scale: 0.7 }],
    marginRight: 13,
    marginTop: 2,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  notSelected: {
    borderColor: Colors.white45,
    opacity: 0.3,
    borderWidth: 1,
  },
  selected: {
    backgroundColor: Colors.success,
  },
})

export default AttributesWidget
