import app from '../app.js'
import { jest } from '@jest/globals'
import request from 'supertest'
import { user1, createSampleUser, deleteSampleUser, response } from './testData.js'

let token

beforeAll(async () => {
    await createSampleUser(user1)
    token = response.body.token
})

afterAll(async () => {
    await deleteSampleUser()
})

// Return logged in user's details
describe('GET /user', () => {
    jest.setTimeout(10000);

    test ('Get details of logged in user', async () => {
        let res = await request(app).get("/user").set({ Authorization: `Bearer ${token}` })

        expect(res.status).toBe(201)
        expect(res.header['content-type']).toMatch('json')
        expect(res.body.username).toBeDefined()
        expect(res.body.username).toMatch('dummy1')
        expect(res.body.email).toBeDefined()
        expect(res.body.email).toMatch('dummy1@gmail.com')
    })
})

describe('PUT /user', () => {
    jest.setTimeout(10000)

    // Update logged in user's email address
    test ('Update logged in User', async () => {
        let res = await request(app).put("/user").send({
            email: "alsatian@gmail.com"
        }).set({ Authorization: `Bearer ${token}` })

        expect(res.status).toBe(201)
        expect(res.header['content-type']).toMatch('json')
        expect(res.body.username).toBeDefined()
        expect(res.body.username).toMatch('dummy')
        expect(res.body.email).toBeDefined()
        expect(res.body.email).toMatch('alsatian@gmail.com')
    })
})

