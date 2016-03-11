var Instagram = require('instagram-node-lib');
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');


mongoose.connect('mongodb://localhost/venues');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log('connection successful!');
  var stream = MediaRecentVenue.find({}).stream();
  stream.on('data', function (doc) {
    // do something with the mongoose document
    //console.log(doc.data[0].user[0].id+"   "+doc.instagramId);
    idTimeline = {
                    "id":doc.data[0].user[0].id
    };
    saveVenues(new UserTimeline(idTimeline));


  }).on('error', function (err) {
    // handle the error
    console.log(err);
  }).on('close', function () {
    // the stream is closed
    //mongoose.connection.close();
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
          venues: [{}]
});

// Apply the uniqueValidator plugin to userSchema.
mediaRecentVenueSchema.plugin(uniqueValidator);
var MediaRecentVenue = mongoose.model('mediaRecentVenues', mediaRecentVenueSchema);

userTimelineSchema.plugin(uniqueValidator);
var UserTimeline = mongoose.model('userTimeline', userTimelineSchema);


var count2=0;
var count3=0;
function	saveVenues(user){
	user.save(function (err) {
		if (err) {
      console.log(err);
			count2++;
			console.log("media duplicate = "+ count2);
		}else{
			count3++;
			//console.log("new media saved --------------->   "+user);
			console.log("Number media save = "+count3);
		}
	});
}
