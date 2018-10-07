import {generateDate, generateId} from '../main/generator'

describe('generator', () => {
  describe('generateId', () => {
    it('returns unique history item id', () => {
      expect(generateId()).toMatch(/^\d\.\d+$/)
      expect(generateId()).not.toBe(generateId())
    })
  })

  describe('generateDate', () => {
    it('returns current date', () => {
      expect(generateDate().getTime()).toBeLessThanOrEqual(Date.now())
    })
  })
})
