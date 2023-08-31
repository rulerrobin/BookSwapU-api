// Import the 'jsonwebtoken' module for working with JSON Web Tokens (JWT
import jwt from 'jsonwebtoken'

// Middleware to verify JWT token
function verifyToken(req, res, next) {
   const token = req.get('authorization');
   
   if (!token) {
      return res.status(403).json({ message: 'Token not provided' });
   }

   // Remove the word 'Bearer ' which is prepended to the token
   const credentials = token.replace(/^Bearer\s/, '')
   // const credentials =  token?.split(" ")?.[1]

   jwt.verify(credentials, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
         console.log(err)
         return res.status(401).json({ message: 'Invalid token' });
      }

      // Inserting user info into request before call to next() so 
      // it can be accessed by the route controller.
      req.user = decoded;
      // console.log(req.user)
      next();
   });
 }
 
 // Export the 'verifyToken' function to be used in other parts of the application
export default verifyToken
