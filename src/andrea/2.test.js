import { beforeEach, describe, expect, it, vi } from 'vitest'
import { doSomeOnEven, isEven } from './2'

describe('2.ts', () => {
  describe(isEven.name, () => {
    it.each([
      { number: 1, expected: false },
      { number: 2, expected: true },
    ])('recursive with statics resource', ({ number, expected }) => {
      const result = isEven(number)

      expect(result).toBe(expected)
    })

    let counter = 0
    let expected = false

    beforeEach(() => {
      if (counter !== 0) {
        expected = !expected
      }

      counter++
    })

    it('1', () => {
      const result = isEven(counter)

      expect(result).toBe(expected)
    })

    it('2', () => {
      const result = isEven(counter)

      expect(result).toBe(expected)
    })

    it('should work with different type of number', () => {
      const result = isEven('suca')

      expect(result).toBe(false)
    })

    it('should work with string even number', () => {
      const result = isEven('2')

      expect(result).toBeTruthy()
    })
  })

  describe(doSomeOnEven.name, () => {
    const mockCb = vi.fn()

    const oddNumber = 1
    const evenNumber = 2

    it('should not call cb when number is odd', () => {
      doSomeOnEven(oddNumber, mockCb)

      expect(mockCb).not.toHaveBeenCalled()
    })

    it('should call cb when number is even', () => {
      doSomeOnEven(evenNumber, mockCb)

      expect(mockCb).toHaveBeenCalled()
    })
  })
})
