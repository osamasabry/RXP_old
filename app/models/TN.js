var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var rxp_TNTableSchema = mongoose.Schema({
    
	TN_Code     	  				 :Number,
    TN_Name     	 				 :String,
    TN_ActiveIngredients 			 :[Number],
    TN_Status 						 :Number,
    TN_Form_ID  					 :Number,
    TN_Route_ID						 :Number,
    TN_Strength_Unit_ID 			 :Number,
    TN_Strength_Value				 :String,
    TN_Weight_Unit_ID			     :Number,
    TN_Weight_Value					 :String,
    TN_Volume_Unit_ID				 :Number,
    TN_Volume_Value 				 :String,
    TN_Concentration_Unit_ID		 :Number,
    TN_Concentration_Value			 :String,
    TN_Country_ID					 :[Number],
},{
    toObject: { virtuals: true }
});

rxp_TNTableSchema.virtual('form', {
    ref: 'rxp_lut_form',
    localField: 'TN_Form_ID',
    foreignField: 'Form_Code',
    justOne: true // for many-to-1 relationships

});

rxp_TNTableSchema.virtual('route',{
    ref: 'rxp_lut_route',
    localField: 'TN_Route_ID',
    foreignField: 'Route_Code',
    justOne: true // for many-to-1 relationships
});

rxp_TNTableSchema.virtual('strength',{
    ref: 'rxp_lut_strength_unit',
    localField: 'TN_Strength_Unit_ID',
    foreignField: 'StrengthUnit_Code',
    justOne: true // for many-to-1 relationships
});

rxp_TNTableSchema.virtual('weight',{
    ref: 'rxp_lut_weight_unit',
    localField: 'TN_Weight_Unit_ID',
    foreignField: 'WeightUnit_Code',
    justOne: true // for many-to-1 relationships
});

rxp_TNTableSchema.virtual('volume',{
    ref: 'rxp_lut_volume_unit',
    localField: 'TN_Volume_Unit_ID',
    foreignField: 'VolumeUnit_Code',
    justOne: true // for many-to-1 relationships
});

rxp_TNTableSchema.virtual('concentration',{
    ref: 'rxp_lut_concentration',
    localField: 'TN_Concentration_Unit_ID',
    foreignField: 'ConcentrationUnit_Code',
    justOne: true // for many-to-1 relationships
});

rxp_TNTableSchema.virtual('country',{
    ref: 'rxp_countries',
    localField: 'TN_Country_ID',
    foreignField: 'Country_Code',
    justOne: false // for many-to-1 relationships
});


rxp_TNTableSchema.virtual('ai',{
    ref: 'rxp_ai',
    localField: 'TN_ActiveIngredients',
    foreignField: 'AI_Code',
    justOne: false // for many-to-1 relationships
});



var TN_table = module.exports = mongoose.model('rxp_tn', rxp_TNTableSchema);


module.exports.getLastCode = function(callback){
    
    TN_table.findOne({},callback).sort({TN_Code:-1});
}