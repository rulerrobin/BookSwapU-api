import { UserModel, BookModel, UserInventoryModel, MessageModel, dbClose } from "./db.js"

const users = [
    { username: "SkyrimLord", email: "skywalker@tpg.com.au", password: "password123" },
    { username: "Beelzebub", email: "beelzebub@tpg.com.au", password: "password123" },
    { username: "Tinkerbell", email: "amanadam@internode.on.net", password: "password123" },
    { username: "SolarWarden", email: "defender@gmail.com", password: "password123" },
    { username: "Ratchet", email: "chrome@gmail.com", password: "password123" },
    { username: "Perseus", email: "pete@gamil.com", password: "password123" }
]

await UserModel.deleteMany()
console.log('Deleted Users')
const userCollection = await UserModel.insertMany(users)
console.log('Inserted Users')

const books = [
    {
        title: "Agile Project Management For Dummies",
        author: "Mark C. Layton",
        condition: "Good",
        status: "Available",
        edition: "3rd Edition",
        year: "2020"
    },
    {
        title: "Agile Project Management For Dummies",
        author: "Mark C. Layton",
        condition: "Fair",
        status: "Available",
        edition: "1st Edition",
        year: "2012"
    },
    {
        title: "Scrum For Dummies",
        author: "Mark C. Layton",
        condition: "Good",
        status: "Available",
        edition: "2nd Edition",
        year: "2018"
    },
    {
        title: "UI + UX: Web design simply explained",
        author: "Luca Panzarella",
        condition: "Good",
        status: "Available",
        edition: "1st Edition",
        year: "2022"
    },
    {
        title: "React.js Design Patterns: Learn how to build scalable React apps with ease (English Edition)",
        author: "Anthony Onyekachukwu Okonta",
        condition: "Good",
        status: "Available",
        edition: "1st Edition",
        year: "2023"
    },
    {
        title: "ReactJS for Jobseekers: The Only Guide You Need to Learn React and Crack Interviews (English Edition)",
        author: "Qaifi Khan",
        condition: "New",
        status: "Available",
        edition: "1st Edition",
        year: "2023"
    },
    {
        title: "Learning React: Modern Patterns for Developing React Apps",
        author: "Eve Porcello and Alex Banks",
        condition: "Good",
        status: "Available",
        edition: "2nd Edition",
        year: "2020"
    },
    {
        title: "Learning React: Modern Patterns for Developing React Apps",
        author: "Eve Porcello and Alex Banks",
        condition: "Good",
        status: "Available",
        edition: "1st",
        year: "2013"
    },
    {
        title: "Discrete Mathematics with Applications, Metric Edition",
        author: "Susanna Epp",
        condition: "Good",
        status: "Available",
        edition: "5th Edition",
        year: "2019"
    }
]

await BookModel.deleteMany()
console.log('Deleted Books')
const bookCollection = await BookModel.insertMany(books)
console.log('Inserted Books')

const userInventory = [
    { user: userCollection[0], book: bookCollection[0] },
    { user: userCollection[1], book: bookCollection[1] },
    { user: userCollection[3], book: bookCollection[2] },
    { user: userCollection[2], book: bookCollection[3] },
    { user: userCollection[5], book: bookCollection[4] },
    { user: userCollection[5], book: bookCollection[5] },
    { user: userCollection[0], book: bookCollection[6] },
    { user: userCollection[3], book: bookCollection[7] },
    { user: userCollection[4], book: bookCollection[8] }
]

await UserInventoryModel.deleteMany()
console.log('Deleted UserInventory')
await UserInventoryModel.insertMany(userInventory)
console.log('Inserted UserInventory')


const messages = [
    {
        sender: userCollection[0],
        receiver: userCollection[3],
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        timestamp: new Date(2023, 8, 10, 10, 40, 0)
    },
    {
        sender: userCollection[3],
        receiver: userCollection[0],
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        timestamp: new Date(2023, 8, 10, 11, 15, 0)
    },
    {
        sender: userCollection[0],
        receiver: userCollection[3],
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        timestamp: new Date(2023, 8, 10, 14, 20, 0)
    },
    {
        sender: userCollection[3],
        receiver: userCollection[0],
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        timestamp: new Date(2023, 8, 10, 15, 57, 0)
    },
    {
        sender: userCollection[0],
        receiver: userCollection[4],
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        timestamp: new Date(2023, 8, 12, 16, 30, 0)
    },
    {
        sender: userCollection[4],
        receiver: userCollection[0],
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        timestamp: new Date(2023, 8, 13, 9, 35, 0)
    },
    {
        sender: userCollection[5],
        receiver: userCollection[3],
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        timestamp: new Date(2023, 8, 14, 12, 30, 0)
    },
    {
        sender: userCollection[3],
        receiver: userCollection[5],
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        timestamp: new Date(2023, 8, 14, 12, 30, 0)
    },
    {
        sender: userCollection[5],
        receiver: userCollection[4],
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        timestamp: new Date(2023, 8, 15, 12, 50, 0)
    }
]

await MessageModel.deleteMany()
console.log('Deleted Messages')
await MessageModel.insertMany(messages)
console.log('Inserted Messages')

// const dateTime = new Date(2023, 8, 10, 10, 40, 0)

// console.log(dateTime.toLocaleString(undefined, {
//     day:    'numeric',
//     month:  'numeric',
//     year:   'numeric',
//     hour:   '2-digit',
//     minute: '2-digit',
// }))

dbClose()
