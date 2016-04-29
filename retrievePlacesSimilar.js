//require libs
var jsonfile = require('jsonfile');
var util = require('util');
var mongoose = require('mongoose');
var kmeans = require('node-kmeans');
//connect mongodb
mongoose.connect('mongodb://localhost/DataSet');
var uniqueValidator = require('mongoose-unique-validator');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log('connection successful!');
  mongoose.connection.db.dropCollection('raccomendedcategory', function(err, result) {console.log(err+"  "+result);});

});

//schema creation
var Schema = mongoose.Schema;

var raccomendedcategorySchema = new Schema({
          id_user: { type: String, required: true, unique: true },
          list_raccomended: {}
});

var instagramIdSchema = new Schema({
             id:  { type: String, required: true, unique: true },
             foursquare_v2_id: { type: String, required: true, unique: true },
             category_place: String,
             macrocategory: String

  });

instagramIdSchema.plugin(uniqueValidator);
var instagramId = mongoose.model('instagram_venues_macrocategory', instagramIdSchema);

raccomendedcategorySchema.plugin(uniqueValidator);
var raccomendedcategory = mongoose.model('raccomendedcategory', raccomendedcategorySchema);

//functions

function	saveRaccomandationList(racc){
  racc.save(function (err) {
  	if (err) {

  			console.log("id_user duplicate ");

  	}
    else{

  			//console.log("new id_user & racomandation_list saved --------------->   "+racc);

  	}
  });
  return;
};

function deletePlaces(listPlaces){
  var placeWithCategory=[];
  var count=0;
  var counter=0;
  var counter1=0;
  var list=[];
  var listPlacesFrequency=[];
//  console.log(listPlaces);
  //push in placeWithCategory only the places with a category defined
  for (var i = 0; i < listPlaces.length; i++) {

    var stream2 = instagramId.find({"id":listPlaces[i]}).stream()
    stream2.on('data', function (doc2) {
      if (doc2) {
        placeWithCategory.push(doc2.id);
      }

    }).on('error', function (err) {

    //  console.log(err);

    }).on('close', function () {

      counter1++;
      //create a unique list of places with the number of times that a place is find
      //and other fields empty for now
      if (listPlaces.length==counter1) {
        placeWithCategory.map(function(tag2){
          for (var x = 0; x < placeWithCategory.length; x++) {
            if (tag2==placeWithCategory[x]) {
              count++;
            }
          }

          list[tag2]=count;
          count=0;
        })

        for (var key in list) {
          listPlacesFrequency[counter]={"place": key, "count": list[key], "name": "", "latitude":0 , "longitude": 0};
          counter++;
        }
        //sort the listaplaces
        listPlacesFrequency.sort(function(a, b) {
          return parseFloat(b.count) - parseFloat(a.count);
        })
        //save the schema
        altro.push(listPlacesFrequency);
        contatorefinale++;
if (contatorefinale==contatorefinale2) {
  var final=[];
  for (var i = 0; i < altro.length; i++) {
    for (var j = 0; j < altro[i].length; j++) {

    final.push(altro[i][j])
  }
  }
        var newdata={
        'id_user': user,
        'list_raccomended':final
        }
        console.log(newdata);
          saveRaccomandationList(new raccomendedcategory(newdata));
  }

      }
    });
  }
}
var contatorefinale=0;
contatorefinale2=0;
var place1=[];
var place2=[];
var user;
var placesToVisit=[];
var control=0;
var altro=[];

//read a file of places that must be visit
var file = '/home/enzo/Documenti/SII/predizione -punti-di-interesse.git/DaVisitare.json';
jsonfile.readFile(file, function(err, obj) {
    console.log(obj);
  place1.push(obj.id_instagram);

  //read a file of places that the user has visited
  var file2 = '/home/enzo/Documenti/SII/predizione -punti-di-interesse.git/Visitati.json';
  jsonfile.readFile(file2, function(err, obj) {
    place2.push(obj.id_instagram);
    //save the user that must be raccomended
    user=obj.user;

    place1[0].sort(function(a, b) {
      //console.log(b.similarity);
      return parseFloat(b.similarity) - parseFloat(a.similarity);
    })
    console.log(place1[0].length);
          contatorefinale2=place1[0].length;
    //push in placesToVisit only the locations in witch user isn't gone
    for (var x = 0; x < place1[0].length; x++) {

      console.log(place1[0][x].venues.length);
      for (var i = 0; i < place1[0][x].venues.length; i++) {
        for (var j = 0; j < place2[0].length; j++) {
          if (place1[0][0].venues[i]==place2[0][j]) {
            control=1;
          }
        }
        if (control==0) {
          placesToVisit.push(place1[0][x].venues[i])
        }
        control=0;
      //  var new


      }
      deletePlaces(placesToVisit);
      placesToVisit=[];

      }



  //  console.log(placesToVisit);
    //call the function
  //  deletePlaces(placesToVisit);
  })
})
