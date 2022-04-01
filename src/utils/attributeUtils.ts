import { ClaimEntry } from "@jolocom/protocol-ts";
import { attributeConfig } from "~/config/claims";
 import { AttributeI } from "~/modules/attributes/types";
 import { AttributeTypes, ClaimKeys } from "~/types/credentials";

const attrObjToAttrMap = (type: AttributeTypes, attribute: AttributeI): AttributeI<Map<ClaimKeys, ClaimEntry>> => {
   return {
     ...attribute,
     value: attributeConfig[type].fields.reduce((acc, v) => {
       acc.set(v.key, attribute.value[v.key])
       return acc;
      }, new Map())      
      
    }
  }
  /**
   * A util function to preserve order of claim properties
   */
  export const getAttributeValueBasedOnConfig = (type: AttributeTypes, values: AttributeI[]): Array<AttributeI<Map<ClaimKeys, ClaimEntry>>> => {
    return values.map(value => attrObjToAttrMap(type, value))
  }
  

const concat = (mapFn: (e: AttributeI<Map<ClaimKeys, ClaimEntry>>['value'], type: AttributeTypes) => ClaimEntry) => {
  return (type: AttributeTypes, attribute: AttributeI<Map<ClaimKeys, ClaimEntry>>) => {
    const joinedValues = mapFn(attribute.value, type)
    return {
      ...attribute,
      value: joinedValues
    }
  }
}
export const concatValuesIdentity = concat((attributeValue: AttributeI<Map<ClaimKeys, ClaimEntry>>['value'], type: AttributeTypes) => {
  // NOTE: address returns an array to allow line break for each value 
  if(type === AttributeTypes.postalAddress) {
    return Array.from(attributeValue.values()).map(v => (v ? v.toString() : ''));
  } else {
    return Array.from(attributeValue.values()).reduce((acc, v) => {
      acc += `${v} `
      return acc;
    }, '')
  }
})

export const concatValuesShare = concat((attributeValue: AttributeI<Map<ClaimKeys, ClaimEntry>>['value'], type: AttributeTypes) => {
  return Array.from(attributeValue.values()).reduce((acc, v, idx, array) => {
    if(type === AttributeTypes.name) {
      acc += `${v} `
    } else {
      acc += `${v}${array.length - 1 === idx ? '' : ', '}`
    }
    return acc;
  }, '')
})
