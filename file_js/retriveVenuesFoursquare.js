var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var foursquare = (require('foursquarevenues'))('', '');

/**
 * access to mongodb
 */
mongoose.connect('mongodb://localhost/DataSet');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log('connection successful!');
	//---------- geographic coordinates -------------//
	//------------------- north weast  41.977  12.325
	//------------------- north east   41.977  12.619
	//------------------- south weast  41.789  12.619
	//------------------- south east   41.789  12.325

	var contatore=0;
	for (var i = 12.325; i < 12.425; i+=0.01) {
		for (var j = 41.889; j < 41.939; j+=0.01) {
			console.log("<--- request --->"+i+"   "+j);
			var params = {
				"ll": j+","+i,
		    "radius": '500'
			};
			foursquare.getVenues(params, function(error, venues) {
						if (venues !== null) {
						readVenues(venues.response.venues);
					}
			});
			contatore++;
		}
	}
});


var Schema = mongoose.Schema;
/**
 * structure foursquare in mongodb
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

// Apply the uniqueValidator plugin to userSchema.
venueSchema.plugin(uniqueValidator);
var Venue = mongoose.model('Venue', venueSchema);


var count=0;
function readVenues(venuesJSON){
		for (var i = 0 ; i < venuesJSON.length; i++) {
				saveVenues(new Venue(venuesJSON[i]));
				count++;
		 }
		 console.log("Number Venues analized = "+ count);
}
var count2=0;
var count3=0;
function	saveVenues(venues){
	venues.save(function (err) {
		if (err) {
			count2++;
			console.log("venue duplicate = "+ count2);
		}else{
			count3++;
			console.log("new venue saved --------------->   "+venues.id);
			console.log("Number venues save = "+count3);
		}
	});
}
console.log("pending trial!");
