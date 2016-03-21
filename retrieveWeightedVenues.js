var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/dataset');
var uniqueValidator = require('mongoose-unique-validator');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log('connection successful!');
});

// CREAZIONE SCHEMA
var Schema = mongoose.Schema;

var venueSchema = new Schema({


             id:  String,
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
						 								postalCode: Number,
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


  var userIdSchema = new Schema({

            user_id: { type: Number, index: { dropDups: true, required: true, unique: true }},
            venues: [ ]

  });

  var instagramIdSchema = new Schema({
    //dati da foursquare

               id:  { type: String, required: true, unique: true },
               foursquare_v2_id: { type: String, required: true, unique: true },
               latitude: Number,
               longitude: Number,
               name: String
  });



  var venueWeightedSchema = new Schema({

        user_id: { type: Number, index: { dropDups: true, required: true, unique: true }},
        venues : {
                     id_instagram: [String],
                     id_foursquare: [String],
                     categorie: [String],
                     weight: [Number]
                 }

  });


  venueSchema.plugin(uniqueValidator);
  var Venue = mongoose.model('Venue', venueSchema);
  userIdSchema.plugin(uniqueValidator);
  var UserId = mongoose.model('users', userIdSchema);
  instagramIdSchema.plugin(uniqueValidator);
  var InstagramId = mongoose.model('instagram_venues', instagramIdSchema);
  venueWeightedSchema.plugin(uniqueValidator);
  var VenueWeighted = mongoose.model('venues_weighted', venueWeightedSchema);

  // calcolo dei pesi per ogni luogo

  var stream = UserId.find().limit().stream();
  stream.on('data',function(doc) {

//    console.log(doc.user_id);
//    console.log(doc.venues);

  var count = 0

  var VenuesW = new VenueWeighted()
  VenuesW.user_id=doc.user_id;

  for (var j=0; j<doc.venues.length; j++){
  //    console.log('ciclo esterno');
    for (var i=0; i<doc.venues.length; i++){
  //    console.log('ciclo interno');
  //    console.log('j: '+j+' valore: '+doc.venues[j]);
  //    console.log('i: '+i+' valore: '+doc.venues[i]);
      if(i!=j){
        if(doc.venues[j]!=null && doc.venues[i]!=null)
          if(doc.venues[j]==doc.venues[i]){
            count++
            doc.venues[i]=null
  //          console.log('uguali');
          }
      }
      else if(doc.venues[j]!=null) {
        count++;
  //      console.log('divesi');
      }
  }


  if(doc.venues[j]!=null){
    VenuesW.venues.id_instagram.push(doc.venues[j]);
    VenuesW.venues.weight.push(count)

  }

  count=0;

}

  ReadIdFoursquare(VenuesW)


}).on('error', function (err) {
  // handle the error
  console.log(err);
}).on('close', function () {
 // the stream is closed
  stream.destroy()
  console.log("Finish!");
});



function ReadIdFoursquare(VenueWeighted){

  //console.log(VenueWeighted.venues.id_instagram.length);

  for(var i=0; i<VenueWeighted.venues.id_instagram.length;i++){

  //  console.log(VenueWeighted.venues.id_instagram[i]);


    var stream = InstagramId.find({'id': VenueWeighted.venues.id_instagram[i]}).limit().stream()
      stream.on('data',function(doc){

          for(var j=0; j<VenueWeighted.venues.id_instagram.length;j++){

              if(doc.id==VenueWeighted.venues.id_instagram[j]){

                VenueWeighted.venues.id_foursquare.push(doc.foursquare_v2_id);
                //console.log(doc.foursquare_v2_id);

              }
          }

          VenueWeighted.save(function (err) {
            if (err) {
              //return console.error("user duplicate not save: "+err);
            }else{
              //return console.log("user new save");
            }
          });


      })
  }
}
