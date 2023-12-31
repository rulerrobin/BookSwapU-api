import app from '../app.js'
import request from 'supertest'
import { UserModel } from "../models/userModel.js"
import { BookModel } from "../models/bookModel.js"
import { UserInventoryModel } from "../models/userInventoryModel.js"

const user1 = {
    username: "dummy1",
    email: "dummy1@gmail.com",
    password: "password123"
}

const user2 = {
    username: "dummy2",
    email: "dummy2@gmail.com",
    password: "password123"
}

const user3 = {
    username: "dummy3",
    email: "dummy3@gmail.com",
    password: "password123"
}

const user4 = {
    username: "dummy4",
    email: "dummy4@gmail.com",
    password: "password123"
}

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

// Insert a sample user into db. Log in using that user to 
// produce a web token.
const createSampleUser = async (user) => {
    insertedUser = await UserModel.create(user)
    const { username, ...sampleLogin } = user
    response = await request(app).post("/users/login").send(sampleLogin)
}

// Delete the sample user from the db
const deleteSampleUser = async () => {
    const deletedUser = await UserModel.findByIdAndDelete(insertedUser._id)
}

// Insert a sample user and their associated books. Update user inventory 
// table to link them. Log in with that user to produce a web token.
const setup = async (sampleUser) => {
    insertedUser = await UserModel.create(sampleUser)

    insertedBooks = await BookModel.create(sampleBooks)
    let sampleInventoryItems = insertedBooks.map(book => {
        return { user: insertedUser, book: book }
    })

    bookIds = insertedBooks.map(book => {
        return book._id
    })

    insertedInventoryItems = await UserInventoryModel.create(sampleInventoryItems)

    // Extract login credentials
    const { username, ...sampleLogin } = sampleUser

    // Log in with credentials to generate a web token for use in tests
    response = await request(app).post("/users/login").send(sampleLogin)
}

// Delete the user and all associated entries from database. Called 
// after tests are finished.
const teardown = async () => {
    const deletedInventoryItems = await UserInventoryModel.deleteMany({ user: insertedUser._id })
    const deletedBooks = await BookModel.deleteMany({ _id: { $in: bookIds } })
    const deletedUser = await UserModel.findByIdAndDelete(insertedUser._id)
}

export { user1, user2, user3, user4, setup, teardown, createSampleUser, deleteSampleUser, response }
