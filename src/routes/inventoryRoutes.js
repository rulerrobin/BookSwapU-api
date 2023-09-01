import { Router } from 'express'
import { searchInventory }  from '../controllers/inventoryControllers.js'

const router = Router()

// GET method request handler which returns the entire contents of 'UserInventoryModel'.
// These are the user-book mappings for every user and every book in the system.
// router.get('/user_inventory', getInventoryAll)

// GET method request handler for retrieving user inventory entries based on title and/or author.
// Returns user and book details matching the given title and/or author.
router.get('/user_inventory/search', searchInventory)

router.post('/user_inventory/search', searchInventory)

// Export the router instance to be used in other parts of the application
export default router
