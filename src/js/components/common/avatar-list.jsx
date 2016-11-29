import React from 'react'
import Radium from 'radium'
// import Reflux from 'reflux'

import {List, ListItem, Divider, Subheader, Avatar, Checkbox} from 'material-ui'
import {grey500} from 'material-ui/styles/colors'
import theme from 'styles/jolocom-theme'

import Loading from 'components/common/loading.jsx'

// import ContactsActions from 'actions/contacts'
// import ContactsStore from 'stores/contacts'

import Utils from 'lib/util'

let AvatarList = React.createClass({

  propTypes: {
    searchQuery: React.PropTypes.string,
    onClick: React.PropTypes.func,
    items: React.PropTypes.array,
    noReordering: React.PropTypes.func,
    noHeadings: React.PropTypes.string,
    onChange: React.PropTypes.bool,
    checkboxes: React.PropTypes.bool,
    avatarLeft: React.PropTypes.object,
    loading: React.PropTypes.bool,
    emptyMessage: React.PropTypes.string
  },

  componentWillMount() {
    this.setState({checkboxes: {}})
  },

  componentDidMount() {
  },

  getStyles() {
    return {
      loading: {
        position: 'absolute'
      },
      list: {
        padding: '10px 0'
      },
      empty: {
        position: 'absolute',
        fontWeight: 300,
        color: grey500,
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px'
      },
      listItem: {
        paddingLeft: '15px'
      },
      listItemCheckboxes: {
        paddingLeft: '50px',
        boxSizing: 'border-box',
        overflow: 'hidden'
      },
      listItemContainer: {
        position: 'relative',
        paddingLeft: '60px'
      },
      header: {
        position: 'absolute',
        paddingTop: '4px',
        paddingLeft: '20px',
        fontWeight: 'bold',
        fontSize: '20px',
        color: theme.palette.primary1Color
      },
      checkbox: {
        marginLeft: '15px',
        marginTop: '8px'
      },
      rightText: {
        color: grey500,
        fontSize: '12px',
        float: 'right'
      },
      separator: {
        margin: '10px 0 10px 75px', // 72
        marginTop: '10px'
      }
    }
  },

  renderItems(items) {
    let styles = this.getStyles()

    if (!this.props.noReordering) {
      items.sort((a, b) =>
        a.name.toLowerCase() > b.name.toLowerCase())
    }

    let lastNameInitial = ''

    let result = []

    items.forEach((item, i) => {
      let {id,
           // username,
           // content,
           rightText,
           // webId,
           name,
           email,
           secondaryText,
           imgUri,
           onTouchTap} = item

      // Avatar
      let avatar
      if (imgUri) {
        avatar =
          <Avatar
            src={Utils.uriToProxied(imgUri)}
            style={{backgroundSize: 'cover'}}
          />
      } else {
        avatar = <Avatar>{nameInitial}</Avatar>
      }

      // Initial
      let nameInitial = Utils.nameInitial({name: name})

      // Grouping of initials
      if (nameInitial !== lastNameInitial && !this.props.noHeadings) {
        lastNameInitial = nameInitial

        // Don't insert a divider before the first element
        if (i > 0) {
          result.push(<Divider
            inset key={`divider_${i}`}
            style={this.getStyles().separator} />)
        }

        result.push(
          <Subheader
            key={`header_${i}`}
            style={this.getStyles().header}
          >
            {nameInitial}
          </Subheader>
        )
      }

      let handleClick = () => {
        onTouchTap && onTouchTap(item)
      }

      let primaryText = name
      if (rightText) {
        primaryText = (
          <div>
            <span>{name}</span>
            <span style={styles.rightText}>{rightText}</span>
          </div>
        )
      }

      let onCheckboxCheck = (e, check) => {
        console.log('AAAA ', e, 'CHECK ', check)
        let cbs = this.state.checkboxes
        cbs[id] = {checked: check}
        this.setState({checkboxes: Object.assign({}, cbs)})
        if (this.props.onChange) {
          this.props.onChange(this.props.items.filter((item) =>
          cbs[item.id] !== undefined && cbs[item.id].checked))
        }
      }

      let checkbox = <Checkbox style={styles.checkbox}
        checked={
          this.state.checkboxes[id] &&
          this.state.checkboxes[id].checked ||
          false
        }
        onCheck={onCheckboxCheck} />

      if (!id) {
        console.error(item, ' has no id property')
      }

      let stylesF = Object.assign(
        {},
        styles.listItem,
        this.props.checkboxes &&
        styles.listItemCheckboxes
      )

      result.push(
        <ListItem
          key={id || email}
          primaryText={primaryText}
          secondaryText={secondaryText}
          rightAvatar={!this.props.avatarLeft && avatar}
          leftAvatar={
            (this.props.avatarLeft && avatar) ||
            (this.props.checkboxes && checkbox)
          }
          insetChildren
          onTouchTap={handleClick}
          style={stylesF}
        />
      )
    })

    return result
  },

  render() {
    let content
    let items = this.props.items
    let styles = this.getStyles()

    if (this.props.loading) {
      content = <Loading style={styles.loading} />
    } else if (!items || !items.length) {
      content =
        <div style={styles.empty}>
          {this.props.emptyMessage || 'Nothing'}
        </div>
    } else {
      content = <List>{this.renderItems(items)}</List>
    }

    return (
      <div style={styles.list}>
        {content}
      </div>
    )
  }

})

export default Radium(AvatarList)
