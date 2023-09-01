import app from '../app.js'
import { jest } from '@jest/globals'
import request from 'supertest'
import { user2, setup, teardown, response } from './testData.js'

let book_id
let token

beforeAll(async () => {
    await setup(user2)
    token = response.body.token
})

afterAll(async () => {
    await teardown()
})

describe('GET /books', () => {

    jest.setTimeout(20000);

    test ('Get a logged in users book collection', async () => {
        let res = await request(app).get('/books').set({ Authorization: `Bearer ${token}` })
 
        expect(res.status).toBe(201)
        expect(res.header['content-type']).toMatch('json')
    })
})

describe('POST /books', () => {

    jest.setTimeout(20000);

    test ('Add new book to logged in user\'s collection', async () => {
        let res = await request(app).post('/books').send({
            "title": "Dummy Title",
            "author": "Dummy Author",
            "condition": "Good",
            "status": "Available",
            "edition": "3rd Edition",
            "year": "2019"
        }).set({ Authorization: `Bearer ${token}` })
 
        expect(res.status).toBe(201)
        expect(res.header['content-type']).toMatch('json')
        expect(res.body.title).toBeDefined()
        expect(res.body.title).toMatch('Dummy Title')
        expect(res.body.author).toBeDefined()
        expect(res.body.author).toMatch('Dummy Author')
        expect(res.body._id).toBeDefined()

        if (res.body._id)
        {
            book_id = res.body._id
        }
    })
})

describe('GET /books/:book_id', () => {
    jest.setTimeout(20000);

    test ('Get single book for logged in user', async () => {
        let res = await request(app).get(`/books/${book_id}`).set({ Authorization: `Bearer ${token}` })
        expect(res.status).toBe(201)
    })
})

describe('PUT /books/:book_id', () => {
    jest.setTimeout(20000);

    test ('Update book in logged in user\'s collection', async () => {
        let res = await request(app).put(`/books/${book_id}`).send({
            "title": "Dummy Title 2",
            "author": "Dummy Author 2"
        }).set({ Authorization: `Bearer ${token}` })
 
        expect(res.status).toBe(201)
        expect(res.header['content-type']).toMatch('json')
        expect(res.body.title).toBeDefined()
        expect(res.body.title).toMatch('Dummy Title 2')
        expect(res.body.author).toBeDefined()
        expect(res.body.author).toMatch('Dummy Author 2')
        expect(res.body._id).toBeDefined()
    })
})

describe('DELETE /books/:book_id', () => {
    jest.setTimeout(20000);

    test ('Delete Book', async () => {
        let res = await request(app).delete(`/books/${book_id}`).set({ Authorization: `Bearer ${token}` })

        expect(res.status).toBe(200)
    })
})
