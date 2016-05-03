var angoose = require("angoose"); /** if angoose is installed as module, then require('angoose')*/
var mongoose = angoose.getMongoose();
var RaccomendedCategorySchema = mongoose.Schema({
                  id_user:   String,
                  list_raccomended: {}
});
module.exports = mongoose.model('RaccomendedCategory', RaccomendedCategorySchema);


// var raccomendedcategorySchema = new Schema({
//             id_user:  { type: String, required: true, unique: true },
//             list_raccomended: {}
//
// });
