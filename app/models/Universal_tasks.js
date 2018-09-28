var mongoose = require('mongoose');

var rxp_UniversalTasksSchema = mongoose.Schema({
    
    Task_Code                                    :Number,
    Task_Title                                   :String,
    Task_AssignTo_Employee_Code                  :Number,
    Task_AssignDate                              :Date,
    Task_ActionTypeName                          :String, //For CMS: Edit, Review, Grammer Review, Publish
    Task_ActionDetails_Code                      :Number, //replace Revision_Code in old version
    Task_RelatedTo                               :String, // Master AI, Master TN, Country Clinical Data, Country non-Clinical Data, And any upcoming relations
    Task_RelatedTo_Code                          :Number, //replace AI_Code and TN_Code in old version
    Task_Status                                  :Number,
    Task_ClosedDate                              :Date

}, {
    toObject: { virtuals: true }
});

rxp_UniversalTasksSchema.virtual('Employee', {
	ref: 'rxp_employees',
	localField: 'Task_AssignTo_Employee_Code',
	foreignField: 'Employee_Code',
	justOne: true // for many-to-1 relationships
  });
  
var Universal_Tasks = module.exports = mongoose.model('RxP_Universal_Task', rxp_UniversalTasksSchema);


module.exports.getLastCode = function(callback){
    Universal_Tasks.findOne({},callback).sort({Task_Code:-1});
}

// icon and color map:
// Edit :
// 		icon 'fa fa-edit'
//		Color '#ef9a29'
// Review:
//		Icon 'fa fa-eye'
//		color '#04ec65'
// Grammer Review
//		icon 'fa fa-flag-o'
//		color '#cfd603'
// Publish
//		icon 'fa fa-cloud-upload'
//		color '#4ebcd4'	