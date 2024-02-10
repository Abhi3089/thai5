const Mongoose = require('mongoose');
const categorySchema = new Mongoose.Schema({
	
	type: {
		type: String,
		required: true,
        unique: true,
        
	},
    img:{
        type: String,
        required:true,

    }
},{timestamps: true});


module.exports = Mongoose.model('Category',categorySchema);
