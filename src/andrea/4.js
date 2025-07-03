export class UserService {
  constructor(database, emailService) {
    this.database = database
    this.emailService = emailService
    this.users = new Map()
  }

  async createUser(userData) {
    if (!userData.email || !userData.name) {
      throw new Error('Email and name are required')
    }

    const user = {
      id: Date.now(),
      ...userData,
      createdAt: new Date(),
    }

    this.users.set(user.id, user)
    await this.database.save(user)
    await this.emailService.sendWelcomeEmail(user.email)

    return user
  }

  getUser(id) {
    return this.users.get(id)
  }

  async deleteUser(id) {
    const user = this.users.get(id)
    if (!user) {
      throw new Error('User not found')
    }

    this.users.delete(id)
    await this.database.delete(id)
    return true
  }

  getAllUsers() {
    return Array.from(this.users.values())
  }

  async updateUser(id, updates) {
    const user = this.users.get(id)
    if (!user) {
      throw new Error('User not found')
    }

    const updatedUser = { ...user, ...updates }
    this.users.set(id, updatedUser)
    await this.database.update(id, updatedUser)

    return updatedUser
  }
}

export class Calculator {
  add(a, b) {
    return a + b
  }

  divide(a, b) {
    if (b === 0) {
      throw new Error('Cannot divide by zero')
    }
    return a / b
  }

  async calculateAsync(operation, a, b) {
    return new Promise((resolve) => {
      setTimeout(() => {
        switch (operation) {
          case 'add':
            resolve(this.add(a, b))
            break
          case 'divide':
            resolve(this.divide(a, b))
            break
          default:
            resolve(null)
        }
      }, 100)
    })
  }
}
