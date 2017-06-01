import React from 'react'
import Radium from 'radium'
import {ListItem, List, TextField} from 'material-ui'
import {ActionSearch, NavigationArrowBack} from 'material-ui/svg-icons'

import {EditListItem} from './ui'
import {theme} from 'styles'

@Radium
export default class CountrySelectPresentation extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    showErrors: React.PropTypes.bool,
    countries: React.PropTypes.Object,
    submit: React.PropTypes.func,
    change: React.PropTypes.func,
    value: React.PropTypes.string,
    cancel: React.PropTypes.func
  }

  render() {
    const {countries, submit, cancel, change, value} = this.props
    const firstLetter = countries.map((e, i) =>
      (i === 0 || (e[0] !== countries[i - 1][0])) ? e[0] : ''
    )
    return (<div>
      <div style={{textColor: theme.palette.textColor}}>
        <NavigationArrowBack style={{width: '5%'}} onClick={cancel} />
        <TextField
          style={{width: '90%', textColor: theme.palette.textColor}}
          floatingLabelText="Country"
          onChange={e => change(e.target.value)}
          value={value} />
        <ActionSearch style={{width: '5%'}} />
      </div>
        {countries.map((e, i) => (<div
          style={{width: '100%'}}
          onClick={() => submit(e)} >
          <TextField
            value={firstLetter[i]}
            style={{width: '5%', textAlign: 'center'}} />
          <TextField
            onClick={() => submit(e)}
            style={{width: '95%'}} value={e} />
        </div>))}

    </div>)
  }
}
