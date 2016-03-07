var Instagram = require('instagram-node-lib');
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

Instagram.set('client_id', 'client_id');
Instagram.set('client_secret', 'client_secret');
Instagram.set('access_token', 'access_token');


mongoose.connect('mongodb://localhost/DataSet');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log('connection successful!');
  // yay!
});
var Schema = mongoose.Schema;

/**
 * structure venues in mongodb
 */
var venueSchema = new Schema({
             id:  { type: String, required: true, unique: true },
             name: String,
						 contact:     [{
 														 twitter: String,
 														 facebook: Number,
 														 facebookUsername: String,
 														 facebookName: String
 												 }],
						 location:   [{
						 								lat: Number,
						 								lng: Number,
						 								distance: Number,
						 								postalCode: String,
						 								cc: String,
						 								city: String,
						 								state: String,
						 								country: String,
						 								formattedAddress: []
						 						 }],
						categories:  [{
														id: String,
														name: String,
														pluralName: String,
														shortName: String,
														icon:     [{
																					 prefix: String,
																					 suffix: String
																		 	}],
													  primary : Boolean
												 }],
					 verified: Boolean,
		  		 stats:        [{
														checkinsCount: Number,
							 						  usersCount: Number,
							 						  tipCount: Number
												 }],
					 url: String,
					 specials:    [{
														count: Number,
														items: []
												}], //items salva un array []
					 hereNow:     [{
														count: Number,
														summary: String,
														groups:			[{
																					//type: String,
																					name: String,
																					count: Number,
																					items: []
																			 }]  //items salva un array []
												}],
					referralId: String,
					venueChains: []
				 			//venueChains salva un array []
	});

/**
 * structure mediaRecentVenue in mongodb
 */
var mediaRecentVenueSchema = new Schema({
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

/**
 * structure instagramId in mongodb
 */
var instagramIdSchema = new Schema({
             id:  { type: String, required: true, unique: true },
             foursquare_v2_id: { type: String, required: true, unique: true },
             latitude: Number,
             longitude: Number,
             name: String
	});

/**
 * structure mediaRecentIdMax in mongodb
 */
var mediaRecentIdMaxShema = new Schema({
  instagramId: { type: String, required: true, unique: true },
  next_max_id: String
});

// Apply the uniqueValidator plugin to userSchema.
venueSchema.plugin(uniqueValidator);
var Venue = mongoose.model('Venue', venueSchema);

instagramIdSchema.plugin(uniqueValidator);
var InstagramId = mongoose.model('instagram_venues', instagramIdSchema);

mediaRecentVenueSchema.plugin(uniqueValidator);
var MediaRecentVenue = mongoose.model('mediaRecentVenues', mediaRecentVenueSchema);

mediaRecentIdMaxShema.plugin(uniqueValidator);
var MediaRecentIdMax = mongoose.model('mediaRecentIdMax', mediaRecentIdMaxShema);

var count=0;
function readVenues(mediaJSON,venueInstagramId){
		for (var i = 0 ; i < mediaJSON.length; i++) {
      newdata= {'instagramId':venueInstagramId,
                'data' : mediaJSON[i]};
      saveVenues(new MediaRecentVenue(newdata));
			count++;
		 }
		console.log("Number media analizzati = "+ count);
		return ;
}

var count2=0;
var count3=0;

function	saveVenues(media){
	media.save(function (err) {
		if (err) {
      console.log(err);
			count2++;
			console.log("media duplicate = "+ count2);
		}else{
			count3++;
			console.log("new media saved --------------->   "+media);
			console.log("Number media save = "+count3);
		}
	});
}

function updateNextIdMaxVenues(id,max_id){
  MediaRecentIdMax.findOneAndUpdate(
    { instagramId: id },
    { next_max_id: max_id },
    { runValidators: true, context: 'query' },
    function(err) {
      if (err) {
        console.log(err);
  			count2++;
  			console.log("error = "+ count2);
  		}else{
  			count3++;
  			console.log("new venue update --------------->   "+id+"   next_max_id= "+max_id);
  			console.log("Number venues update = "+count3);
  		}
    }
);
}

var stream = InstagramId.find({},{"id":1}).limit(1).stream();
stream.on('data', function (doc) {
  // do something with the mongoose document
  console.log(doc.id );
  Instagram.locations.recent({location_id: doc.id,
                              complete: function(data, pagination){
                              idMaxVenue = {
                                              "instagramId":doc.id,
                                              "next_max_id":pagination.next_max_id
                              };
                              if(typeof pagination.next_max_id !== "undefined"){
                                saveVenues(new MediaRecentIdMax(idMaxVenue));
                                updateNextIdMaxVenues(doc.id,pagination.next_max_id);
                              }
                              readVenues(data,doc.id);
                              // data is a javascript object/array/null matching that shipped Instagram
                              // when available (mostly /recent), pagination is a javascript object with the pagination information
                              },
                              error: function(errorMessage, errorObject, caller){
                              // errorMessage is the raised error message
                              // errorObject is either the object that caused the issue, or the nearest neighbor
                              // caller is the method in which the error occurred
                              console.log(errorMessage+"--enzo-- "+errorObject+"--enzo"+caller);
                              }});
}).on('error', function (err) {
  // handle the error
  console.log(err);
}).on('close', function () {
  // the stream is closed
});
