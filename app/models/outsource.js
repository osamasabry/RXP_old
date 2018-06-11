var mongoose = require('mongoose');

var OutsourceSchema = mongoose.Schema({
    
	code     : String,
    name     : String
    
});


module.exports = mongoose.model('rxp_outsources', OutsourceSchema);
