import rdf from 'rdflib'
import {PRED} from 'lib/namespaces'
import util from 'lib/util'
import HTTPAgent from 'lib/agents/http'
import LDPAgent from 'lib/agents/ldp'

// Rdf related helper, should probably be abstracted.
const rdfHelper = {
  addEntryPatch(entryFileUrl, webId, entryId, entryType) {
    const g = rdf.graph()
    const entryNode =
    `${util.getProfFolderUrl(webId)}/card#${entryType}${entryId}`

    const typeToPred = {
      phone: PRED.mobile,
      email: PRED.email,
      passport: PRED.passport,
      idCard: PRED.idCard
    }

    g.add(rdf.sym(webId), typeToPred[entryType], rdf.sym(entryNode))
    g.add(rdf.sym(entryNode), PRED.identifier, rdf.lit(entryId))
    g.add(rdf.sym(entryNode), PRED.seeAlso, rdf.sym(entryFileUrl))
    return g.statements
  },

  removeEntryPatch() {},

  entryFileBody(entryFileUrl, webId, entryValue, entryType) {
    const g = rdf.graph()

    const typeToPred = {
      phone: PRED.mobile,
      email: PRED.email
    }

    if (entryType === 'phone' || entryType === 'email') {
      g.add(rdf.sym(entryFileUrl), typeToPred[entryType], entryValue)
      g.add(rdf.sym(entryFileUrl), PRED.primaryTopic, rdf.sym(webId))
    } else if (entryType === 'passport') {
      // TODO
    } else if (entryType === 'idCard') {
      const subj = rdf.sym(entryFileUrl)
      const ownerUrl = rdf.sym(`${entryFileUrl}#owner`)
      const addrBNode = rdf.blankNode('address')
      const gender = entryValue.gender === 'male'
        ? PRED.male
        : PRED.female

      // Id card info
      g.add(subj, PRED.type, PRED.idCard)
      g.add(subj, PRED.identifier, entryValue.number.value)
      g.add(subj, PRED.expiresBy, entryValue.expirationDate.value)
      g.add(subj, PRED.ownedBy, ownerUrl)

      // Owner info
      g.add(ownerUrl, PRED.givenName, entryValue.firstName.value)
      g.add(ownerUrl, PRED.familyName, entryValue.lastName.value)
      g.add(ownerUrl, PRED.gender, gender)
      g.add(ownerUrl, PRED.birthDate, entryValue.birthDate.value)
      g.add(ownerUrl, PRED.birthPlace, entryValue.birthPlace.value)
      g.add(ownerUrl, PRED.countryOfBirth, entryValue.birthCountry.value)
      g.add(ownerUrl, PRED.address, addrBNode)

      // Owner address info
      g.add(
        addrBNode,
        PRED.street,
        entryValue.physicalAddress.streetWithNumber.value
      )
      g.add(addrBNode, PRED.zip, entryValue.physicalAddress.zip.value)
      g.add(addrBNode, PRED.city, entryValue.physicalAddress.city.value)
      g.add(addrBNode, PRED.state, entryValue.physicalAddress.state.value)
      g.add(addrBNode, PRED.country, entryValue.physicalAddress.country.value)
    }

    return rdf.serialize(undefined, g, entryFileUrl, 'text/turtle')
  },

  entryAclFileBody(entryFileAclUrl, entryFileUrl, webId) {
    const owner = rdf.sym(`${entryFileAclUrl}#owner`)
    const g = rdf.graph()

    g.add(owner, PRED.type, PRED.auth)
    g.add(owner, PRED.access, rdf.sym(entryFileUrl))
    g.add(owner, PRED.agent, rdf.sym(webId))
    g.add(owner, PRED.mode, PRED.read)
    g.add(owner, PRED.mode, PRED.write)
    g.add(owner, PRED.mode, PRED.control)

    return rdf.serialize(undefined, g, entryFileUrl, 'text/turtle')
  }
}

export default class SolidAgent {
  constructor() {
    this.http = new HTTPAgent({proxy: true})
    this.ldp = new LDPAgent()

    this.defaultProfile = {
      webId: '',
      username: {
        value: '',
        verified: false
      },
      contact: {
        phone: [],
        email: []
      },
      Reputation: 0,
      // passports: [{
      //   number: null,
      //   givenName: null,
      //   surname: null,
      //   birthDate: null,
      //   gender: null,
      //   street: null,
      //   streetAndNumber: null,
      //   city: null,
      //   zip: null,
      //   state: null,
      //   country: null
      // }]
      passports: [],
      // idCards: [
      //   {
      //     number: '12312421',
      //     expirationDate: '1.1.18',
      //     firstName: 'Annika',
      //     lastName: 'Hamman',
      //     gender: 'female',
      //     birthDate: '1.1.88',
      //     birthPlace: 'Wien',
      //     birthCountry: 'Austria',
      //     physicalAddress: {
      //       streetWithNumber: 'Waldemarstr. 97a',
      //       zip: '1234',
      //       city: 'Berlin',
      //       state: 'Berlin',
      //       country: 'Germany'
      //     }
      //   }
      // ]
      idCards: []
    }
  }

