var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var rxp_AITableSchema = mongoose.Schema({
    
	AI_Code     	  				 	:Number,
    AI_Name     	 				 	:String,
    AI_ATC_Code							:[String],
    AI_NDC_Code                         :String,
    AI_Status 						 	:Number,
    AI_Pharmaceutical_Categories_ID  	:[Number],
    AI_FDAFeed			 				:String,
    AI_EUFeed			 				:String,
    AI_ClinicalPracticeGuidelines	 	:String,
    AI_Contraindications				:String,
    AI_Warnings_Precautions  			:String,
    AI_AdverseReactionsConcerns 		:String,
    AI_DiseaseRelatedConcerns			:String,
    AI_DoseFormSpecificIssues			:String,
    AI_Others							:String,
    AI_GeriatricConsideration			:String,
    AI_PregnancyConsideration			:String,
    AI_VersionCode                      :Number,


},{
    toObject: { virtuals: true }
});

rxp_AITableSchema.virtual('pharamaceutical', {
    ref: 'rxp_pharmaceutical_category',
    localField: 'AI_Pharmaceutical_Categories_ID',
    foreignField: 'Pharmaceutical_Category_Code',
    justOne: false // for many-to-1 relationships

});


var AI_table = module.exports = mongoose.model('rxp_ai', rxp_AITableSchema);


module.exports.getLastCode = function(callback){
    
    AI_table.findOne({},callback).sort({AI_Code:-1});
}
