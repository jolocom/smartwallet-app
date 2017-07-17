import React from 'react'
import Radium from 'radium'

import {List, FlatButton} from 'material-ui'
import {SocialPersonIcon, MapsLocation, SocialCake} from 'material-ui/svg-icons'
import {theme} from 'styles'
import {StaticListItem, IconNumber} from './'

const STYLES = {
  requestBtn: {
    marginLeft: '16px'
  },
  verificationMsg: {
    color: theme.palette.accent1Color
  }
}
const IdCardsList = (props) => {
  const {idCards} = props
  if (!idCards) return null

  const fields = idCards.map(({id, idCardFields, verified, savedToBlockchain = false}, index) => (<List // eslint-disable-line max-len
    key={id}>
    <StaticListItem
      key={`idCardnumber_${id}`}
      textLabel="ID Card number"
      icon={IconNumber}
      verified={verified}
      savedToBlockchain={savedToBlockchain}
      textValue={idCardFields.number} />
    {
      savedToBlockchain
        ? <div style={{textAlign: 'right'}}>
          <FlatButton
            label="CONTACT VERIFIER"
            secondary
            style={STYLES.requestBtn}
            onClick={() => {}} />
        </div>
        : null
    }
    <StaticListItem
      key={`expirationDate_${id}`}
      textLabel="Expiration Date"
      textValue={idCardFields.expirationDate} />
    <StaticListItem
      key={`firstName_${id}`}
      icon={SocialPersonIcon}
      textLabel="First Name"
      textValue={idCardFields.firstName} />
    <StaticListItem
      key={`lastName_${id}`}
      textLabel="Last Name"
      textValue={idCardFields.lastName} />
    <StaticListItem
      key={`gender_${id}`}
      textLabel="Gender"
      textValue={idCardFields.gender} />
    <StaticListItem
      key={`dateofbirth_${id}`}
      icon={SocialCake}
      textLabel="Date of Birth"
      textValue={idCardFields.birthDate} />
    <StaticListItem
      key={`placeofbirth_${id}`}
      textLabel="Place of Birth"
      textValue={idCardFields.birthPlace} />
    <StaticListItem
      key={`countryofbirth_${id}`}
      textLabel="Country of Birth"
      textValue={idCardFields.birthCountry} />
    <StaticListItem
      key={`street_${id}`}
      icon={MapsLocation}
      textLabel="Street"
      textValue={idCardFields.physicalAddress.streetWithNumber} />
    <StaticListItem
      key={`city_${id}`}
      textLabel="City"
      textValue={idCardFields.physicalAddress.city} />
    <StaticListItem
      key={`zipCode_${id}`}
      textLabel="Zip Code"
      textValue={idCardFields.physicalAddress.zip} />
    <StaticListItem
      key={`state_${id}`}
      textLabel="State"
      textValue={idCardFields.physicalAddress.state} />
    <StaticListItem
      key={`country_${id}`}
      textLabel="Country"
      textValue={idCardFields.physicalAddress.country} />
    {
      savedToBlockchain || verified ? null : <FlatButton
        label="REQUEST VERICATION"
        secondary
        style={STYLES.requestBtn}
        onClick={() => {
          props.requestIdCardVerification({
            index,
            message: (<div>
              <b>Verification Request</b> <br />
              <br />
                Our verification service uses the latest encrypting technology
                which costs &nbsp;
              <span style={STYLES.verificationMsg}>
                 xxx to save your ID Card on the Blockchain
              </span>
            </div>),
            rightButtonLabel: 'SAVE TO BLOCACHAIN',
            leftButtonLabel: 'CANCEL'
          })
        }} />
    }
  </List>))

  return (<List style={{padding: '0'}} disabled>
    {fields}
  </List>)
}

IdCardsList.propTypes = {
  idCards: React.PropTypes.array.isRequired,
  requestIdCardVerification: React.PropTypes.func.isRequired
}

export default Radium(IdCardsList)
