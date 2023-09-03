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

        // Is it an array of length 4
        expect(res.body).toBeInstanceOf(Array)
        expect(res.body).toHaveLength(4)

        // Is the 1st element a book with all its fields intact
        expect(res.body[0]._id).toBeDefined()
        expect(res.body[0].title).toBeDefined()
        expect(res.body[0].author).toBeDefined()
        expect(res.body[0].condition).toBeDefined()
        expect(res.body[0].status).toBeDefined()
        expect(res.body[0].year).toBeDefined()

        // Safe to assume the other elements are books
        // with their required attributes
        expect(res.body[1]._id).toBeDefined()
        expect(res.body[2]._id).toBeDefined()
        expect(res.body[3]._id).toBeDefined()
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

        // Assert changed fields
        expect(res.body.title).toBeDefined()
        expect(res.body.title).toMatch('Dummy Title')
        expect(res.body.author).toBeDefined()
        expect(res.body.author).toMatch('Dummy Author')

        // Assert the rest of the fields
        expect(res.body._id).toBeDefined()
        expect(res.body.condition).toBeDefined()
        expect(res.body.condition).toMatch('Good')
        expect(res.body.status).toBeDefined()
        expect(res.body.status).toMatch('Available')
        expect(res.body.edition).toBeDefined()
        expect(res.body.edition).toMatch('3rd Edition')
        expect(res.body.year).toBeDefined()
        expect(res.body.year).toMatch('2019')

        // Set the book id to be used by the next test
        if (res.body._id)
        {
            book_id = res.body._id
        }
    })

    test ('Missing Book Attributes in Request', async () => {
        let res = await request(app).post('/books').send({
            "condition": "Good",
            "status": "Available",
            "edition": "3rd Edition",
            "year": "2019"
        }).set({ Authorization: `Bearer ${token}` })

        // Assert that the correct http status code and error message is returned
        expect(res.status).toBe(500)
        expect(res.header['content-type']).toMatch('json')
        expect(res.body.message).toMatch('Book validation failed: author: Path `author` is required., title: Path `title` is required.')
    })
})

describe('GET /books/:book_id', () => {
    jest.setTimeout(20000);

    test ('Get single book for logged in user', async () => {
        let res = await request(app).get(`/books/${book_id}`).set({ Authorization: `Bearer ${token}` })
        expect(res.status).toBe(201)
        expect(res.header['content-type']).toMatch('json')
        expect(res.body.title).toMatch('Dummy Title')
        expect(res.body.author).toBeDefined()
        expect(res.body.author).toMatch('Dummy Author')
        expect(res.body._id).toBeDefined()
    })

    test ('Get book that does not exist in users collection', async () => {
        let res = await request(app).get(`/books/74f319f2d3b219c62633b4a3`).set({ Authorization: `Bearer ${token}` })

        expect(res.status).toBe(404)
        expect(res.header['content-type']).toMatch('json')
        expect(res.body.message).toMatch('Book not found')
    })
})

describe('PUT /books/:book_id', () => {
    jest.setTimeout(20000);

    // Use the same book id used in previous 2 tests
    test ('Update book in logged in user\'s collection', async () => {
        let res = await request(app).put(`/books/${book_id}`).send({
            "title": "Dummy Title 2",
            "author": "Dummy Author 2"
        }).set({ Authorization: `Bearer ${token}` })
 
        // Assertions to confirm title & author have been changed
        expect(res.status).toBe(201)
        expect(res.header['content-type']).toMatch('json')
        expect(res.body.title).toBeDefined()
        expect(res.body.title).toMatch('Dummy Title 2')
        expect(res.body.author).toBeDefined()
        expect(res.body.author).toMatch('Dummy Author 2')
        expect(res.body._id).toBeDefined()
    })

    test ('Update a book that does not exist in users collection', async () => {
        let res = await request(app).put(`/books/74f319f2d3b219c62633b4a3`).set({ Authorization: `Bearer ${token}` })

        expect(res.status).toBe(404)
        expect(res.header['content-type']).toMatch('json')
        expect(res.body.message).toMatch('Could not retrieve book to update')
    })
})

describe('DELETE /books/:book_id', () => {
    jest.setTimeout(20000);

    test ('Delete Book', async () => {
        let res = await request(app).delete(`/books/${book_id}`).set({ Authorization: `Bearer ${token}` })

        // Assertion looks at http status code only
        expect(res.status).toBe(200)
    })

    test ('Delete book that does not exist in users collection', async () => {
        let res = await request(app).delete(`/books/74f319f2d3b219c62633b4a3`).set({ Authorization: `Bearer ${token}` })

        expect(res.status).toBe(404)
        expect(res.header['content-type']).toMatch('json')
        expect(res.body.message).toMatch('User does not have this book in their collection')
    })
})
