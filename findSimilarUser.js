//require libs
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var kmeans = require('node-kmeans');
var jsonfile = require('jsonfile');
var async = require('async');
//connect mongodb
mongoose.connect('mongodb://localhost/Dataset');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log('connection successful!');
});

//schema creation
var Schema = mongoose.Schema;

var userTimelineSchema = new Schema({
          id:  { type: String, required: true, unique: true },
          venues: [{}],
          listMacro: [],
          vetMacro: {}
});

var clusterSchema = new Schema({
        IdCluster : [],
        MacroCluster : []
});

userTimelineSchema.plugin(uniqueValidator);
var usertimeline = mongoose.model('usertimelines', userTimelineSchema);


clusterSchema.plugin(uniqueValidator);
var cluster = mongoose.model('clusters', clusterSchema);


function dotproduct(a,b) {
    var n = 0, lim = Math.min(a.length,b.length);
    for (var i = 0; i < lim; i++) n += a[i] * b[i];
    return n;
 }

function norm2(a) {var sumsqr = 0; for (var i = 0; i < a.length; i++) sumsqr += a[i]*a[i]; return Math.sqrt(sumsqr);}

function similarity(a, b) {return dotproduct(a,b)/(norm2(a)*norm2(b));}



function calculate_kmeans(IdCluster,MacroCluster){

  var SimilarPlaces=[];
  var SimilarPlaces2=[];
  var VisitedPlaces=[];
  var Position=0;
  var NumberCluster=0;
  var ClusterListId=[];
  var Similitude=[];
  var vettore=[];
  var a=[];

  //find the number of the cluster in witch "company" is
  for (var i = 0; i < IdCluster.length; i++) {
    for (var j = 0; j < IdCluster[i].length; j++) {
      if (IdCluster[i][j]==company){
        NumberCluster=i;
        Position=j;
        break;
      }
    }
  }

  for (var i = 0; i < IdCluster[NumberCluster].length; i++) {
    ClusterListId.push(IdCluster[NumberCluster][i]);
  }
  console.log("ClusterListId");
  //push in Similitude all the users that belong to the same cluster of "company" and their similarity with company
  for (var i = 0; i < MacroCluster[NumberCluster].length; i++) {
    if (i!=Position) {
      Similitude.push({"user":ClusterListId[i],"similarity": similarity(MacroCluster[NumberCluster][Position],MacroCluster[NumberCluster][i])} )
    }
  }


  Similitude.sort(function(a, b) {
    return parseFloat(b.similarity) - parseFloat(a.similarity);
  })
//console.log("Similitude");
for (var i = 0; i < 5; i++) {
a.push(Similitude[i]);
}

  //find the three users more similar and return two json: one with the places that "company" has visited

  //the other with the places in witch his more similar users have visited
  async.each(a, function(pro) {
    console.log(pro.user);

    var stream = usertimeline.find({"id":pro.user}).stream()
    stream.on('data',function(doc2) {
      console.log(pro);

      for (var i = 0; i < doc2.venues.length; i++) {
      SimilarPlaces2.push(doc2.venues[i]);
      }
      var newdata={
        'venues':SimilarPlaces2,
        'user':doc2.id,
        'similarity':pro.similarity

      }
      vettore.push(newdata);
      SimilarPlaces2=[];
    }).on('error', function (err) {

      console.log(err);

    }).on('close', function () {

     var file = '/home/marco/DaVisitare.json';
     var obj = {id_instagram:vettore};
     jsonfile.writeFile(file, obj, function (err) {

       console.error(err);

    })
    });
  })

  var stream = usertimeline.find({"id":company}).stream()
  stream.on('data',function(doc2) {
    for (var i = 0; i < doc2.venues.length; i++) {
      VisitedPlaces.push(doc2.venues[i]);
    }
  }).on('error', function (err) {

    console.log(err);

  }).on('close', function () {

   var file = '/home/marco/Visitati.json';
   var obj = {id_instagram:VisitedPlaces,
                user: company};
   jsonfile.writeFile(file, obj, function (err) {

     console.error(err);

  })
  });
}

//user to match
var company='17563068';
//global variables
var WeightedList = [];
var listacluster=[];
var listaMacrocluster=[];
//definition and start stream
var stream = cluster.find().stream();
stream.on('data',function(doc2) {

var WeightMacro=[];
//filter out all the elements of the db that don't have a vetMacro propriety
listacluster.push(doc2.IdCluster)
listaMacrocluster.push(doc2.MacroCluster)
}).on('error', function (err) {

console.log(err);

}).on('close', function () {

console.log("calculating...");
//call the function to calculate kmeans
calculate_kmeans(listacluster[0],listaMacrocluster[0]);

});
