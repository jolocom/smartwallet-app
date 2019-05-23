import { filters } from './../../src/lib/filterCreds'
import { testCreds,
         issuers,
         types } from './testData/filterTestData'

describe('Filtering Credentials', () => {
    it('should filter expired creds', () => {
        const now = new Date()
        const filtered = filters.filterByExpired(testCreds)
        expect(filtered.length).toEqual(testCreds.length / 2)
        expect(filtered.every(cred => cred.expires.valueOf() > now.valueOf()))
    })

    it('should filter by issuer', () => {
        issuers.forEach(issuer => {
            expect(filters.filterByIssuer(issuer)(testCreds).every(cred => cred.issuer === issuer))
        })
    })

    it('should filter by type', () => {
        types.forEach(typ => {
            expect(filters.filterByType(typ)(testCreds).every(cred => cred.type.some(t => t === typ)))
        })
    })

    it('should order by most recent', () => {
        filters.orderByRecent(testCreds).reduce((prev, current) => {
            expect(prev.issued.valueOf()).toBeGreaterThan(current.issued.valueOf())
            return current
        })
    })
})
