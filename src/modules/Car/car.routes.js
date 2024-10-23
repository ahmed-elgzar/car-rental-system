import { Router } from "express"
import * as carController from "./car.controller.js"

const router = Router()

router.post('/addcar', carController.addCar)
router.get('/getcar/:id', carController.getCar)
router.get('/getallcars', carController.getAllCars)
router.put('/updatecar/:id', carController.updatCar)
router.delete('/deletecar/:id', carController.deleteCar)
router.get('/getcarbymodel', carController.carsWithModel)
router.get('/availablecars', carController.getAailableCars)
router.get('/rentedormodel', carController.rentedOrModelCar)
router.get('/carconditions', carController.conditionCars)

export default router