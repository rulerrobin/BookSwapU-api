import app from '../app.js'
import { jest } from '@jest/globals'
import request from 'supertest'
import { user3, setup, teardown, response } from './testData.js'

let token

beforeAll(async () => {
    await setup(user3)
    token = response.body.token
})

afterAll(async () => {
    await teardown()
})

describe('GET /user_inventory/search', () => {
    jest.setTimeout(20000);

    test ('Returns array of user-book pairs', async () => {
        const res = await request(app).get('/user_inventory/search').send({
            title: 'Beginning Node',
            author: ''
        }).set({ Authorization: `Bearer ${token}` })

        expect(res.status).toBe(200)
        expect(res.header['content-type']).toMatch('json')
    })

    test('Returns an array of 2 elements', async () => {
        const res = await request(app).get('/user_inventory/search').send({
            title: 'Beginning Node',
            author: ''
        }).set({ Authorization: `Bearer ${token}` })

        expect(res.body).toBeInstanceOf(Array)
        expect(res.body).toHaveLength(2)
    })
})

