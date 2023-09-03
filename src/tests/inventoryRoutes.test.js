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

    test('Returns an array of 2 elements', async () => {
        const res = await request(app).get('/user_inventory/search').send({
            title: 'Beginning Node',
            author: ''
        }).set({ Authorization: `Bearer ${token}` })

        expect(res.status).toBe(200)
        expect(res.header['content-type']).toMatch('json')

        expect(res.body).toBeInstanceOf(Array)
        expect(res.body).toHaveLength(2)

        expect(res.body[0]._id).toBeDefined()
        expect(res.body[0].user).toBeDefined()
        expect(res.body[0].user._id).toBeDefined()
        expect(res.body[0].book).toBeDefined()
        expect(res.body[0].book._id).toBeDefined()

        expect(res.body[1]._id).toBeDefined()
        expect(res.body[1].user).toBeDefined()
        expect(res.body[1].user._id).toBeDefined()
        expect(res.body[1].book).toBeDefined()
        expect(res.body[1].book._id).toBeDefined()
    })

    test ('Returns an empty array', async () => {
        const res = await request(app).get('/user_inventory/search').send({
            title: 'XXXX YYYY',
            author: 'ZZZZ'
        }).set({ Authorization: `Bearer ${token}` })

        // Assertions for a book that no one has
        expect(res.status).toBe(200)
        expect(res.header['content-type']).toMatch('json')

        expect(res.body).toBeInstanceOf(Array)
        expect(res.body).toHaveLength(0)
    })

    test('No token provided', async () => {
        const res = await request(app).get('/user_inventory/search').send({
            title: 'Beginning Node',
            author: ''
        })

        // Asserts that check msg when no token is provided
        expect(res.status).toBe(403)
        expect(res.header['content-type']).toMatch('json')
        expect(res.body.message).toBeDefined()
        expect(res.body.message).toMatch('Token not provided')
    })
})

