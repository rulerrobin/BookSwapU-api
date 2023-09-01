import app from '../app.js'
import { jest } from '@jest/globals'
import request from 'supertest'
import { UserModel } from "../models/userModel.js"
let sampleUser = { username: "dummy", email: "dummy@gmail.com", password: "password123" }

// Return logged in user's details
describe('GET /user', () => {
    let response
    let token
    let insertedUser

    jest.setTimeout(10000);

    beforeAll(async () => {
        insertedUser = await UserModel.create(sampleUser)

        response = await request(app).post("/users/login").send({
            email: "dummy@gmail.com",
            password: "password123"
        })

        token = response.body.token
    })

    test ('Get details of logged in user', async () => {
        let res = await request(app).get("/user").set({ Authorization: `Bearer ${token}` })

        expect(res.status).toBe(201)
        expect(res.header['content-type']).toMatch('json')
        expect(res.body.username).toBeDefined()
        expect(res.body.username).toMatch('dummy')
        expect(res.body.email).toBeDefined()
        expect(res.body.email).toMatch('dummy@gmail.com')
    })

    afterAll(async () => {
        let deletedUser = await UserModel.findByIdAndDelete(insertedUser._id)
    })
})

describe('PUT /user', () => {
    let response
    let token
    let insertedUser

    jest.setTimeout(10000)

    beforeAll(async () => {
        insertedUser = await UserModel.create(sampleUser)

        response = await request(app).post("/users/login").send({
            email: "dummy@gmail.com",
            password: "password123"
        })

        token = response.body.token
    })

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

    afterAll(async () => {
        let deletedUser = await UserModel.findByIdAndDelete(insertedUser._id)
    })
})

