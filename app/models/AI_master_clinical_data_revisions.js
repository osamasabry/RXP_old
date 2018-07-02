var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');


newSchema=mongoose.Schema;

var AIMasterRevisionsSchema=new newSchema(newSchema.Types.Mixed, {strict: false});


AIMasterRevisionsSchema.add({AI_Master_Clinical_Data_Revision_Code:'Number'});
AIMasterRevisionsSchema.add({AI_Code:'Number'});


var AIMasterRevisions  = module.exports = mongoose.model('rxp_AI_master_clinical_data_revision', AIMasterRevisionsSchema);

module.exports.getLastCode = function(callback){
    
    AIMasterRevisions.findOne({},callback).sort({_id:-1});
}