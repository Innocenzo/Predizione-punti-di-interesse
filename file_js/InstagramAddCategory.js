//require libs
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

//connect mongodb

mongoose.connect('mongodb://localhost/DataSet');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
console.log('connection successful!');
});

//create schema
var Schema = mongoose.Schema;
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

var instagramIdSchema = new Schema({
             id:  { type: String, required: true, unique: true },
             foursquare_v2_id: { type: String, required: true, unique: true },
             category_place: String

	});

var instagramIdSchema2 = new Schema({
             id:  { type: String, required: true, unique: true },
             foursquare_v2_id: { type: String, required: true, unique: true },
             category_place: String,
             name: String,
             latitude: Number,
             longitude: Number

	});

instagramIdSchema2.plugin(uniqueValidator);
var instagramId2 = mongoose.model('instagram_venues2', instagramIdSchema2);

instagramIdSchema.plugin(uniqueValidator);
var instagramId = mongoose.model('instagram_venues', instagramIdSchema);

venueSchema.plugin(uniqueValidator);
var venue = mongoose.model('venues', venueSchema);

//functions
function updateCategory(id_four,category,lng,lat,name){
//for every id add the field category_place
var stream3 = instagramId.find({'foursquare_v2_id': id_four}).stream();
stream3.on('data', function (doc3) {

  var newdata= {
                  'id' : doc3.id,
                  'foursquare_v2_id' : id_four,
                  "name": name,
                  'category_place': category,
                  "latitude": lat,
                  "longitude":lng
                }

  saveVenues(new instagramId2(newdata));

  }).on('error', function (err) {

    console.log(err);

  }).on('close', function () {

  });

}

function	saveVenues(venues){
	venues.save(function (err) {
		if (err) {

			count2++;
			console.log("venue duplicate = "+ count2);
		}
    else{
			count3++;
			console.log("new venue saved --------------->   "+venues);
			console.log("Number venues save = "+count3);
		}
	});
  return;
};


//retrieve the category of every venue
var count2=0;
var count3=0;
var stream2 = venue.find({}).stream();
stream2.on('data', function (doc2) {
  if (doc2.categories[0]!=undefined) {
    //call the function
    updateCategory(doc2.id,doc2.categories[0].name, doc2.location[0].lng, doc2.location[0].lat,doc2.name);
    console.log(doc2);
  }

}).on('error', function (err) {
  // handle the error
  console.log(err);
}).on('close', function () {
  // the stream is closed
  // console.log("end steam 2!");
});
