var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

//connect mongodb


mongoose.connect('mongodb://localhost/DataSet');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
console.log('connection successful!');

    var stream = raccomendedcategory.find({}).stream();
    stream.on('data', function (doc) {
            // updateResult("1264085157",1);
            //  console.log(doc);
            // console.log(doc);
            console.log(doc);
            for (var i = 0; i < doc.list_raccomended.length; i++) {
              console.log(doc.list_raccomended[i].place);
                  // console.log(doc.venues[i]);
                        //cerca id in instagramId2

                         var stream2 = InstagramId.find({id: doc.list_raccomended[i].place}).stream();
                         stream2.on('data', function (doc2) {
                           console.log(doc2.id+"   "+doc2.latitude+"   "+doc2.longitude +"   "+doc2.name);
                            updateResult(doc2.id,doc2.latitude,doc2.longitude,doc2.name,doc2.macrocategory);

                      }).on('error', function (err) {

                      }).on('close', function () {

                      });// end stream2
            }// end for

      }).on('error', function (err) {

      }).on('close', function () {
      });//end stream
});


var Schema = mongoose.Schema;

var instagramIdSchema = new Schema({
             id:  { type: String, required: true, unique: true },
             foursquare_v2_id: { type: String, required: true, unique: true },
             category_place: String,
             name: String,
             latitude: Number,
             longitude:Number,
             macrocategory: String

	});


var raccomendedcategorySchema = new Schema({
            id_user:  { type: String, required: true, unique: true },
            list_raccomended: {}

});


// Apply the uniqueValidator plugin to venueSchema.
instagramIdSchema.plugin(uniqueValidator);
var InstagramId = mongoose.model('instagram_venues_macrocategory', instagramIdSchema);

raccomendedcategorySchema.plugin(uniqueValidator);
var raccomendedcategory = mongoose.model('raccomendedcategory', raccomendedcategorySchema);

  var count2=0;
  var count3=0;
  var l=0;


function updateResult(id,latitude,longitude,name,macrocategory){
            raccomendedcategory.findOneAndUpdate(
              {"list_raccomended.place": id } ,
              { "list_raccomended.$.name": name,"list_raccomended.$.latitude": latitude,"list_raccomended.$.longitude": longitude,"list_raccomended.$.macrocategory": macrocategory},
              { runValidators: true, context: 'query' ,upsert:true,new:true,multi: true},
              function(err) {
                if (err) {
                  console.log(err);
                  count2++;
                  console.log("error = "+ count2);
                }else{
                  count3++;
                  console.log("new venue update --------------->   "+id);
                  console.log("Number venues update = "+count3);
                }
              }
            );

}
