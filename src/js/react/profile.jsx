import React from 'react'

class Profile extends React.Component {

  render() {
    return (
      <div className="profile">
        <div className="profile-edit">
          Edit
          { /* TODO: Text should come from state */ }
        </div>
        { /* TODO: 2 modes: presentation and editing */ }
        <div className="basic">
          <header className="profile-header">
            <h2>WebID</h2>
            <h3>Digital passport</h3>
            <img src="#"/>
          </header>
          <main className="profile-main">
            <section className="profile-basic-info">
              <h3 className="profile-name">TODO: Put name here</h3>
              <p className="profile-email"></p>
              <a className="profile-webid" href="#">TODO: Put WebID url here</a>
            </section>
            <section className="profile-publickey">
              <span className="profile-modulus-label">RSA Modulus: </span>
              <span className="profile-modulus">TODO: Put RSA modulus here </span>
              <span className="profile-exponent-label">RSA Exponent: </span>
              <span className="profile-exponent">TODO: Put RSA exponent here</span>
            </section>

          </main>
        </div>
      </div>
    )
  }
}

export default Profile
