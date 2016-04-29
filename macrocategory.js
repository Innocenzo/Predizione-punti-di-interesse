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

var instagramIdSchema = new Schema({
             id:  { type: String, required: true, unique: true },
             foursquare_v2_id: { type: String, required: true, unique: true },
             category_place: String

	});

var macrocategorySchema = new Schema({
             macrocategory:  { type: String, required: true, unique: true },
             listplaces: [],
             listvenues: []

	});

  instagramIdSchema.plugin(uniqueValidator);
  var instagramId2 = mongoose.model('instagram_venues2', instagramIdSchema);
  macrocategorySchema.plugin(uniqueValidator);
  var macrocategory = mongoose.model('macrocategory', macrocategorySchema);



//functions
function readVenues(){

  for (var i = 0; i < listCategory.length; i++) {
    var list=[];
    var listplaces=[];
    listCategory[i].map(function(tag2){
      list[tag2]=0;
    });
    for (var key in list) {
      listplaces.push(key);
    }
    var newdata= {
      'macrocategory' : categories[i],
      'listplaces' : listplaces,
      'listvenues' : listVenuesId[i]
    }
    saveVenues(new macrocategory(newdata));
  }
}


function	saveVenues(venues){
	venues.save(function (err) {
		if (err) {
			count2++;
			console.log("venue duplicate = "+ count2);
		}
    else{
			count3++;
		//	console.log("new venue saved --------------->   "+venues);
			console.log("Number venues save = "+count3);
		}
	});
  return;
};


