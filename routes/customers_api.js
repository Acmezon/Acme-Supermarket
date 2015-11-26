//////CUSTOMERS////////////////////////////////////////

var db_connection = require('./routes/db_connection');

var extend = require('mongoose-schema-extend');//Necesario para la herencia



//Declaracion de los schemas, es la estructura que tienen 
//los documentos en la base de datos
var actorSchema = mongoose.Schema({
    name: String,
    surname: String,
    email: String,
    password: String,
    address: String,
    coordinates: String,
    credict_card: String
});

var customerSchema = actorSchema.extend({
	//TODO
});
var adminSchema = actorSchema.extend({
	//TODO
});

//Creacion del modelo en base a los schemas
//El modelo se crea sobre la coleccion de products,
// pero en el nombre hay que ponerlo sin la s final
var customerModel = mongoose.model('customer',customerSchema)

exports.getCustomer = function (req, res) {
	var _email = req.params.email;
	var _pasword = req.params.password;
	console.log('Function-productsApi-getCustumer -- _email:'+_email+' _pasword:'+_pasword);


	customerModel.findOne({email:_email},function(err,custumer){
		if(err){
			//console.log('--Costumer not found');
			console.error(err);
			res.sendStatus(404);
		}
		else{
			//if(custumer.)
			//console.log('--Costumer found'+custumer);
			res.json(custumer);
			res.sendStatus(200);
		}
	});
};

exports.newCustomer = function (req, res) {
	console.log('Function-productsApi-newCustomer');

	//Guardar la entrada de datos en variables
    var _name = req.params.name;
    var _surname = req.params.surname;
    var _email = req.params.email;
    var _password = req.params.password;
    var _address = req.params.address;
    var _coordinates = req.params.coordinates;
    var _credict_car = req.params.credict_card;

    //TODO Chequear que los campos son correctos

	
    //var md5Password = crypto.createHash('md5').update(_password).digest("hex");

    var newCustomer = new customerModel({
	    name: _name,
	    surname: _surname,
	    email: _email,
	    password: _password,
	    address: _address,
	    coordinates: _coordinates,
	    credict_card: _credict_car
    });


    newCustomer.save(function (err) {
  		if(err){
			console.error(err);
			res.sendStatus(404);
		}
		else{
			//console.log('--New custumer created');
			res.sendStatus(200);
		}
	});

};



