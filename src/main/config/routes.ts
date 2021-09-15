import { Express, Router } from 'express'
import fs from 'fs'
import { join } from 'path'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  const routesDirPath = join(__dirname, '..', 'routes')
  fs.readdirSync(routesDirPath).map(async file => {
    if (!file.includes('.test.')) {
      (await import(`${routesDirPath}/${file}`)).default(router)
    }
  })
}
