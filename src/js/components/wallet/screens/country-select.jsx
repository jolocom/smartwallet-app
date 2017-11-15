import React from 'react'
import {connect} from 'redux_state/utils'
import Presentation from '../presentation/country-select'

@connect({
  props: ['wallet.country'],
  actions: [
    'wallet/country-select:setCountryValue',
    'wallet/country-select:cancel',
    'wallet/country-select:submit',
    'wallet/country-select:setFocusedField'
  ]
})
export default class CountrySelectScreen extends React.Component {
  static propTypes = {
    setCountryValue: React.PropTypes.func.isRequired,
    submit: React.PropTypes.func.isRequired,
    cancel: React.PropTypes.func.isRequired,
    country: React.PropTypes.object.isRequired,
    setFocusedField: React.PropTypes.any
  }

  setFocusedElements = (key, group) => {
    if (key === '') {
      return this.props.setFocusedField('', '')
    }
    return this.props.setFocusedField(key, group)
  }

  render() {
    const {setCountryValue, submit, cancel} = this.props
    const {options, value, focusedField, focusedGroup} = this.props.country

    return (<Presentation
      value={value}
      countries={options}
      change={setCountryValue}
      submit={(value) => {
        setCountryValue(value)
        submit()
      }}
      cancel={cancel}
      focusedGroup={focusedGroup}
      focusedField={focusedField}
      setFocused={(...args) => { this.setFocusedElements(...args) }} />)
  }
}
