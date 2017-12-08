import Immutable from 'immutable'
// import createReactClass from 'create-react-class'

// TODO: check to see if user is already logged in
// TODO: rewrite logout function for session management

const initialState = Immutable.fromJS({
  username: '',
  userExists: false,
  loggedIn: false
})

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    default:
      return state
  }
}
