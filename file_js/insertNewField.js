var Instagram = require('instagram-node-lib');
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var count6=0;
var countClose=0;
mongoose.connect('mongodb://localhost/DataSet');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {

  console.log('connection successful!');
  // updateField("2039279827");
  UserTimeline.count({}, function( err, count){
    console.log( "Number of users:", count );

    var stream = UserTimeline.find({}).limit(count).stream();
    stream.on('data', function (doc) {
      // do something with the mongoose document
      countClose++;
      updateField(doc.id);

    }).on('error', function (err) {
      // handle the error
      console.log(err);
    }).on('close', function () {
      // the stream is closed
      if (count==countClose) {
        setTimeout(function () {
            console.log("users updated: "+countClose);
            mongoose.connection.close();
        }, 4000);

      }
      console.log("enzo"+count);
    });
});


});
var Schema = mongoose.Schema;

var mediaRecentIdMaxShema = new Schema({
  instagramId: { type: String, required: true, unique: true },
  next_max_id: String
});

var userTimelineSchema = new Schema({
          id:  { type: String, required: true, unique: true },
          venues: [{}],
          vetMacro: {}
});
// Apply the uniqueValidator plugin to userSchema.
userTimelineSchema.plugin(uniqueValidator);
var UserTimeline = mongoose.model('userTimeline', userTimelineSchema);


var count2=0;
var count3=0;
function updateField(idx){
  UserTimeline.findOneAndUpdate(
    { id: idx },
    // {$set: { quantity: 500}},
    // { $push: {venues: venues} },
    { $set: {vetMacro: {"ristoranti":0,"caffè":0,"vita notturna":0,"divertimento":0,"interessi culturali":0,"Parchi":0,"shopping":0,"monumento/punto di riferimento":0}} },
    { runValidators: true, context: 'query', new:true},
    function(err) {
      if (err) {
        //console.log(err);
  			count2++;
  			console.log("error = "+ count2);
  		}else{
  			count3++;
  			console.log("Number users updated = "+count3);
  		}
    }
);
}
