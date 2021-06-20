const app = require('../src/server/index.js')
const supertest = require('supertest')
const request = supertest(app)



it('should /get from /getWeatherData', async (done) => {
    const res = await request.get('/getWeatherData')
    expect(res.statusCode).toEqual(200)
  })

//Got some help from here: https://knowledge.udacity.com/questions/336147