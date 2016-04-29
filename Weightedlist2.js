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

var instagramIdSchema2 = new Schema({
             id:  { type: String, required: true, unique: true },
             foursquare_v2_id: { type: String, required: true, unique: true },
             category_place: String,
             macrocategory: String

  });


var weightlistSchema = new Schema({

            user_id: { type: Number, index: { dropDups: true, required: true, unique: true }},
            venues : [],
            macrocategory: [],
            weight: []
});

var macrocategorySchema = new Schema({
             macrocategory:  { type: String, required: true, unique: true },
             listplaces: [],
             listvenues: []

  });

var userIdSchema = new Schema({

            user_id: { type: Number, index: { dropDups: true, required: true, unique: true }},
            venues: [ ]

  });

weightlistSchema.plugin(uniqueValidator);
var weightList = mongoose.model('weightList', weightlistSchema);
instagramIdSchema2.plugin(uniqueValidator);
var instagramId2 = mongoose.model('instagram_venues_macrocategory', instagramIdSchema2);
macrocategorySchema.plugin(uniqueValidator);
var macrocategory = mongoose.model('macrocategory', macrocategorySchema);
var UserId = mongoose.model('users_venues', userIdSchema);
userIdSchema.plugin(uniqueValidator);

var count2=0;
var count3=0;


var stream = UserId.find().limit().stream();
stream.on('data',function(doc) {

    SetMacrocategory(doc);

    }).on('error', function (err) {
        // handle the error
       console.log(err);
    }).on('close', function () {
       // the stream is closed
        //stream.destroy()
      console.log("Finish!");
    });


function SetMacrocategory(instance){

//      console.log('SetMacrocategory: '+instance);

    //INSERISCO LE MACROCATEGORIE
      var Weights = new weightList();
      Weights.user_id = instance.user_id;

      var stream = macrocategory.find().stream();
      stream.on('data', function(doc) {

        //console.log(doc.macrocategory);
          Weights.macrocategory.push(doc.macrocategory);
          Weights.weight.push(0);


      }).on('error', function (err) {
        // handle the error
        console.log(err);
      }).on('close', function () {
        SetWeight(instance,Weights);
        Weights.save(function(err){
            if(err){
                count2++;
                console.log('duplicate '+count2);
            }
            else{
                count3++;
                console.log('save '+count3);
            }
        })
       // the stream is closed
       //  console.log("SetMacrocategory Finish!");

      });

}


function SetWeight(instance,Weights){



      for(j=0;j<instance.venues.length; j++){

          var venue = instance.venues[j]

      //INSERISCO I PESI
      var stream = instagramId2.find({id: venue}).limit().stream();
      stream.on('data', function(doc) {

                for(i=0; i<Weights.weight.length;i++){
                      if(doc.macrocategory==Weights.macrocategory[i]){
                      Weights.weight[i]+=1
                      Weights.venues.push(doc.id);
                      }
                }




      }).on('error', function (err) {
        // handle the error
        console.log(err);
      }).on('close', function () {
       // the stream is closed
      //  console.log("SetWeight Finish!");
      });

    }

  }
