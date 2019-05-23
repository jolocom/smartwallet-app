import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential'

const lastYear = new Date()
lastYear.setFullYear(lastYear.getFullYear() - 1)

const nextYear = new Date()
nextYear.setFullYear(nextYear.getFullYear() + 1)

export const expiryDates = [lastYear, nextYear]
export const issuers = ["issuerA", "issuerB", "issuerC"]
export const types = ["someCred", "someOtherCred", "anotherOne"]

const getRandomInt = (min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const flatten = <T>(arr: T[][]) => arr.reduce((acc, curr) => [...acc, ...curr])

export const testCreds: SignedCredential[] = flatten(expiryDates.map(expiryDate =>
    flatten(issuers.map(issuer =>
        types.map(typ => {
            const sc = new SignedCredential()
            const issueTime = new Date(getRandomInt(0, 10000000000))
            sc.expires = expiryDate
            sc.issuer = issuer
            sc.type = [typ]
            sc.issued = issueTime
            return sc
        })))))

