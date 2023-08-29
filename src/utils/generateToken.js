// Import the 'jsonwebtoken' module for working with JSON Web Tokens (JWT
import jwt from 'jsonwebtoken'
// Define a function 'generateToken' that takes an 'id' as input
const generateToken = (_id) => {

   // Use the 'jwt.sign()' function to create a JWT
   // Payload: data you want to include in the token (here, just the 'id')
   // Secret key for signing the token, loaded from the environment variable
   const token = jwt.sign({_id}, process.env.JWT_SECRET, { 
      // Token expiration: set to expire in 30 days
      expiresIn: "30d",
   })

   return token
}
// Export the 'generateToken' function to be used in other parts of the application
export default generateToken