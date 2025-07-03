import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { UserService, Calculator } from './4'

describe('Advanced Testing Concepts', () => {
  describe('Mocking Dependencies', () => {
    let userService
    let mockDatabase
    let mockEmailService

    beforeEach(() => {
      mockDatabase = {
        save: vi.fn().mockResolvedValue(true),
        delete: vi.fn().mockResolvedValue(true),
        update: vi.fn().mockResolvedValue(true),
      }

      mockEmailService = {
        sendWelcomeEmail: vi.fn().mockResolvedValue(true),
      }

      userService = new UserService(mockDatabase, mockEmailService)
    })

    afterEach(() => {
      vi.clearAllMocks()
    })

    it('should create a user and call external services', async () => {
      const userData = { name: 'John Doe', email: 'john@example.com' }

      const user = await userService.createUser(userData)

      expect(user).toMatchObject({
        name: 'John Doe',
        email: 'john@example.com',
      })
      expect(user.id).toBeDefined()
      expect(user.createdAt).toBeInstanceOf(Date)

      expect(mockDatabase.save).toHaveBeenCalledOnce()
      expect(mockDatabase.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'John Doe',
          email: 'john@example.com',
        })
      )

      expect(mockEmailService.sendWelcomeEmail).toHaveBeenCalledOnce()
      expect(mockEmailService.sendWelcomeEmail).toHaveBeenCalledWith('john@example.com')
    })

    it('should throw error when required fields are missing', async () => {
      await expect(userService.createUser({ name: 'John' })).rejects.toThrow(
        'Email and name are required'
      )

      expect(mockDatabase.save).not.toHaveBeenCalled()
      expect(mockEmailService.sendWelcomeEmail).not.toHaveBeenCalled()
    })
  })

  describe('Spying on Methods', () => {
    it('should spy on class methods', () => {
      const calculator = new Calculator()
      const addSpy = vi.spyOn(calculator, 'add')

      const result = calculator.add(2, 3)

      expect(result).toBe(5)
      expect(addSpy).toHaveBeenCalledWith(2, 3)
      expect(addSpy).toHaveReturnedWith(5)
    })
  })

  describe('Testing Async Code with Timers', () => {
    let calculator

    beforeEach(() => {
      vi.useFakeTimers()
      calculator = new Calculator()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should calculate asynchronously with fake timers', async () => {
      const promise = calculator.calculateAsync('add', 5, 3)

      expect(vi.getTimerCount()).toBe(1)

      vi.advanceTimersByTime(100)

      const result = await promise
      expect(result).toBe(8)
    })
  })

  describe('Snapshot Testing', () => {
    it('should match user object snapshot', () => {
      const user = {
        id: 1,
        name: 'Jane Doe',
        email: 'jane@example.com',
        preferences: {
          theme: 'dark',
          notifications: true,
        },
      }

      expect(user).toMatchInlineSnapshot(`
              {
                "email": "jane@example.com",
                "id": 1,
                "name": "Jane Doe",
                "preferences": {
                  "notifications": true,
                  "theme": "dark",
                },
              }
            `)
    })
  })

  describe('Testing Error Scenarios', () => {
    it('should handle division by zero', () => {
      const calculator = new Calculator()

      expect(() => calculator.divide(10, 0)).toThrow('Cannot divide by zero')
      expect(() => calculator.divide(10, 0)).toThrowError(Error)
    })
  })

  describe('Test Hooks and Setup', () => {
    let testData

    beforeAll(() => {
      console.log('Running before all tests in this suite')
    })

    afterAll(() => {
      console.log('Running after all tests in this suite')
    })

    beforeEach(() => {
      testData = {
        users: [],
        config: { maxUsers: 10 },
      }
    })

    it('should have fresh test data for each test', () => {
      expect(testData.users).toHaveLength(0)
      testData.users.push({ id: 1 })
      expect(testData.users).toHaveLength(1)
    })

    it('should have fresh test data again', () => {
      expect(testData.users).toHaveLength(0)
    })
  })

  describe('Testing with describe.each', () => {
    const calculator = new Calculator()

    describe.each([
      { a: 1, b: 2, expected: 3 },
      { a: 5, b: 5, expected: 10 },
      { a: -1, b: 1, expected: 0 },
    ])('add($a, $b)', ({ a, b, expected }) => {
      it(`should return ${expected}`, () => {
        expect(calculator.add(a, b)).toBe(expected)
      })
    })
  })

  describe('Testing with it.each', () => {
    const calculator = new Calculator()

    it.each([
      [2, 2, 1],
      [3, 3, 1],
      [4, 2, 2],
    ])('divide(%i, %i) should return %i', (a, b, expected) => {
      expect(calculator.divide(a, b)).toBe(expected)
    })
  })

  describe('Custom Matchers', () => {
    it('should use various matchers', () => {
      const user = {
        name: 'Alice',
        age: 25,
        email: 'alice@example.com',
      }

      expect(user).toHaveProperty('name', 'Alice')
      expect(user).toMatchObject({ name: 'Alice' })
      expect(Object.keys(user)).toContain('email')

      expect(user.age).toBeGreaterThan(18)
      expect(user.age).toBeLessThanOrEqual(25)
      expect(user.age).toBeTypeOf('number')

      expect(user.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    })
  })

  describe('Testing with vi.fn() mock functions', () => {
    it('should track mock function calls', () => {
      const mockFn = vi.fn((x) => x * 2)

      mockFn(5)
      mockFn(10)

      expect(mockFn).toHaveBeenCalledTimes(2)
      expect(mockFn).toHaveBeenNthCalledWith(1, 5)
      expect(mockFn).toHaveBeenNthCalledWith(2, 10)
      expect(mockFn).toHaveReturnedWith(10)
      expect(mockFn).toHaveReturnedWith(20)

      expect(mockFn.mock.calls).toEqual([[5], [10]])
      expect(mockFn.mock.results).toEqual([
        { type: 'return', value: 10 },
        { type: 'return', value: 20 },
      ])
    })
  })

  describe('Skip and Only modifiers', () => {
    it.skip('this test will be skipped', () => {
      expect(true).toBe(false)
    })

    it('this test will run', () => {
      expect(true).toBe(true)
    })

    it.todo('implement this test later')
  })
})
