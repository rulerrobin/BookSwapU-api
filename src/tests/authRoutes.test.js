import app from '../app.js'
import { jest } from '@jest/globals'
import request from 'supertest'
import { UserModel } from "../models/userModel.js"

describe('GET /', () => {
    let res

    beforeAll(async () => {
        res = await request(app).get('/')
        console.log(res.body)
    })

    test ('Returns "info": "BookSwapU API!"', () => {
        expect(res.status).toBe(200)
        expect(res.header['content-type']).toMatch('json')
        expect(res.body.info).toBeDefined()
        expect(res.body.info).toMatch('BookSwapU API')
    })

})

describe('POST /users/register', () => {
    let res

    jest.setTimeout(10000);

    beforeAll(async () => {
        res = await request(app).post('/users/register').send({
            username: 'dummy',
            email: 'dummy@gmail.com',
            password: 'password123'
        })
    })

    test ('Register User', () => {

        expect(res.status).toBe(201)
        expect(res.header['content-type']).toMatch('json')
        expect(res.body.username).toBeDefined()
        expect(res.body.username).toMatch('dummy')
        expect(res.body.email).toBeDefined()
        expect(res.body.email).toMatch('dummy@gmail.com')

    })
})

describe('POST /users/login', () => {
    let res

    beforeAll(async () => {
        res = await request(app).post('/users/login').send({
            email: 'dummy@gmail.com',
            password: 'password123'
        })
    })

    test ('Authorize User', () => {
        expect(res.status).toBe(200)
        expect(res.header['content-type']).toMatch('json')
        expect(res.body._id).toBeDefined()

        expect(res.body.username).toBeDefined()
        expect(res.body.username).toBe('dummy')

        expect(res.body.email).toBeDefined()
        expect(res.body.email).toBe('dummy@gmail.com')

        expect(res.body.token).toBeDefined()
    })

    afterAll(async () => {
        let deletedUser = await UserModel.findByIdAndDelete(res.body._id)
    })
})
