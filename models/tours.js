const Mongoose = require('mongoose');
const ToursSchema = new Mongoose.Schema({
	
	title: {
		type: String,
		required: true,
        unique: true,
        
	},
	type:{
		type: String,
		required: true,
	},
    packageTime: {
		type: String,
		required: true,
            
	},
	place: {
		type: String,
		required: true,		
	},
    price: {
		type: Number,
		required: true,
	},
	desc: {
		type: String,
		
	},
    img:{
        type: String,
        required:true,

    }
},{timestamps: true});

module.exports = Mongoose.model('Tour',ToursSchema);
