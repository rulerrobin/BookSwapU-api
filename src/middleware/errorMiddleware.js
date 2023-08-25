// Middleware for handling cases where none of the endpoints match
const notFound = (req, res, next) => {
   // If none of the endpoints match, create an error indicating "Not Found" and include the URL
   const error = new Error(`Not Found - ${req.originalURL}`)
   res.status(404)
   next(error)
}

// Middleware for handling errors
const errorHandler = (err, req, res, next) => { 
   // Determine the appropriate status code (500 if not set)
   const statusCode = res.statusCode === 200 ? 500 : res.statusCode
   res.status(statusCode)
   // Construct the response JSON with the error message
   res.json({
      message: err.message,
      // Include the stack trace only in non-production environments
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
   })
}
// Export the middleware functions for use in other parts of the application
export { notFound, errorHandler }