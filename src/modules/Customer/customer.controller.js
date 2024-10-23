import { ObjectId } from 'mongodb'
import { Customer } from '../../../DB/models/customer.model.js'
import bcrypt from 'bcrypt'

export const signUp = async (req, res) => {
    const {name, email, password, phoneNumber} = req.body 

    try {
        const ifEmailExist = await Customer.findOne({email})

        if(ifEmailExist){
            return res.status(400).json({massage: "email is already exists"})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newCustomer = {
            name,
            email,
            password: hashedPassword,
            phoneNumber
        }

        const userData = await Customer.insertOne(newCustomer)

        return res.status(200).json({message: "Customer Registered", user: userData})
    } catch (error) {
        return res.status(500).json({message: "internal server error", error})
    }
}

export const logIn = async (req, res) => {
    const {email, password} = req.body
    try {
        // check if user exists
    
        const user = await Customer.findOne({email})
    
        if (!user) {
            return res.status(400).json({massage: 'invalid credentials'})
        }
    
        // check password
        const checkPassword = await bcrypt.compare(password, user.password)
    
        if(!checkPassword){
            return res.status(400).json({massage: 'invalid credentials'})
        }
    
        res.status(200).json({massage: 'login successfully', data: user})
    } catch (error) {
        return res.status(500).json({message: "internal server error", error})
    }
}

export const getSpecificUser = async (req, res) => {
    const { id } = req.params 

    try {
        // check id
        if(!ObjectId.isValid(id)){
            return res.status(400).json({massage: "invaled cusomer id"})
        }

        const customer = await Customer.findOne({_id: new ObjectId(id)})
        if(!customer){
            return res.status(404).json({ msg: 'User not found' });
        }
        return res.status(200).json({customer: customer})
    } catch (error) {
        return res.status(500).json({message: "internal server error", error})
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const customersData = await Customer.find().toArray()

        return res.status(200).json({message: "all users data", data: customersData})
    } catch (error) {
        return res.status(500).json({message: "internal server error", error})
    }
}

export const updateUser = async (req,res) => {
    const {id} = req.params 
    const {name, email, password, phoneNumber} = req.body

    try {
        // check id

        if(!ObjectId.isValid(id)){
            return res.status(400).json({massage: "invaled cusomer id"})
        }

        const updateUserData = {}
        if(name) updateUserData.name = name
        if(email) updateUserData.email = email
        if(phoneNumber) updateUserData.phoneNumber = phoneNumber
        if(password) updateUserData.password = await bcrypt.hash(password, 10)

        const result = await Customer.updateOne(
            {_id: new ObjectId(id)},
            {$set: updateUserData}
        )

        if(result.matchedCount === 0) {
            return res.status(404).json({ massage: 'User not found' });
        }
        return res.status(200).json({massage: "user updataed successfully", result})
    } catch (error) {
        return res.status(500).json({message: "internal server error", error})
    }
}

export const deleteUser = async (req, res) => {
    const { id } = req.params
    try {
        if(!ObjectId.isValid(id)){
            return res.status(400).json({massage: "invaled cusomer id"})
        }
        const deleteCustomer = await Customer.deleteOne({_id: new ObjectId(id)})

        if(deleteCustomer.deletedCount === 0) {
            return res.status(404).json({ massage: 'User not found' });
        }
        return res.status(200).json({message: "Customer deleted successfully", deleteCustomer})
    } catch (error) {
        return res.status(500).json({message: "internal server error", error})
    }
}