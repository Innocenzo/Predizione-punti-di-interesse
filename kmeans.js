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

//functions

function	saveVenues(venues){
	venues.save(function (err) {
		if (err) {

			count2++;
			console.log("cluster duplicate = "+ count2);
		}
    else{
			count3++;
			console.log("new cluster saved --------------->   "+venues);
			console.log("Number cluster save = "+count3);
		}
	});
  return;
};

// compare vectors
function arraycompare(a1,b1){
  return JSON.stringify(a1)==JSON.stringify(b1);
}

//kmeans
function calculate_kmeans(VectorMacro,VectorId) {
  var SimilarUser=[];

  var IdCluster=[];
  var MacroCluster=[];
  var ClusterListMacro=[];
  var count=0;


  //k= number of elements of the weighted vector
  kmeans.clusterize(VectorMacro, {k: 128}, function(err,res) {
    if (err) {
      console.error(err);
    }

    else {

      //for every cluster push in IdCluster the cluster of id  that belong to that cluster
      //for every cluster push in MacroCluster the cluster of vectorMacro that belong to that cluster
      async.each(res, function(res) {
        console.log(res.cluster);
        var vectid=[];
        var vectmacro=[];
        for (var j = 0; j < res.clusterInd.length; j++) {

            vectid.push(  VectorId[res.clusterInd[j]]);
            vectmacro.push(  VectorMacro[res.clusterInd[j]]);
        }
        IdCluster.push(vectid) ;
        MacroCluster.push(vectmacro);
      })
      var newdata= {
                      'IdCluster' : IdCluster,
                      'MacroCluster' : MacroCluster
                    }

      saveVenues(new cluster(newdata));
//      console.log(IdCluster);
  //    console.log(MacroCluster);
    }

  })

}
var count3=0;
var count2=0;
var VectorMacro =[];
var VectorId=[];
//global variables
var WeightedList = [];
var VectorZero=[0,0,0,0,0,0,0,0];
//definition and start stream
var stream = usertimeline.find().stream();
stream.on('data',function(doc2) {

var WeightMacro=[];
//filter out all the elements of the db that don't have a vetMacro propriety
for (var variable in doc2.vetMacro) {
  if (doc2.vetMacro.hasOwnProperty(variable)) {
    WeightMacro.push(doc2.vetMacro[variable]);
  }
}

//filter out all the elements of the db that have as vetMacro propriety a vector of 0
if (!arraycompare(WeightMacro,VectorZero)&&WeightMacro.length==8) {
  //WeightedList.push({"id": doc2.id, "vetMacro":WeightMacro });
  VectorMacro.push( WeightMacro );
  VectorId.push( doc2.id );
}
//console.log(WeightedList.length);
}).on('error', function (err) {

console.log(err);

}).on('close', function () {

console.log();
//call the function to calculate kmeans
calculate_kmeans(VectorMacro,VectorId);

});
