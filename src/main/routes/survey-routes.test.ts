import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'
import request from 'supertest'

import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import app from '@/main/config/app'
import env from '@/main/config/env'

let surveyCollection: Collection
let accountCollection: Collection

const makeAccessToken = async (): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: 'Miguel',
    email: 'miguelaugl@outlook.com',
    password: '123',
    role: 'admin',
  })
  const [account] = res.ops
  const accessToken = sign({ id: account._id }, env.jwtSecret)
  await accountCollection.updateOne({
    _id: account._id,
  }, {
    $set: {
      accessToken,
    },
  })
  return accessToken
}

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    accountCollection = await MongoHelper.getCollection('accounts')
    await surveyCollection.deleteMany({})
    await accountCollection.deleteMany({})
  })

  describe('POST /surveys', () => {
    it('should return 403 on add survey without accessToken', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'Question',
          answers: [{
            answer: 'Answer 1',
            image: 'http://image-name.com',
          }, {
            answer: 'Answer 2',
          }],
        })
        .expect(403)
    })

    it('should return 204 on add survey with valid token', async () => {
      const accessToken = await makeAccessToken()
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send({
          question: 'Question',
          answers: [{
            answer: 'Answer 1',
            image: 'http://image-name.com',
          }, {
            answer: 'Answer 2',
          }],
        })
        .expect(204)
    })
  })

  describe('GET /surveys', () => {
    it('should return 403 on add survey without accessToken', async () => {
      await request(app)
        .get('/api/surveys')
        .expect(403)
    })

    it('should return 204 on load surveys with valid accessToken', async () => {
      const accessToken = await makeAccessToken()
      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(204)
    })
  })
})