  deleteEntry(webId, entryType, entryId) {
    const entryFileUrl =
    `${util.getProfFolderUrl(webId)}/${entryType}${entryId}`
    let toDel = rdfHelper
    .addEntryPatch(entryFileUrl, webId, entryId, entryType)
    return this.http.patch(`${util.getProfFolderUrl(webId)}/card`, toDel)
    .then(this.http
      .delete(`${util.getProfFolderUrl(webId)}/${entryType}${entryId}`))
    .then(this.http
      .delete(`${util.getProfFolderUrl(webId)}/${entryType}${entryId}.acl`))
  }

  updateEntry(webId, entryType, entryId, newValue) {
    const entryFileUrl =
    `${util.getProfFolderUrl(webId)}/${entryType}${entryId}`
    let newEntryFileBody =
    rdfHelper.entryFileBody(entryFileUrl, webId, newValue, entryType)
    return this.http.put(entryFileUrl, newEntryFileBody)
  }

  async getUserInformation(webId) {
    if (!webId) {
      console.error('No webId found')
      return Object.assign({}, this.defaultProfile)
    }
    return this.ldp.fetchTriplesAtUri(webId).then((rdfData) => {
      if (rdfData.unav) {
        // TODO snackbar
        console.error('User profile card could not be reached')
        return Object.assign({}, this.defaultProfile)
      }
      return this._formatAccountInfo(webId, rdfData.triples)
    })
  }

