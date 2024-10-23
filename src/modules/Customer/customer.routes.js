import {Router} from 'express'

import * as customerController from "./customer.controller.js"

const router = Router()

router.post('/signup', customerController.signUp)
router.post('/login', customerController.logIn)
router.get('/getcustomer/:id', customerController.getSpecificUser)
router.get('/getallcustomers', customerController.getAllUsers)
router.put('/updateuser/:id', customerController.updateUser)
router.delete('/deleteuser/:id', customerController.deleteUser)

export default router