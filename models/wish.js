const Mongoose = require('mongoose');
const wishSchema = new Mongoose.Schema({
	
	userId: {
		type: String,
		required: true,
       
	},
    tourId:{
        type: String,
        required:true,

    }
},{timestamps: true});


module.exports = Mongoose.model('Wish',wishSchema);
