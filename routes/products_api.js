/*
 * Api for mongodb
 */

//MongoDB
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/Acme-Supermarket';

exports.getAllProducts = function (req, res) {
	//Conexion a mongoDB
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);

		//Find de todos los productos
		var cursor = db.collection('products').find( );

		//Por cada documento encontrado en el Find se mete en documentos
		var documentos = [];
		cursor.each(function(err, doc) {
			assert.equal(err, null);
			if (doc != null) {
				documentos.push(doc);
			} else {
				db.close();
				//Transformamos la cola de documentos a JSON
				res.json(documentos);
			}
		});
	});
};