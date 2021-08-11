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
const mockDeviceScreenWidthModifier = 1.4
const mockDeviceScreenWidthLarge =
  mockBaseScreenWidth * mockDeviceScreenWidthModifier

const mockAvailableWidth = 280
/**
 * NOTE: this variable is used to test when available width
 * is larger than base card width
 */
const mockLargeWidthModifier = 1.2
const mockAvailableWidthLarge = mockBaseCardWidth * mockLargeWidthModifier

/**
 * NOTE: this mock is volatile because if path to
 * Dimenstion class changes we need to update path here
 */
jest.mock('react-native', () => ({
  Dimensions: { get: jest.fn() },
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
        getCardDimensions(320, 398, {
          originalScreenWidth: 100,
          containerWidth: 300,
        })
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

    it('calculates card dimensions based on originalScreenWidth defining property', () => {
      const { scaledWidth, scaledHeight, scaleBy } = getCardDimensions(
        mockBaseCardWidth,
        mockBaseCardHeight,
        { originalScreenWidth: mockBaseScreenWidth },
      )
      expect(scaleBy).toBe(mockDeviceScreenWidth / mockBaseScreenWidth)
      expect(scaledWidth).toBe(
        (mockDeviceScreenWidth / mockBaseScreenWidth) * mockBaseCardWidth,
      )
      expect(scaledHeight).toBe(
        mockBaseCardHeight * (mockDeviceScreenWidth / mockBaseScreenWidth),
      )
    })
    it('calculates card dimensions based on containerWidth defining property: containerWidth is smaller than baseCardWidth', () => {
      const { scaledWidth, scaledHeight, scaleBy } = getCardDimensions(
        mockBaseCardWidth,
        mockBaseCardHeight,
        { containerWidth: mockAvailableWidth },
      )

      expect(scaleBy).toBe(mockAvailableWidth / mockBaseCardWidth)
      expect(scaledWidth).toBe(mockAvailableWidth)
      expect(scaledHeight).toBe(
        mockBaseCardHeight * (mockAvailableWidth / mockBaseCardWidth),
      )
    })
    it('calculates card dimensions based on containerWidth defining property: containerWidth is larger than baseCardWidth', () => {
      const { scaledWidth, scaledHeight, scaleBy } = getCardDimensions(
        mockBaseCardWidth,
        mockBaseCardHeight,
        { containerWidth: mockAvailableWidthLarge },
      )

      expect(scaleBy).toBe(mockLargeWidthModifier)
      expect(scaledWidth).toBe(mockBaseCardWidth * mockLargeWidthModifier)
      expect(scaledHeight).toBe(mockBaseCardHeight * mockLargeWidthModifier)
    })
  })
  describe('runs tests for screens larger than base screen', () => {
    beforeAll(() => {
      // @ts-expect-error
      Dimensions.get.mockReturnValue({ width: mockDeviceScreenWidthLarge })
    })

    it('calculates card dimensions based on originalScreenWidth defining property', () => {
      const { scaledWidth, scaledHeight, scaleBy } = getCardDimensions(
        mockBaseCardWidth,
        mockBaseCardHeight,
        { originalScreenWidth: mockBaseScreenWidth },
      )

      expect(scaleBy).toBe(mockDeviceScreenWidthModifier)
      expect(scaledWidth).toBe(
        mockBaseCardWidth * mockDeviceScreenWidthModifier,
      )
      expect(scaledHeight).toBe(
        mockBaseCardHeight * mockDeviceScreenWidthModifier,
      )
    })
  })
})
