import { Dimensions } from 'react-native'
import { getCardDimensions } from '~/components/Cards/getCardDimenstions'

const mockBaseCardWidth = 300
const mockBaseCardHeight = 200
const mockBaseScreenWidth = 500

const mockDeviceScreenWidth = 350
/**
 * NOTE: this variable is used to test when device screen width
 * is larger than base screen width
 */
const mockDeviceScreenWidthLarge = 600

const mockAvailableWidth = 280
/**
 * NOTE: this variable is used to test when available width
 * is larger than base card width
 */
const mockAvailableWidthLarge = 320

/**
 * NOTE: this mock is volatile because if path to
 * Dimenstion class changes we need to update path here
 */
jest.mock('react-native/Libraries/Utilities/Dimensions.js', () => ({
  get: jest.fn(),
}))

describe('getCardDimensions', () => {
  describe('runs tests for screens smaller than base screen', () => {
    beforeAll(() => {
      // @ts-expect-error
      Dimensions.get.mockReturnValue({ width: mockDeviceScreenWidth })
    })

    afterAll(() => {
      // @ts-expect-error
      Dimensions.get.mockReset()
    })

    it("throws an error if defining option argument wasn't used correctly", () => {
      expect(() => {
        // @ts-expect-error
        getCardDimensions(320, 398, { baseScreenWidth: 'baseWidth' })
      }).toThrowError(
        new Error(
          '"definigOption" param in getCardDimensions fn was used incorrectly',
        ),
      )
      expect(() => {
        // @ts-expect-error
        getCardDimensions(320, 398, { availableWidth: 'baseWidth' })
      }).toThrowError(
        new Error(
          '"definigOption" param in getCardDimensions fn was used incorrectly',
        ),
      )
      expect(() => {
        // @ts-expect-error
        getCardDimensions(320, 398, {})
      }).toThrowError(
        new Error(
          '"definigOption" param in getCardDimensions fn was used incorrectly',
        ),
      )
    })

    it('calculates card dimensions based on baseScreenWidth defining property', () => {
      const { cardWidth, cardHeight, scaleBy } = getCardDimensions(
        mockBaseCardWidth,
        mockBaseCardHeight,
        { baseScreenWidth: mockBaseScreenWidth },
      )
      expect(scaleBy).toBe(mockDeviceScreenWidth / mockBaseScreenWidth)
      expect(cardWidth).toBe(
        (mockDeviceScreenWidth / mockBaseScreenWidth) * mockBaseCardWidth,
      )
      expect(cardHeight).toBe(
        mockBaseCardHeight * (mockDeviceScreenWidth / mockBaseScreenWidth),
      )
    })
    it('calculates card dimensions based on availableWidth defining property: availableWidth is smaller than baseCardWidth', () => {
      const { cardWidth, cardHeight, scaleBy } = getCardDimensions(
        mockBaseCardWidth,
        mockBaseCardHeight,
        { availableWidth: mockAvailableWidth },
      )

      expect(scaleBy).toBe(mockAvailableWidth / mockBaseCardWidth)
      expect(cardWidth).toBe(mockAvailableWidth)
      expect(cardHeight).toBe(
        mockBaseCardHeight * (mockAvailableWidth / mockBaseCardWidth),
      )
    })
    it('calculates card dimensions based on availableWidth defining property: availableWidth is larger than baseCardWidth', () => {
      const { cardWidth, cardHeight, scaleBy } = getCardDimensions(
        mockBaseCardWidth,
        mockBaseCardHeight,
        { availableWidth: mockAvailableWidthLarge },
      )

      expect(scaleBy).toBe(mockAvailableWidthLarge / mockBaseCardWidth)
      expect(cardWidth).toBe(mockBaseCardWidth)
      expect(cardHeight).toBe(mockBaseCardHeight)
    })
  })
  describe('runs tests for screens larger than base screen', () => {
    beforeAll(() => {
      // @ts-expect-error
      Dimensions.get.mockReturnValue({ width: mockDeviceScreenWidthLarge })
    })

    it('calculates card dimensions based on baseScreenWidth defining property', () => {
      const { cardWidth, cardHeight, scaleBy } = getCardDimensions(
        mockBaseCardWidth,
        mockBaseCardHeight,
        { baseScreenWidth: mockBaseScreenWidth },
      )

      expect(scaleBy).toBe(mockDeviceScreenWidthLarge / mockBaseScreenWidth)
      expect(cardWidth).toBe(mockBaseCardWidth)
      expect(cardHeight).toBe(mockBaseCardHeight)
    })
  })
})
