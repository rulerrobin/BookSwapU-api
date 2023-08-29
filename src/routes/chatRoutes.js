import express from 'express'

const router = express.router()

router.route('/').post(verifyToken)