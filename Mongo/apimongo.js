
/*
 * Api for mongodb
 */

//MongoDB
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/acme';

exports.getAllProducts = function (req, res) {
	console.log('Function-apimongo-getAllProducts');

	//Conexion a mongoDB
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);

		 //Find de todos los products
	 	var cursor =db.collection('products').find( );

	 	//Por cada documento encontrado en el Find se anade a auxStack
	 	//auxStack es una cola
	 	var auxStack = [];
	   	cursor.each(function(err, doc) {
	      assert.equal(err, null);
	      if (doc != null) {
	      		//console.log(doc);
	         	auxStack.push(doc);
				//console.log(auxStack);
	      } else {
	          db.close();
	          //console.log(cursor);
	   		//Transformamos la cola de documentos a JSON
	          res.json(auxStack);
	      }
	   });


		
		
	});
};