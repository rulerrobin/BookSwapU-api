import app from '../app.js'
import { jest } from '@jest/globals'
import request from 'supertest'
import { UserModel } from "../models/userModel.js"

let res
let user_id

afterAll(async () => {
    let deletedUser = await UserModel.findByIdAndDelete(user_id)
})

describe('GET /', () => {
    test ('Returns "info": "BookSwapU API!"', async () => {
        
        res = await request(app).get('/')

        expect(res.status).toBe(200)
        expect(res.header['content-type']).toMatch('json')
        expect(res.body.info).toBeDefined()
        expect(res.body.info).toMatch('BookSwapU API')
    })
})

describe('POST /users/register', () => {

    jest.setTimeout(10000);

    test ('Register User', async () => {
        res = await request(app).post('/users/register').send({
            username: 'dummy',
            email: 'dummy@gmail.com',
            password: 'password123'
        })

        expect(res.status).toBe(201)
        expect(res.header['content-type']).toMatch('json')
        expect(res.body.username).toBeDefined()
        expect(res.body.username).toMatch('dummy')
        expect(res.body.email).toBeDefined()
        expect(res.body.email).toMatch('dummy@gmail.com')
        expect(res.body.token).toBeDefined()

        // Assign user id for use in other tests
        if (res.body._id) {
            user_id = res.body._id
        }
    })

    test ('Register User - Mandatory Fields Missing', async () => {
        res = await request(app).post('/users/register').send({
            email: 'sample@gmail.com'
        })

        expect(res.status).toBe(400)
        expect(res.header['content-type']).toMatch('json')
        expect(res.body.message).toMatch('Please enter all required fields')
    })
})

describe('POST /users/login', () => {

    test ('Authorize User', async () => {
        res = await request(app).post('/users/login').send({
            email: 'dummy@gmail.com',
            password: 'password123'
        })

        expect(res.status).toBe(200)
        expect(res.header['content-type']).toMatch('json')
        expect(res.body._id).toBeDefined()

        expect(res.body.username).toBeDefined()
        expect(res.body.username).toBe('dummy')

        expect(res.body.email).toBeDefined()
        expect(res.body.email).toBe('dummy@gmail.com')

        expect(res.body.token).toBeDefined()
    })

    test ('Authorize User Wrong Password', async () => {
        res = await request(app).post('/users/login').send({
            email: 'dummy@gmail.com',
            password: 'wrong-password'
        })

        expect(res.status).toBe(401)
        expect(res.header['content-type']).toMatch('json')
        expect(res.body.message).toMatch('Invalid Email or Password')
    })
})
