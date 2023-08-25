// Import the 'app' module from the 'app.js' file
import app from './app.js'
// Import the 'dotenv' module to load environment variables from a '.env' file
import dotenv from 'dotenv'
// Load environment variables from the '.env' file
dotenv.config()
// Define the port number on which the server will listen with 5000 as backup
const PORT = process.env.PORT || 5000
// Start the server and listen on the specified port
app.listen(PORT, console.log(`Server Started on ${PORT}`)) // Output a message to the console indicating that the server has started
