var Instagram = require('instagram-node-lib');
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

count5=0;
count6=0;
countClose=0;
mongoose.connect('mongodb://localhost/DataSet');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {

  console.log('connection successful!');

      MediaRecentVenue.count({}, function( err, count){
              console.log( "Number of media:", count );
                var stream2 = MediaRecentVenue.find({}).limit(count).stream();
                stream2.on('data', function (doc2) {
                  countClose++;
                  // console.log(doc2.data[0].user[0].id+"   "+doc2.instagramId);
                  updateNextIdMaxVenues(doc2.data[0].user[0].id,doc2.instagramId);
                  // do something with the mongoose document
                }).on('error', function (err) {
                  // handle the error
                  console.log(err);
                }).on('close', function () {
                  // the stream is closed
                  if (count==countClose) {
                    setTimeout(function () {
                        console.log("Number venues added: "+countClose);
                        mongoose.connection.close();
                    }, 3000);

                  }
                });
      });
});
var Schema = mongoose.Schema;


var mediaRecentVenueSchema = new Schema({
  //dati da Instagram
  // instagramId: String,
  data: [{
             attribution: String, //null
             tags:  [],
          //    type: [],
             location:     [{
                               latitude: Number,
                               name: String,
                               longitude: Number,
                               id: Number
                           }],
             comments:  [{
                               count: Number,
                               data:     [{
                                             created_time: Number,
                                             text: String,
                                             from:       [{
                                                             username: String,
                                                             profile_picture: String,
                                                             id: Number,
                                                             full_name: String
                                                         }],
                                             id: Number
                                        }]

                       }],
            filter: String,
            created_time: Number,
            link: String,
            likes:     [{
                           count: Number,
                           data:  [{
                                     username: String,
                                     profile_picture: String,
                                     id: Number,
                                     full_name: String
                                  }]
                       }],
           images:     [{
                           low_resolution:  [{
                                                 url: String,
                                                 width: Number,
                                                 height: Number
                                           }],
                           thumbnail:      [{
                                                 url: String,
                                                 width: Number,
                                                 height: Number
                                           }],
                           standard_resolution:  [{
                                                url: String,
                                                width: Number,
                                                height: Number
                                           }]
                       }],
           users_in_photo:  [{}],
           caption:    [{
                           created_time: Number,
                           text: String,
                           from:  [{
                                      username: String,
                                      profile_picture: String,
                                      id: Number,
                                      full_name: String
                                 }],
                           id: Number
                       }],
           user_has_liked: Boolean,
           id: { type: String, required: true, unique: true },
           user:  [{
                     username: String,
                     profile_picture: String,
                     id: Number,
                     full_name: String
                  }]
                }],
      instagramId: String

	});



var userTimelineSchema = new Schema({
          id:  { type: String, required: true, unique: true },
          venues: [{}],
          listMacro: []
});
// Apply the uniqueValidator plugin to userSchema.


mediaRecentVenueSchema.plugin(uniqueValidator);
var MediaRecentVenue = mongoose.model('mediaRecentVenues', mediaRecentVenueSchema);


userTimelineSchema.plugin(uniqueValidator);
var UserTimeline = mongoose.model('userTimeline', userTimelineSchema);

var count2=0;
var count3=0;

function updateNextIdMaxVenues(idx,venues){
  UserTimeline.findOneAndUpdate(
    { id: idx },
    { $push: {venues: venues} },
    { runValidators: true, context: 'query'},
    function(err) {
      if (err) {
        //console.log(err);
  			count2++;
  			console.log("error = "+ count2);
  		}else{
  			count3++;
  			console.log("new user update --------------->   "+idx+"   instagram_Venue= "+venues);
  			console.log("Number venues added = "+count3);
  		}
    }
);
}
