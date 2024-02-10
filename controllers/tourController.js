const { verifyTokenAdmin, verifyToken } = require("../middlewares/verifyToken");
const category = require("../models/category");
const tours = require("../models/tours");
const Tour = require("../models/tours");
const tourController = require("express").Router()


// get all
//tourController.get('/', verifyToken, async (req, res) => {
    tourController.get('/',async (req, res) => {
    const type = req.query.type

    let tours
    try {
        if (type) {
            tours = await Tour.find({ type: type }).limit(15)
            console.log(tours)
        } else {
            tours = await Tour.find({}).limit(15)
        }
        return res.status(200).json(tours)
    } catch (error) {
       return res.status(500).json(error);
    }
})

// // get types and their corresponding numbers
// tourController.get('/find/types', async (req, res) => {
//     try {
//         const apartment = await Tour.find({ type: 'apartment' }).countDocuments()
//         const villa = await Tour.find({ type: 'villa' }).countDocuments()
//         const penthouse = await Tour.find({ type: 'penthouse' }).countDocuments()
//         const bungalow = await Tour.find({ type: 'bungalow' }).countDocuments()

//         return res.status(200).json({ apartment, villa, penthouse, bungalow })
//     } catch (error) {
//        return res.status(500).json(error);
//     }
// })

tourController.get('/typesData', async (req, res) => {
    try {
        const toursData = await Tour.aggregate([
            {
                "$lookup": {
                  "from": "categories",
                  "let": {
                    searchId: {
                      "$toObjectId": "$type"
                    }
                  },
                  "pipeline": [
                    {
                      $match: {
                        $expr: {
                          $eq: [
                            "$_id",
                            "$$searchId"
                          ]
                        }
                      }
                    }
                  ],
                  "as": "courseDetails"
                }
              },
              {
                $match: {
                  courseDetails: {
                    $ne: []
                  }
                }
              },
              {
                $unwind: "$courseDetails"
              },
              {
                $group: {
                  _id: "$type",
                  course: {
                    $first: "$courseDetails"
                  },
                  countdata: {
                    $sum: 1
                  }
                }
              },
              {
                $replaceRoot: {
                  newRoot: {
                    $mergeObjects: [
                      "$course",
                      "$$ROOT"
                    ]
                  }
                }
              },
              {
                $project: {
                  courseDetails: 0
                }
              }
          ])
           return res.status(200).json(toursData);
        
    } catch (error) {
        return res.status(500).json(error);
        
    }


 })
 
 tourController.get('/find/:id', async (req, res) => {
    const id = req.params.id
    try {
        const tours = await Tour.find({ type: id });
        return res.status(200).json(tours)
    } catch (error) {
       return res.status(500).json(error);
    }
})


// // get 
tourController.get('/details/:id', async (req, res) => {
    const id = req.params.id
    try {
        const tours = await Tour.findById(id)
        return res.status(200).json(tours)
    } catch (error) {
       return res.status(500).json(error);
    }
})

// // create
tourController.post('/', verifyTokenAdmin, async (req, res) => {
    try {
        
        const createdTour = await Tour.create(req.body)
        return res.status(201).json(createdTour)
    } catch (error) {
       return res.status(500).json(error);
    }
})

// // update
tourController.put('/:id', verifyTokenAdmin, async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
        return res.status(200).json(tour)
    } catch (error) {
       return res.status(500).json(error);
    }
})

// // delete
tourController.delete('/:id', verifyTokenAdmin, async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id)
        return res.status(200).json({ msg: 'Tour has been deleted successfully' })
    } catch (error) {
       return res.status(500).json(error);
    }
})

// // book tour
tourController.put('/bookTour/:id', verifyToken, async (req, res) => {
    try {
        const { unavailableDates } = req.body
        const tour = await Tour.findByIdAndUpdate(req.params.id)

        Tour.unavailableDates = Tour.unavailableDates.concat(unavailableDates)
        await Tour.save()

        return res.status(200).json(tour)
    } catch (error) {
       return res.status(500).json(error);
    }
})

module.exports = tourController