//////PRODUCTS////////////////////////////////////////


//var crypto = require('crypto');//Necesario para encriptacion por MD5

var db_connection = require('./routes/db_connection');

//Declaracion de los schemas, es la estructura que tienen 
//los documentos en la base de datos
var productSchema = mongoose.Schema({
    name: String,
    description: String,
    code: String,
    price: {type:Number,min:0},
    rating: {type:Number,min:0,max:5},
    image: String
});


//Creacion del modelo en base a los schemas
//El modelo se crea sobre la coleccion de products,
// pero en el nombre hay que ponerlo sin la s final
var productModel = mongoose.model('product',productSchema)


exports.getAllProducts = function (req, res) {
	console.log('Function-productsApi-getAllProducts');
	//productModel.find();
	productModel.find(function(err,products){
		if(err){
			console.error(err);
		}else{
			//console.log(products);
			res.json(products);
		}
	});
};






