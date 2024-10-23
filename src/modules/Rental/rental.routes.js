import { Router } from "express"
import * as rentalController from "./rental.controller.js"

const router = Router()

router.post('/addrent', rentalController.addRent)
router.put('/updaterental/:id', rentalController.rentalUpdate)
router.delete('/deleterental/:id', rentalController.deleteRental)
router.get('/rents', rentalController.allrents)
router.get('/rent/:id', rentalController.specificRental)

export default router