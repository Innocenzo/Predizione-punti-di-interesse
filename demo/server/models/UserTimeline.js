var angoose = require("angoose"); /** if angoose is installed as module, then require('angoose')*/
var mongoose = angoose.getMongoose();
var UserTimelineSchema = mongoose.Schema({
                  id:   String,
                  venues: [{}],
                  listMacro: []
});
module.exports = mongoose.model('UserTimeline', UserTimelineSchema);


// var UserTimelineSchema = new mongoose.Schema({
//           id:   String,
//           venues: [{}],
//           listMacro: []
// });
//
// mongoose.model('UserTimeline', UserTimelineSchema);
