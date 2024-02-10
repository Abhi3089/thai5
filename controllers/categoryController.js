const { verifyTokenAdmin, verifyToken } = require("../middlewares/verifyToken")
const Category = require("../models/category");
const categoryController = require("express").Router()


// get all
categoryController.get('/', async (req, res) => {
    const type = req.query.type

    let categories
    try {
        categories = await Category.find({}).limit(15)    
        return res.status(200).json(categories)
    } catch (error) {
       return res.status(500).json(error);
    }
})


// get 
categoryController.get('/find/:id', async (req, res) => {
    const id = req.params.id
    try {
        const categories = await Category.findById(id)
        return res.status(200).json(categories)
    } catch (error) {
       return res.status(500).json(error);
    }
})

// create
categoryController.post('/',async (req, res) => {
    try {        
        const createdCategory = await Category.create(req.body)
        return res.status(201).json(createdCategory)
    } catch (error) {
       return res.status(500).json(error);
       console.log(error);
    }
})

// update
categoryController.put('/:id', verifyTokenAdmin, async (req, res) => {
    try {
        const tour = await Category.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
        return res.status(200).json(tour)
    } catch (error) {
       return res.status(500).json(error);
    }
})

// delete
categoryController.delete('/:id', verifyTokenAdmin, async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id)
        return res.status(200).json({ msg: 'category has been deleted successfully' })
    } catch (error) {
       return res.status(500).json(error);
    }
})

// book tour
// categoryController.put('/bookTour/:id', verifyToken, async (req, res) => {
//     try {
//         const { unavailableDates } = req.body
//         const tour = await Category.findByIdAndUpdate(req.params.id)

//         Tour.unavailableDates = Tour.unavailableDates.concat(unavailableDates)
//         await Tour.save()

//         return res.status(200).json(tour)
//     } catch (error) {
//        return res.status(500).json(error);
//     }
// })

module.exports = categoryController