import { EmailValidatorAdapter } from './email-validator'

describe('EmailValidator Adapter', () => {
  it('should return false if validator returns false', () => {
    const sut = new EmailValidatorAdapter()
    const result = sut.isValid('invalid_email')
    expect(result).toBe(false)
  })
})
