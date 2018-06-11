var mongoose = require('mongoose');

var toolSchema = mongoose.Schema({
    
	code     : String,
    name     : String
    
});


module.exports = mongoose.model('rxp_outsource_tools', toolSchema);
