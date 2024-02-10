const { verifyTokenAdmin, verifyToken } = require("../middlewares/verifyToken")
const Wish = require("../models/wish");
const wishController = require("express").Router()

// create
wishController.post('/',async (req, res) => {
    try {
        const existingWish = await Wish.findOne({ 
            userId: req.body.userId,tourId: req.body.tourId })
        if (existingWish) {
            return res.status(400).json({ message: 'Data already exists' })
        }
        const createdWish = await Wish.create(req.body)
        return res.status(201).json(createdWish)
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
        
    }
})
// get 
wishController.get('/find/:id', async (req, res) => {
    const id = req.params.id
    try {
        const existingWish = await Wish.findOne({ 
            userId: req.body.userId,tourId: req.body.tourId })
        if (existingWish) {
            return res.status(400).json({ message: 'Data already exists' })
        }
        return res.status(200).json(existingWish)
    } catch (error) {
       return res.status(500).json(error);
    }
})


// get all
wishController.get('/', async (req, res) => {
    const type = req.query.type

    let Wishes
    try {
        Wishes = await Wish.find({}).limit(15)    
        return res.status(200).json(Wishes)
    } catch (error) {
       return res.status(500).json(error);
    }
})
// update
wishController.put('/:id', verifyTokenAdmin, async (req, res) => {
    try {
        const wish = await Wish.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
        return res.status(200).json(tour)
    } catch (error) {
       return res.status(500).json(error);
    }
})

// delete
wishController.delete('/:id', verifyTokenAdmin, async (req, res) => {
    try {
        await Wish.findByIdAndDelete(req.params.id)
        return res.status(200).json({ msg: 'Removed from Wish List' })
    } catch (error) {
       return res.status(500).json(error);
    }
})

module.exports = wishController