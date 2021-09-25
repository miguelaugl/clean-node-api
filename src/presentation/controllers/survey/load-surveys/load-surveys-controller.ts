import { LoadSurveys } from '@/domain/usecases/load-surveys'
import { noContent, ok, serverError } from '@/presentation/helpers/http/http-helper'

import { Controller, HttpRequest, HttpResponse } from './load-surveys-controller-protocols'

export class LoadSurveysController implements Controller {
  constructor (
    private readonly loadSurveys: LoadSurveys,
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load()
      if (!surveys.length) {
        return noContent()
      }
      return ok(surveys)
    } catch (error) {
      return serverError(error)
    }
  }
}
