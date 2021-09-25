import { Collection } from 'mongodb'

import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'

import { SurveyMongoRepository } from './survey-mongo-repository'

let surveyCollection: Collection

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

describe('Survey Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

  it('should add survey on success', async () => {
    const sut = makeSut()
    await sut.add({
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answer: 'any_answer',
      }, {
        answer: 'other_answer',
      }],
      date: new Date(),
    })
    const survey = surveyCollection.findOne({ question: 'any_question' })
    expect(survey).toBeTruthy()
  })
})