  retrieveConnectedServices() {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(({
        loaded: false, failed: false, serviceNumber: 0,
        services: [
          {
            deleted: false, label: 'label1', url: 'http://www.youtube.com',
            id: '1', iconUrl: '/img/img_nohustle.svg',
            sharedData: [
              {attrType: 'phone', value: '17524', type: 'work', verified: false,
                status: ''},
              {attrType: 'phone', value: '45678', type: 'work', verified: true,
                status: ''},
              {attrType: 'phone', value: '96574', type: 'work', verified: true,
                status: ''},
              {attrType: 'email', value: 'test@test.test', verified: false,
                status: ''}
            ]
          }, {
            deleted: false,
            label: 'label2',
            url: 'http://www.youtube.com',
            id: '2',
            iconUrl: '/img/img_nohustle.svg',
            sharedData: [{
              attrType: 'email', value: 'test@test.test', verified: false,
              status: ''
            }]
          }, {
            deleted: false, id: '3', url: 'http://www.google.com',
            label: 'label3', conUrl: '/img/img_nohustle.svg',
            sharedData: [{attrType: '', value: '', verified: false, status: ''}]
          }
        ]
      })), 2000)
    })
  }

  deleteService(serviceId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => { resolve(true) }, 2000)
    })
  }

  async _formatAccountInfo(webId, userTriples) {
    const profileData = Object.assign({}, this.defaultProfile)

    const g = rdf.graph()
    g.addAll(userTriples)

    profileData.webId = webId
    profileData.contact.email = await this
      .getExtendedProprietyValue(g, PRED.email)
    profileData.contact.phone = await this
      .getExtendedProprietyValue(g, PRED.mobile)
    profileData.idCards = await this
      .getExtendedProprietyValue(g, PRED.idCard)

    try {
      profileData.username.value = g
        .statementsMatching(undefined, PRED.fullName, undefined)[0].object.value
    } catch (e) {
      console.warn('No name found')
    }

    return profileData
  }

  async getExtendedProprietyValue(g, pred) {
    const propertyData = []

    const objects = g.statementsMatching(undefined, pred, undefined).map(st =>
      st.object
    )

    for (let obj in objects) {
      const tmp = await this._expandData(objects[obj], g, pred)
      if (tmp) {
        propertyData.push(tmp)
      }
    }
    return propertyData
  }

  async _expandData(obj, g, pred) {
    const keyMap = {
      [PRED.mobile.value]: 'number',
      [PRED.email.value]: 'address',
      [PRED.idCard.value]: 'idCardFields'
    }

    const key = keyMap[pred.value]

    if (!g.statementsMatching(obj).length) {
      return
    }

    const seeAlso = g.statementsMatching(obj, PRED.seeAlso, undefined)[0]
      .object.value

    const id = g.statementsMatching(obj, PRED.identifier, undefined)[0]
      .object.value

    return this.ldp.fetchTriplesAtUri(seeAlso).then(rdfData => {
      if (rdfData.unav) {
        return
      }

      const extG = rdf.graph()
      extG.addAll(rdfData.triples)

      let value
      if (key === 'idCardFields' || key === 'passportFields') {
        value = this._formatIdCardInfo(extG)
      } else {
        value = extG.statementsMatching(undefined, pred, undefined)[0]
          .object.value
      }
      return {id, verified: false, [key]: value}
    })
  }

  setEmail(webId, entryValue) {
    if (!webId || !entryValue) {
      console.error('Invalid arguments')
      return
    }
    return this._setEntry(webId, entryValue, 'email')
  }

  setPhone(webId, entryValue) {
    if (!webId || !entryValue) {
      console.error('Invalid arguments')
      return
    }
    return this._setEntry(webId, entryValue, 'phone')
  }

  async getIdentityContractAddress(webId) {
    if (!webId) {
      console.error('Invalid arguments')
      return
    }
    const matches = await this.ldp.findObjectsByTerm(
      webId,
      PRED.identityContractAddress
    )

    console.log(matches)
    return matches[0].value
  }

  setIdentityContractAddress(webId, entryValue) {
    if (!webId || !entryValue) {
      console.error('Invalid arguments')
      return
    }

    const g = rdf.graph()
    g.add(
      rdf.sym(webId),
      PRED.identityContractAddress,
      rdf.lit(entryValue)
    )

    return this.http.patch(webId, [], g.statements)
  }

  setPassport(webId, passport) {
    if (!webId || !passport) {
      console.error('Invalid arguments')
      return
    }
    return this._setEntry(webId, passport, 'passport')
  }

  setIdCard(webId, idCard) {
    if (!webId || !idCard) {
      console.error('Invalid arguments')
      return
    }
    return this._setEntry(webId, idCard, 'idCard')
  }

  _formatIdCardInfo(g) {
    const res = {
      number: undefined,
      expirationDate: undefined,
      firstName: undefined,
      lastName: undefined,
      gender: undefined,
      birthDate: undefined,
      birthPlace: undefined,
      birthCountry: undefined,
      physicalAddress: {
        streetWithNumber: undefined,
        zip: undefined,
        city: undefined,
        state: undefined,
        country: undefined
      }
    }

    const genderMap = {
      [PRED.female.value]: 'female',
      [PRED.male.value]: 'male'
    }

    const fieldsMap = {
      [PRED.identifier.value]: 'number',
      [PRED.expiresBy.value]: 'expirationDate',
      [PRED.givenName.value]: 'firstName',
      [PRED.familyName.value]: 'lastName',
      [PRED.gender.value]: 'gender',
      [PRED.birthDate.value]: 'birthDate',
      [PRED.birthPlace.value]: 'birthPlace',
      [PRED.countryOfBirth.value]: 'birthCountry'
    }

    const physAddrMap = {
      [PRED.street.value]: 'streetWithNumber',
      [PRED.zip.value]: 'zip',
      [PRED.city.value]: 'city',
      [PRED.state.value]: 'state',
      [PRED.country.value]: 'country'
    }

    g.statements.forEach(st => {
      const field = fieldsMap[st.predicate.value]
      const physAddrField = physAddrMap[st.predicate.value]

      if (field) {
        if (genderMap[st.object.value]) {
          res[field] = genderMap[st.object.value]
        } else {
          res[field] = st.object.value
        }
      }

      if (physAddrField) {
        res.physicalAddress[physAddrField] = st.object.value
      }
    })
    return res
  }

  _setEntry(webId, entryValue, entryType) {
    const rndId = this._genRandomAttrId()
    const entryFileUrl = `${util.getProfFolderUrl(webId)}/${entryType}${rndId}`
    const body = rdfHelper
    .addEntryPatch(entryFileUrl, webId, rndId, entryType)

    return Promise.all([this.http.patch(webId, [], body),
      this.createEntryFile(webId, entryFileUrl, entryValue, entryType)])
  }

  createEntryFile(webId, entryFileUrl, entryValue, entryType) {
    const entryFileBody = rdfHelper
    .entryFileBody(entryFileUrl, webId, entryValue, entryType)

    return Promise.all([this._createEntryFileAcl(webId, entryFileUrl),
      this.http.put(entryFileUrl, entryFileBody)])
  }

  // Move out of class?
  _createEntryFileAcl(webId, entryFileUrl) {
    const entryFileAclUrl = `${entryFileUrl}.acl`
    const entryFileAclBody = rdfHelper
    .entryAclFileBody(entryFileAclUrl, entryFileUrl, webId)
    return this.http.put(entryFileAclUrl, entryFileAclBody)
    .catch(e => console.error('Could not create entry file'))
  }

  _genRandomAttrId() {
    return util.randomString(5)
  }
}
