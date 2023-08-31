import app from '../app.js'
import request from 'supertest'
import { UserModel } from "../models/userModel.js"
import { BookModel } from "../models/bookModel.js"
import { UserInventoryModel } from "../models/userInventoryModel.js"

const sampleUser = {
    username: "dummy",
    email: "dummy@gmail.com",
    password: "password123"
}

const { username, ...sampleLogin } = sampleUser

const sampleBooks = [
    {
        title: "Beginning Node.js, Express & MongoDB Development",
        author: "Greg Lim",
        condition: "Good",
        status: "Available",
        edition: "3rd Edition",
        year: "2020"
    },
    {
        title: "Beginning Node.js, Express & MongoDB Development",
        author: "Greg Lim",
        condition: "Fair",
        status: "Available",
        edition: "1st Edition",
        year: "2012"
    },
    {
        title: "Web Development with Node and Express: Leveraging the JavaScript Stack",
        author: "Greg Lim",
        condition: "Good",
        status: "Available",
        edition: "2nd Edition",
        year: "2018"
    },
    {
        title: "Express in Action: Writing, Building, and Testing Node.Js Applications",
        author: "Evan Hahn",
        condition: "Good",
        status: "Available",
        edition: "1st Edition",
        year: "2022"
    }
]

let response
let insertedUser
let insertedBooks
let insertedInventoryItems
let bookIds

const setup = async () => {
    insertedUser = await UserModel.create(sampleUser)

    insertedBooks = await BookModel.create(sampleBooks)
    let sampleInventoryItems = insertedBooks.map(book => {
        return { user: insertedUser, book: book }
    })

    bookIds = insertedBooks.map(book => {
        return book._id
    })

    insertedInventoryItems = await UserInventoryModel.create(sampleInventoryItems)

    response = await request(app).post("/users/login").send(sampleLogin)
}

const teardown = async () => {
    const deletedInventoryItems = await UserInventoryModel.deleteMany({ user: insertedUser._id })
    const deletedBooks = await BookModel.deleteMany({ _id: { $in: bookIds } })
    const deletedUser = await UserModel.findByIdAndDelete(insertedUser._id)
}

export { sampleUser, sampleLogin, sampleBooks, setup, teardown, response }