//end functions

  var count2=0;
  var count3=0;

  var listVenuesId=[new Array(),new Array(),new Array(),new Array(),new Array(),new Array(),new Array(),new Array()];
  listVenuesId[0]=[];
  listVenuesId[1]=[];
  listVenuesId[2]=[];
  listVenuesId[3]=[];
  listVenuesId[4]=[];
  listVenuesId[5]=[];
  listVenuesId[6]=[];
  listVenuesId[7]=[];

  var listCategory=[new Array(),new Array(),new Array(),new Array(),new Array(),new Array(),new Array(),new Array()];
  listCategory[0]=[];
  listCategory[1]=[];
  listCategory[2]=[];
  listCategory[3]=[];
  listCategory[4]=[];
  listCategory[5]=[];
  listCategory[6]=[];
  listCategory[7]=[];

  var category=[new Array(),new Array(),new Array(),new Array(),new Array(),new Array(),new Array(),new Array()];
  category[0]=['Wings Joint',
  'Mac & Cheese Joint',
  'BBQ Joint',
  'Buffet',
  'Burger Joint',
  'Trattoria/Osteria',
  'Agriturismo',
  'Italian Restaurant',
  'Restaurant',
  'Japanese Restaurant',
  'Fast Food Restaurant',
  'Seafood Restaurant',
  'Chinese Restaurant',
  'Mexican Restaurant',
  'Asian Restaurant',
  'Gluten-free Restaurant',
  'Sushi Restaurant',
  'Malaysian Restaurant',
  'Mediterranean Restaurant',
  'American Restaurant',
  'Indian Restaurant',
  'African Restaurant',
  'German Restaurant',
  'Peruvian Restaurant',
  'Greek Restaurant',
  'Spanish Restaurant',
  'Middle Eastern Restaurant',
  'Argentinian Restaurant',
  'Roman Restaurant',
  'Comfort Food Restaurant',
  'Caribbean Restaurant',
  'Korean Restaurant',
  'Austrian Restaurant',
  'Brazilian Restaurant',
  'Thai Restaurant',
  'Moroccan Restaurant',
  'Vegetarian / Vegan Restaurant',
  'Turkish Restaurant',
  'Falafel Restaurant',
  'Modern European Restaurant',
  'Arepa Restaurant',
  'Dumpling Restaurant',
  'French Restaurant',
  'South American Restaurant',
  'Kebab Restaurant',
  'Filipino Restaurant',
  'Eastern European Restaurant',
  'Ethiopian Restaurant',
  'Latin American Restaurant',
  'Paella Restaurant',
  'Dim Sum Restaurant',
  'Scandinavian Restaurant',
  'Mongolian Restaurant',
  'New American Restaurant',
  'Umbrian Restaurant',
  'Molecular Gastronomy Restaurant',
  'Basilicata Restaurant',
  'Southern / Soul Food Restaurant',
  'Halal Restaurant',
  'Pakistani Restaurant',
  'Cantonese Restaurant',
  'Szechuan Restaurant',
  'Turkish Home Cooking Restaurant',
  'Sicilian Restaurant',
  'Noodle House',
  'Snack Place',
  'Pizza Place',
  'Sandwich Place',
  'Burrito Place',
  'Salad Place',
  'Taco Place',
  'Soup Place',
  'Friterie',
  'Creperie',
  'Hot Dog Joint',
  'Bistro',
  'Food Court',
  'Steakhouse',
  'Food Truck',
  'Fried Chicken Joint',
  'Diner'];
  category[1]=['Café',
  'Cafeteria',
  'Gaming Cafe',
  'Internet Cafe',
  'Tea Room',
  'Breakfast Spot',
  'Corporate Cafeteria'];
  category[2]=['Cocktail Bar',
  'Bar',
  'Wine Bar',
  'Gay Bar',
  'Dive Bar',
  'Karaoke Bar',
  'Sports Bar',
  'Hookah Bar',
  'Piano Bar',
  'Juice Bar',
  'Whisky Bar',
  'Beach Bar',
  'Sake Bar',
  'Irish Pub',
  'Pub',
  'Winery',
  'Nightclub',
  'Strip Club',
  'Comedy Club',
  'Rock Club',
  'Social Club',
  'Jazz Club',
  'Club House',
  'Salsa Club',
  'Country Dance Club',
  'Gastropub',
  'Other Nightlife',
  'Beer Garden',
  'Lounge'];
  category[3]=['Spa',
  'Pool',
  'Bowling Alley',
  'Gym / Fitness Center',
  'Football Stadium',
  'Sports Club',
  'Soccer Stadium',
  'Stadium',
  'Basketball Stadium',
  'Track Stadium',
  'Tennis Stadium',
  'Baseball Stadium',
  'Hockey Field',
  'Hockey Arena',
  'Soccer Field',
  'Golf Course',
  'Athletics & Sports',
  'Volleyball Court',
  'Gym',
  'Baseball Field',
  'Pool Hall',
  'Martial Arts Dojo',
  'Basketball Court',
  'Tennis Court',
  'Racetrack',
  'Massage Studio',
  'Music Venue',
  'Beach',
  'Casino',
  'Multiplex',
  'Gym Pool',
  'Skating Rink',
  'Aquarium',
  'Gymnastics Gym',
  'Climbing Gym',
  'Planetarium',
  'Yoga Studio',
  'Laser Tag',
  'Nudist Beach',
  'Dive Spot',
  'Fishing Spot',
  'Roller Rink',
  'Arcade',
  'Boxing Gym',
  'Surf Spot',
  'Trail',
  'Cricket Ground',
  'Rock Climbing Spot',
  'Fair'];
  category[4]=['Town Hall',
  'Pedestrian Plaza',
  'City Hall',
  'Street Art',
  'Movie Theater',
  'Theater',
  'Indie Theater',
  'Indie Movie Theater',
  'Movie Theater',
  'Indie Movie Theater',
  'Opera House',
  'History Museum',
  'Science Museum',
  'Museum',
  'Art Museum',
  'Art Gallery',
  'Concert Hall',
  'Auditorium',
  'Arts & Entertainment'];
  category[5]=['Theme Park',
  'Park',
  'Trailer Park',
  'Water Park',
  'Skate Park',
  'Theme Park Ride / Attraction',
  'Playground',
  'Garden Center',
  'Garden',
  'Zoo',
  'Campground',
  'Mountain',
  'Forest',
  'Botanical Garden',
  'Sculpture Garden',
  'Summer Camp',
  'Lake'];
  category[6]=['Shoe Repair',
  'Tanning Salon',
  'Mall',
  'Nail Salon',
  'Butcher',
  'Bakery',
  'Salon / Barbershop',
  'Flea Market',
  'Farmers Market',
  'Market',
  'Fish Market',
  'Night Market',
  'Boutique',
  'Adult Boutique',
  'Luggage Store',
  'Liquor Store',
  'Leather Goods Store',
  'Fruit & Vegetable Store',
  'Frame Store',
  'Lighting Store',
  'Herbs & Spices Store',
  'Mattress Store',
  'Stationery Store',
  'Shipping Store',
  'Used Bookstore',
  'Furniture / Home Store',
  'Clothing Store',
  'Pet Store',
  'Women\'s Store',
  'Grocery Store',
  'Men\'s Store',
  'Discount Store',
  'Electronics Store',
  'Thrift / Vintage Store',
  'Hardware Store',
  'Toy / Game Store',
  'Video Store',
  'Department Store',
  'Jewelry Store',
  'Convenience Store',
  'Arts & Crafts Store',
  'Music Store',
  'Shoe Store',
  'Kids Store',
  'Big Box Store',
  'Fishing Store',
  'Video Game Store',
  'Accessories Store',
  'Health Food Store',
  'Outdoor Supply Store',
  'Baby Store',
  'Warehouse Store',
  'Lingerie Store',
  'Candy Store',
  'Camera Store',
  'Beer Store',
  'Outlet Store',
  'Perfume Shop',
  'Bridal Shop',
  'Hobby Shop',
  'Cosmetics Shop',
  'Food & Drink Shop',
  'Automotive Shop',
  'Miscellaneous Shop',
  'Cupcake Shop',
  'Smoke Shop',
  'Dessert Shop',
  'Optical Shop',
  'Cheese Shop',
  'Betting Shop',
  'Motorcycle Shop',
  'Mobile Phone Shop',
  'Flower Shop',
  'Sporting Goods Shop',
  'Tailor Shop',
  'Gift Shop',
  'Gourmet Shop',
  'Ice Cream Shop',
  'Donut Shop',
  'Bike Shop',
  'Other Repair Shop',
  'Shop & Service',
  'Record Shop',
  'Wine Shop',
  'Coffee Shop',
  'Boat or Ferry',
  'Fish & Chips Shop',
  'Print Shop',
  'Pie Shop',
  'Lighthouse',
  'Antique Shop',
  'Souvenir Shop',
  'Bagel Shop',
  'Souvlaki Shop',
  'Nightlife Spot',
  'Gun Shop',
  'Costume Shop',
  'Chocolate Shop',
  'Board Shop',
  'Comic Shop',
  'Fabric Shop',
  'Bookstore',
  'Frozen Yogurt',
  'Drugstore / Pharmacy'];
  category[7]=['Capitol Building',
  'Shrine',
  'Bridge',
  'Mosque',
  'Synagogue',
  'Buddhist Temple',
  'Monastery',
  'Church',
  'Monument / Landmark',
  'Plaza',
  'Historic Site',
  'Cultural Center',
  'City',
  'Temple',
  'Government Building',
  'Performing Arts Venue',
  'Recreation Center',
  'Public Art',
  'Castle',
  'Spiritual Center'];

var categories=["ristoranti","caffè","vita notturna","divertimento","interessi culturali","Parchi","shopping","monumento/punto di riferimento"];

var stream2 = instagramId2.find({}).stream();
stream2.on('data', function (doc2) {
//for every location if the category match with one of the elements of the vector defined
//push in listVenuesId[i] the id and in listCategory[i] the category
for (var i = 0; i < category.length; i++) {
  for (var j = 0; j < category[i].length; j++) {
      if (doc2.category_place==category[i][j]) {
        listVenuesId[i].push(doc2.id);
        listCategory[i].push(doc2.category_place);
      }
    }
  }

  }).on('error', function (err) {

  }).on('close', function () {

  readVenues();

  });
