var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');


newSchema=mongoose.Schema;

var TNMasterRevisionsSchema=new newSchema(newSchema.Types.Mixed, {strict: false});

TNMasterRevisionsSchema.add({TN_Master_Clinical_Data_Revision_Code:'Number'});

var TNMasterRevisions  = module.exports = mongoose.model('rxp_TN_master_clinical_data_revision', TNMasterRevisionsSchema);

module.exports.getLastCode = function(callback){
    
    TNMasterRevisions.findOne({},callback).sort({_id:-1});
}