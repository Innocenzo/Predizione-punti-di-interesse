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
var mediaRecentVenueSchema = new Schema({
  //dati da Instagram
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

  var instagramIdSchema = new Schema({
  //dati da foursquare

             id:  { type: String, required: true, unique: true },
             foursquare_v2_id: { type: String, required: true, unique: true },
             latitude: Number,
             longitude: Number,
             name: String

	});

  var userIdSchema = new Schema({

            user_id: { type: Number, index: { dropDups: true, required: true, unique: true }},
            venues: [ ]

  });

  var userSchema = new Schema({

        id: { type: String, index: { dropDups: true, required:true, unique: true}}

  });



  mediaRecentVenueSchema.plugin(uniqueValidator);
  var MediaRecentVenue = mongoose.model('mediaRecentVenues', mediaRecentVenueSchema);
  instagramIdSchema.plugin(uniqueValidator);
  var InstagramId = mongoose.model('instagram_venues', instagramIdSchema);
  userIdSchema.plugin(uniqueValidator);
  var UserId = mongoose.model('users_venues', userIdSchema);
  userSchema.plugin(uniqueValidator);
  var UserX = mongoose.model('users_unique', userSchema);

  var count2=0;
  var count3=0;
  var count4=0;
  var count5=0;

  var stream = MediaRecentVenue.find().limit().stream();
  stream.on('data', function (doc) {

    var UserUnique = new UserX();

    UserUnique.id=( doc.data[0].user[0].id);

    // Salvo l'oggetto user nella collezione
     UserUnique.save(function (err) {
       if (err) {
         count2++;
         console.log('duplicate '+count2);
         //  return console.error("user duplicate not save: "+err);
       }else{
         count3++
         console.log('save '+count3);
     //return console.log("user new save");
       }

     });


  }).on('error', function (err) {
    // handle the error
    console.log(err);
  }).on('close', function () {
   // the stream is closed
   //    stream.destroy()
   ReadUsers();
   console.log("Finish!");
  });


  function ReadUsers() {

      var stream = UserX.find().stream()
      stream.on('data',function(doc){

        //console.log(doc.id);
        var User = new UserId();
        User.user_id=doc.id;
        ReadVenues(User);


            // Salvo l'oggetto user nella collezione
             User.save(function (err) {
               if (err) {
                 count4++;
                 console.log('duplicate '+count2);
                 //  return console.error("user duplicate not save: "+err);
               }else{
                 count5++
                 console.log('save '+count3);
             //return console.log("user new save");
               }

             });



      }).on('error', function (err) {
        // handle the error
        console.log(err);
      }).on('close', function () {
       // the stream is closed
       //    stream.destroy()
       console.log("Finish!");
      });

  }


   function ReadVenues(UserId){

     //console.log("Cerca venues di user: "+UserId.user_id+" diverso da: "+UserId.venues)
     var stream = MediaRecentVenue.find({'data.user.id':UserId.user_id}).where('data.instagramId').ne([UserId.instagramId]).stream()
     stream.on('data',function(doc){

       console.log('For user: '+doc.data[0].user[0].id+' Find -----> instagramId: '+doc.instagramId);

       UserId.venues.push(doc.instagramId);

     }).on('error', function (err) {
       // handle the error
       console.log(err);
     }).on('close', function () {
      // the stream is closed
      //    stream.destroy()
      console.log("ReadVenues Finish!");
     });

  }
