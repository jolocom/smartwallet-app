import React from 'react'
import Reflux from 'reflux'
import Radium from 'radium'
import ReactDOM from 'react/lib/ReactDOM'

import {
  Paper,
  AppBar,
  IconButton,
  SelectField,
  MenuItem
} from 'material-ui'

import GraphFilters from 'components/graph/filters.jsx'
import SearchResults from './search-results.jsx'

import SearchActions from 'actions/search'
import SearchStore from 'stores/search'

let Search = React.createClass({
  mixins: [Reflux.connect(SearchStore, 'search')],

  getInitialState() {
    return {
      show: false,
      reach: 'me'
    }
  },

  contextTypes: {
    muiTheme: React.PropTypes.object
  },

  getStyles() {
    const textFieldTheme = this.context.muiTheme.textField

    let styles = {
      container: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        maxHeight: '100%',
        zIndex: 1200,
        opacity: this.state.show ? 1 : 0,
        transform: this.state.show ? 'translate(0, 0)' : 'translate(0, -100%)',
        transition: 'opacity .1s, transform .1s ease-in',
        display: 'flex',
        flexDirection: 'column'
      },
      bar: {
        backgroundColor: '#ffffff'
      },
      input: {
        tapHighlightColor: 'rgba(0,0,0,0)',
        padding: 0,
        position: 'relative',
        width: '100%',
        height: '100%',
        border: 'none',
        outline: 'none',
        backgroundColor: 'transparent',
        color: textFieldTheme.textColor,
        fontSize: '24px',
        lineHeight: '64px'
      },
      reach: {
        display: 'flex',
        height: '48px',
        padding: '0 16px',
        justifyContent: 'space-between',
        alignItems: 'center'
      },
      reachLabel: {
        marginRight: '16px'
      },
      select: {
        width: 'auto',
        flex: 1
      },
      item: {
        flex: '1',
        textAlign: 'center',
        padding: '10px'
      },
      results: {
        flex: 1,
        overflowY: 'auto',
        backgroundColor: 'rgba(255, 255, 255, 0.9)'
      }
    }

    return styles
  },

  componentDidUpdate(prevProps, prevState) {
    if (this.state.show && !prevState.show) {
      let input = ReactDOM.findDOMNode(this.refs.input)
      input.focus()
    }
  },

  show() {
    this.setState({show: true})
  },

  hide() {
    this.setState({show: false, query: null})
    let input = ReactDOM.findDOMNode(this.refs.input)
    input.value = ''

    if (typeof this.props.onHide === 'function') {
      this.props.onHide()
    }
  },

  render() {
    let styles = this.getStyles()

    let iconColor = this.context.muiTheme.rawTheme.palette.primary1Color

    let results

    if (this.state.query) {
      results = <SearchResults style={styles.results} query={this.state.query}/>
    }

    return (
      <div style={styles.container}>
        <Paper zDepth={1} style={styles.searchBar}>
          <AppBar
            style={styles.bar}
            zDepth={0}
            title={<input placeholder="Search..." onChange={this._handleChange} onKeyUp={this._handleKeyUp} ref="input" style={styles.input}/>}
            iconElementLeft={
              <IconButton iconClassName="material-icons" iconStyle={{color: iconColor}} onTouchTap={this.hide}>arrow_back</IconButton>
            }
          />
          <nav style={styles.reach}>
            <p style={styles.reachLabel}>Search in</p>
            <SelectField value={this.state.reach} onChange={this._handleReachChange} style={styles.select}>
              <MenuItem value="me" primaryText="Me" />
              <MenuItem value="node" primaryText="Current node" />
              <MenuItem value="all" primaryText="Biggest reach" />
            </SelectField>
            <GraphFilters/>
          </nav>
        </Paper>

        {results}

      </div>
    )
  },

  _handleChange({target}) {
    this.setState({query: target.value})
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(target.value)
    }
  },

  _handleKeyUp(e) {
    if (e.keyCode == 13 && typeof this.props.onSubmit === 'function') {
      this.props.onSubmit(e.target.value)
    }
  },

  _handleReachChange(e, index, value) {
    this.setState({reach: value})
  }

})

export default Radium(Search)
