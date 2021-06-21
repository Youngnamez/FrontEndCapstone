const app = require('../src/server/appData')
const supertest = require('supertest')
const request = supertest(app)



test('should GET from /getWeatherData', async () => {
    const res = await request.get('/getWeatherData')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toBeDefined()
  })

//Got some help from here: https://knowledge.udacity.com/questions/336147