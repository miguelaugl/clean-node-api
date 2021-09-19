import { DbAuthentication } from '@/data/usecases/authentication/db-authentication'
import { BcryptAdapter } from '@/infra/cryptography/bcrypt/bcrypt-adapter'
import { JwtAdapter } from '@/infra/cryptography/jwt/jwt-adapter'
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'
import env from '@/main/config/env'
import { Authentication } from '@/domain/usecases/authentication'

export const makeDbAuthentication = (): Authentication => {
  const salt = 12
  const accountMongoRepository = new AccountMongoRepository()
  const bcrypterAdapter = new BcryptAdapter(salt)
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  return new DbAuthentication(accountMongoRepository, bcrypterAdapter, jwtAdapter, accountMongoRepository)
}
