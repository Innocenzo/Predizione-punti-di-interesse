var Instagram = require('instagram-node-lib');
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

Instagram.set('client_id', 'b59fbe4563944b6c88cced13495c0f49');
Instagram.set('client_secret', '27699dbee9d14d2394fc17f1e8606cdb');
Instagram.set('access_token', '2333976090.44e6baf.97354e48b41f4072b7f6e648c6059584');

mongoose.connect('mongodb://localhost/DataSet');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log('connection successful!');
  // yay!
  var stream = Venue.find({},{"id":1}).limit(5000).skip(0).stream();

  stream.on('data', function (doc) {
    // do something with the mongoose document
    console.log(doc.id);

    Instagram.locations.search({foursquare_v2_id: doc.id,
                                complete: function(data, pagination){
                                readVenues(data[0],doc.id);
                                // data is a javascript object/array/null matching that shipped Instagram
                                // when available (mostly /recent), pagination is a javascript object with the pagination information
                                },
                                error: function(errorMessage, errorObject, caller){
                                // errorMessage is the raised error message
                                // errorObject is either the object that caused the issue, or the nearest neighbor
                                // caller is the method in which the error occurred
                                console.log(errorMessage+" ----- "+errorObject+" ***** "+caller);
                                console.log("Number venues null = "+ count4++);
                                }});
  }).on('error', function (err) {
    // handle the error
    console.log(err);
  }).on('close', function () {
    // the stream is closed
  });
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
												}],
					 hereNow:     [{
														count: Number,
														summary: String,
														groups:			[{
																					//type: String,
																					name: String,
																					count: Number,
																					items: []
																			 }]
												}],
					referralId: String,
					venueChains: []
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

// Apply the uniqueValidator plugin to venueSchema.
venueSchema.plugin(uniqueValidator);
var Venue = mongoose.model('Venue', venueSchema);
instagramIdSchema.plugin(uniqueValidator);
var InstagramId = mongoose.model('instagram_venues', instagramIdSchema);

var count=0;


function readVenues(venuesJSON,foursquare_id){
    var venues = new InstagramId ;
    venues.id = venuesJSON.id;
    venues.foursquare_v2_id = foursquare_id;
    venues.latitude = venuesJSON.latitude;
    venues.longitude = venuesJSON.longitude;
    venues.name = venuesJSON.name;
    saveVenues(venues);
    count++;
		console.log("Number Venues analizzati = "+ count);
		return ;
}


var count2=0;
var count3=0;
var count4=0;
function	saveVenues(venues){
	venues.save(function (err) {
		if (err) {
      // console.log(err);
			count2++;
			console.log("venue duplicate = "+ count2);
		}else{
			count3++;
			console.log("new venue saved --------------->   "+venues.id);
			console.log("Number venues save = "+count3);
		}
	});
}
