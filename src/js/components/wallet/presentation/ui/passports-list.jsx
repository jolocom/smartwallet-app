import React from 'react'
import Radium from 'radium'

import {List} from 'material-ui'
import {SocialPersonIcon, SocialCake} from 'material-ui/svg-icons'

import {StaticListItem} from './'

const PassportsList = (props) => {
  const {passports} = props
  if (!props.passports) return null

  return (<List style={{padding: '0'}} disabled>
    {
      passports.map(({number, surname, givenName, birthDate, gender}) => (<List
        key={`passport_${number}`}>
        <StaticListItem
          key={`passportnumber_${number}`}
          textLabel="passport number"
          textValue={number} />
        <StaticListItem
          key={`surname_${number}`}
          icon={SocialPersonIcon}
          textLabel="Surname"
          textValue={surname} />
        <StaticListItem
          key={`givenName_${number}`}
          textLabel="Given Name"
          textValue={givenName} />
        <StaticListItem
          key={`dateofbirth_${number}`}
          icon={SocialCake}
          textLabel="Date of Birth"
          textValue={birthDate} />
        <StaticListItem
          key={`gender_${number}`}
          textLabel="Gender"
          textValue={gender} />
      </List>))
    }
  </List>)
}

PassportsList.propTypes = {
  passports: React.PropTypes.array.isRequired
}

export default Radium(PassportsList)
