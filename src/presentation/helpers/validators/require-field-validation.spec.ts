import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './required-field-validation'

describe('RequiredField Validation', () => {
  it('should return a MissingParamError if validation fails', () => {
    const sut = new RequiredFieldValidation('email')
    const error = sut.validate({ name: 'any_name' })
    expect(error).toEqual(new MissingParamError('email'))
  })

  it('should not return if validation succeeds', () => {
    const sut = new RequiredFieldValidation('email')
    const error = sut.validate({ email: 'any_email' })
    expect(error).toBeFalsy()
  })
})
