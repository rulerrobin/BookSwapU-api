// Middleware for handling cases where none of the endpoints match
const notFound = (req, res, next) => {
   // If none of the endpoints match, create an error indicating "Not Found" and include the URL
   const error = new Error(`Not Found - ${req.originalUrl}`)
   res.status(404)
   next(error)
}

// Middleware for handling errors
const errorHandler = (err, req, res, next) => { 
   // Determine the appropriate status code (500 if not set)
   const statusCode = res.statusCode === 200 ? 500 : res.statusCode
   res.status(statusCode)
   // Construct the response JSON with the error message

   // Add the preliminary error message to the response
   const errorResponse = { message: err.message }

   // If working in a development environment add the stack trace as well
   if (process.env.NODE_ENV != 'production') {
      errorResponse.stack = err.stack
   }

   res.json(errorResponse)
}

// Export the middleware functions for use in other parts of the application
export { notFound, errorHandler }