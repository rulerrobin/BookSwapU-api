import app from '../app.js'
import request from 'supertest'

let book_id

describe('GET /books', () => {
    let response
    let token

    beforeAll(async () => {
        response = await request(app).post("/users/login").send({
            email: "zebra@gmail.com",
            password: "password123"
        })

        token = response.body.token
    })

    test ('Get a logged in users book collection', async () => {
        let res = await request(app).get('/books').set({ Authorization: `Bearer ${token}` })
 
        expect(res.status).toBe(201)
        expect(res.header['content-type']).toMatch('json')
    })

})

describe('POST /books', () => {
    let response
    let token

    beforeAll(async () => {
        response = await request(app).post("/users/login").send({
            email: "zebra@gmail.com",
            password: "password123"
        })

        token = response.body.token
    })

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
    let response
    let token

    beforeAll(async () => {
        response = await request(app).post("/users/login").send({
            email: "zebra@gmail.com",
            password: "password123"
        })

        token = response.body.token
    })

    test ('Register User', async () => {
        let res = await request(app).get(`/books/${book_id}`).set({ Authorization: `Bearer ${token}` })
        console.log(res.body)

        expect(res.status).toBe(201)
    })
})

describe('PUT /books/:book_id', () => {
    let response
    let token

    beforeAll(async () => {
        response = await request(app).post('/users/login').send({
            email: "zebra@gmail.com",
            password: "password123"
        })

        token = response.body.token
    })

    test ('Update book in logged in user\'s collection', async () => {
        let res = await request(app).put(`/books/${book_id}`).send({
            "title": "Dummy Title 2",
            "author": "Dummy Author 2"
        }).set({ Authorization: `Bearer ${token}` })
        console.log(res.body)
 
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
    let response
    let token

    beforeAll(async () => {
        response = await request(app).post('/users/login').send({
            email: "zebra@gmail.com",
            password: "password123"
        })

        token = response.body.token
    })

    test ('Delete Book', async () => {
        let res = await request(app).delete(`/books/${book_id}`).set({ Authorization: `Bearer ${token}` })

        expect(res.status).toBe(200)
    })
})
