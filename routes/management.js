var db_utils = require('./db_utils'),
	Actor = require('../models/actor'),
	Admin = require('../models/admin'),
	Customer = require('../models/customer'),
	Supplier = require('../models/supplier'),
	Product = require('../models/product'),
	Credit_card = require('../models/credit_card'),
	Category = require('../models/category'),
	Belongs_to = require('../models/belongs_to'),
	Provide = require('../models/provide'),
	Purchase = require('../models/purchase'),
	PurchaseLine = require('../models/purchase_line'),
	Rate = require('../models/rate'),
	Reputation = require('../models/reputation'),
	crypto = require('crypto');//Necesario para encriptacion por MD,
	mongoose = require('mongoose');//Para la generacion de ids


// Restore Mongo DB to development state
exports.resetDataset = function (req, res) {
	console.log('Function-management-resetDataset');

	Actor.remove({}, function (err) {
		if(err) console.log("--ERR: Remove actor: " + err);
	});

	Credit_card.remove({}, function (err) {
		if(err) console.log("--ERR: Remove credit card: " + err);

		var credit_card1 = new Credit_card({
			"holderName" : "Nombre Apellido",
			"number" : "4556812969932217",
			"expirationMonth" : 7,
			"expirationYear" : 2030,
			"cvcCode" : 123
		});

		credit_card1.save(function (err, cc1) {
			if(err) console.log("--ERR: Create CC1: " + err);

			var customer1 = new Customer({
				"_id" : 1,
				"_type" : "Customer",
				"name" : "customer",
				"surname" : "customer",
				"email" : "customer@mail.com",
				"password" : "91ec1f9324753048c0096d036a694f86", //customer
				"coordinates" : "37.358716;-5.987814",
				"address" : "Avda. Reina Mercedes, s/n",
				"country" : "Spain",
				"city" : "Sevilla",
				"phone" : "999999999",
				"credit_card_id" : cc1._id
			});

			customer1.save(function (err) {
				if(err) console.log("--ERR: Create Customer: " + err);
			});
		});

		var credit_card2 = new Credit_card({
			"holderName" : "Customer1",
			"number" : "4024007167504389",
			"expirationMonth" : 12,
			"expirationYear" : 2018,
			"cvcCode" : 907
		});

		credit_card2.save(function (err, cc2) {
			if(err) console.log("--ERR: Create CC2: " + err);

			var customer2 = new Customer({
				"_id" : 2,
				"_type" : "Customer",
				"name" : "customer1",
				"surname" : "customer",
				"email" : "customer1@mail.com",
				"password" : "91ec1f9324753048c0096d036a694f86", //customer
				"coordinates" : "37.358716;-5.987814",
				"address" : "Avda. Reina Mercedes, s/n",
				"country" : "Spain",
				"city" : "Sevilla",
				"phone" : "999999999",
				"credit_card_id" : cc2._id
			});
		});
	});

	var admin = new Admin({
		"type" : "Admin",
		"name" : "admin",
		"surname" : "admin",
		"email" : "admin@mail.com",
			"password" : "200ceb26807d6bf99fd6f4f0d1ca54d4" //administrator
		});

	admin.save(function (err) {
		if(err) console.log("--ERR: Create Admin: " + err);
	});

	var supplier = new Supplier({
		"_id" : 3,
		"_type" : "Supplier",
		"name" : "supplier1",
		"surname" : "supplier",
		"email" : "supplier@mail.com",
			"password" : "99b0e8da24e29e4ccb5d7d76e677c2ac", //supplier
			"coordinates" : "37.358716;-5.987814",
			"address" : "Avda. Reina Mercedes, s/n"
		});

	var supplier1 = new Supplier({
		"_id" : 4,
		"_type" : "Supplier",
		"name" : "supplier1",
		"surname" : "supplier",
		"email" : "supplier1@mail.com",
			"password" : "99b0e8da24e29e4ccb5d7d76e677c2ac", //supplier
			"coordinates" : "37.358716;-5.987814",
			"address" : "Avda. Reina Mercedes, s/n"
		});

	supplier.save(function (err) {
		if(err) console.log("--ERR: Create Supplier: " + err);
	});

	supplier1.save(function (err) {
		if(err) console.log("--ERR: Create Supplier 1: " + err);
	});

	Product.remove({}, function(err) {
		if(err) console.log('--ERR: Remove products: ' + err);
	});

	var product1 = new Product({
		"_id" : 1,
		"name":"Sunglasses",
		"description":"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim",
		"code":"12b34a1",
		"image":"img/template_bootstrap/pic5.jpg"
	});
	product1.save(function (err) {
		if(err) console.log("--ERR: Error saving product1: " + err);
	});

	var product2 = new Product({
		"_id" : 2,
		"name":"Cheap Sunglases",
		"description":"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim",
		"code":"12buua2",
		"image":"img/template_bootstrap/pic5.jpg"
	});
	product2.save(function (err) {
		if(err) console.log("--ERR: Error saving product2: " + err);
	});

	var product3 = new Product({
		"_id" : 3,
		"name":"Dark sunglasses",
		"description":"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim",
		"code":"12b34a3",
		"image":"img/template_bootstrap/pic5.jpg"
	});
	product3.save(function (err) {
		if(err) console.log("--ERR: Error saving product3: " + err);
	});

	var product4 = new Product({
		"_id" : 4,
		"name":"Light sunglasses",
		"description":"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim",
		"code":"12buua4",
		"image":"img/template_bootstrap/pic5.jpg"
	});
	product4.save(function (err) {
		if(err) console.log("--ERR: Error saving product4: " + err);
	});

	var product5 = new Product({
		"_id" : 5,
		"name":"Summer sunglasses",
		"description":"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim",
		"code":"12b34a5",
		"image":"img/template_bootstrap/pic5.jpg"
	});
	product5.save(function (err) {
		if(err) console.log("--ERR: Error saving product5: " + err);
	});

	var product6 = new Product({
		"_id" : 6,
		"name":"Last sunglasses",
		"description":"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim",
		"code":"12buua6",
		"image":"img/template_bootstrap/pic5.jpg"
	});
	product6.save(function (err) {
		if(err) console.log("--ERR: Error saving product6: " + err);
	});

	var product7 = new Product({
		"_id" : 7,
		"name":"Cool Sunglasses",
		"description":"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim",
		"code":"12b34a7",
		"image":"img/template_bootstrap/pic5.jpg"
	});
	product7.save(function (err) {
		if(err) console.log("--ERR: Error saving product7: " + err);
	});

	var product8 = new Product({
		"_id" : 8,
		"name":"Blue Sunglases",
		"description":"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim",
		"code":"12buua8",
		"image":"img/template_bootstrap/pic5.jpg"
	});
	product8.save(function (err) {
		if(err) console.log("--ERR: Error saving product8: " + err);
	});

	var product9 = new Product({
		"_id" : 9,
		"name":"The sunglasses",
		"description":"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim",
		"code":"12b34a9",
		"image":"img/template_bootstrap/pic5.jpg"
	});
	product9.save(function (err) {
		if(err) console.log("--ERR: Error saving product9: " + err);
	});

	var product10 = new Product({
		"_id" : 10,
		"name":"That sunglasses",
		"description":"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim",
		"code":"12buuaa",
		"image":"img/template_bootstrap/pic5.jpg"
	});
	product10.save(function (err) {
		if(err) console.log("--ERR: Error saving product10: " + err);
	});

	var product11 = new Product({
		"_id" : 11,
		"name":"Merch sunglasses",
		"description":"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim",
		"code":"12b34ah",
		"image":"img/template_bootstrap/pic5.jpg"
	});
	product11.save(function (err) {
		if(err) console.log("--ERR: Error saving product11: " + err);
	});

	var product12 = new Product({
		"_id" : 12,
		"name":"Pair of sunglasses",
		"description":"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim",
		"code":"12buutr",
		"image":"img/template_bootstrap/pic5.jpg"
	});
	product12.save(function (err) {
		if(err) console.log("--ERR: Error saving product12: " + err);
	});

	Category.remove({}, function(err) {
		if(err) console.log('--ERR: Remove category: ' + err);
	});
	var category1 = new Category({
		"_id" : 1,
		"name" : "Category 1" 
	});
	category1.save(function (err, category){
		if(err) console.log("ERR: Saving category1: " + err);
	});

	var category2 = new Category({
		"_id" : 2,
		"name" : "Category 2" 
	});
	category2.save(function (err, category){
		if(err) console.log("ERR: Saving category2: " + err);
	});

	var category3 = new Category({
		"_id" : 3,
		"name" : "Category 3" 
	});
	category3.save(function (err, category){
		if(err) console.log("ERR: Saving category3: " + err);
	});

	var category4 = new Category({
		"_id" : 4,
		"name" : "Category 4" 
	});
	category4.save(function (err, category){
		if(err) console.log("ERR: Saving category4: " + err);
	});

	var category5 = new Category({
		"_id" : 5,
		"name" : "Category 5" 
	});
	category5.save(function (err, category){
		if(err) console.log("ERR: Saving category5: " + err);
	});

	var category6 = new Category({
		"_id" : 6,
		"name" : "Category 6" 
	});
	category6.save(function (err, category){
		if(err) console.log("ERR: Saving category6: " + err);
	});

	Belongs_to.remove({}, function(err) {
		if(err) console.log('--ERR: Remove belongs_to: ' + err);
	});
	var belongs_to1 = new Belongs_to({
		"product_id": 1, 
		"category_id" : 1
	});
	belongs_to1.save(function (err) {
		if(err) console.log("ERR: Savin belongs_to1: " + err);
	});

	var belongs_to2 = new Belongs_to({
		"product_id": 2, 
		"category_id" : 2
	});
	belongs_to2.save(function (err) {
		if(err) console.log("ERR: Savin belongs_to2: " + err);
	});

	var belongs_to3 = new Belongs_to({
		"product_id": 3, 
		"category_id" : 3
	});
	belongs_to3.save(function (err) {
		if(err) console.log("ERR: Savin belongs_to3: " + err);
	});

	var belongs_to4 = new Belongs_to({
		"product_id": 4, 
		"category_id" : 4
	});
	belongs_to4.save(function (err) {
		if(err) console.log("ERR: Savin belongs_to4: " + err);
	});

	var belongs_to5 = new Belongs_to({
		"product_id": 5, 
		"category_id" : 5
	});
	belongs_to5.save(function (err) {
		if(err) console.log("ERR: Savin belongs_to5: " + err);
	});

	var belongs_to6 = new Belongs_to({
		"product_id": 6, 
		"category_id" : 6
	});
	belongs_to6.save(function (err) {
		if(err) console.log("ERR: Savin belongs_to6: " + err);
	});

	var belongs_to7 = new Belongs_to({
		"product_id": 7, 
		"category_id" : 1
	});
	belongs_to7.save(function (err) {
		if(err) console.log("ERR: Savin belongs_to7: " + err);
	});

	var belongs_to8 = new Belongs_to({
		"product_id": 8, 
		"category_id" : 2
	});
	belongs_to8.save(function (err) {
		if(err) console.log("ERR: Savin belongs_to8: " + err);
	});

	var belongs_to9 = new Belongs_to({
		"product_id": 9, 
		"category_id" : 3
	});
	belongs_to9.save(function (err) {
		if(err) console.log("ERR: Savin belongs_to9: " + err);
	});

	var belongs_to10 = new Belongs_to({
		"product_id": 0, 
		"category_id" : 4
	});
	belongs_to10.save(function (err) {
		if(err) console.log("ERR: Savin belongs_to10: " + err);
	});

	var belongs_to11 = new Belongs_to({
		"product_id": 1, 
		"category_id" : 5
	});
	belongs_to11.save(function (err) {
		if(err) console.log("ERR: Savin belongs_to11: " + err);
	});

	var belongs_to12 = new Belongs_to({
		"product_id": 2, 
		"category_id" : 6
	});
	belongs_to12.save(function (err) {
		if(err) console.log("ERR: Savin belongs_to12: " + err);
	});


	var belongs_to13 = new Belongs_to({
		"product_id": 1, 
		"category_id" : 6
	});
	belongs_to13.save(function (err) {
		if(err) console.log("ERR: Savin belongs_to13: " + err);
	});

	var belongs_to14 = new Belongs_to({
		"product_id": 2, 
		"category_id" : 5
	});
	belongs_to14.save(function (err) {
		if(err) console.log("ERR: Savin belongs_to14: " + err);
	});

	var belongs_to15 = new Belongs_to({
		"product_id": 3, 
		"category_id" : 4
	});
	belongs_to15.save(function (err) {
		if(err) console.log("ERR: Savin belongs_to15: " + err);
	});

	var belongs_to16 = new Belongs_to({
		"product_id": 4, 
		"category_id" : 3
	});
	belongs_to16.save(function (err) {
		if(err) console.log("ERR: Savin belongs_to16: " + err);
	});

	var belongs_to17 = new Belongs_to({
		"product_id": 5, 
		"category_id" : 2
	});
	belongs_to17.save(function (err) {
		if(err) console.log("ERR: Savin belongs_to17: " + err);
	});

	var belongs_to18 = new Belongs_to({
		"product_id": 6, 
		"category_id" : 1
	});
	belongs_to18.save(function (err) {
		if(err) console.log("ERR: Savin belongs_to18: " + err);
	});

	var belongs_to19 = new Belongs_to({
		"product_id": 7, 
		"category_id" : 6
	});
	belongs_to19.save(function (err) {
		if(err) console.log("ERR: Savin belongs_to19: " + err);
	});

	var belongs_to20 = new Belongs_to({
		"product_id": 8, 
		"category_id" : 5
	});
	belongs_to20.save(function (err) {
		if(err) console.log("ERR: Savin belongs_to20: " + err);
	});

	var belongs_to21 = new Belongs_to({
		"product_id": 9, 
		"category_id" : 4
	});
	belongs_to21.save(function (err) {
		if(err) console.log("ERR: Savin belongs_to21: " + err);
	});

	var belongs_to22 = new Belongs_to({
		"product_id": 0, 
		"category_id" : 3
	});
	belongs_to22.save(function (err) {
		if(err) console.log("ERR: Savin belongs_to22: " + err);
	});

	var belongs_to23 = new Belongs_to({
		"product_id": 1, 
		"category_id" : 2
	});
	belongs_to23.save(function (err) {
		if(err) console.log("ERR: Savin belongs_to23: " + err);
	});

	var belongs_to24 = new Belongs_to({
		"product_id": 2, 
		"category_id" : 1
	});
	belongs_to24.save(function (err) {
		if(err) console.log("ERR: Savin belongs_to24: " + err);
	});

	Provide.remove({}, function(err) {
		if(err) console.log('--ERR: Remove provide: ' + err);
	});
	var provide1 = new Provide({
		"price" : 0.79, 
		"product_id": 01, 
		"supplier_id" : 3 
	});
	provide1.save(function(err) {
		if(err) console.log("--ERR: Error saving provide 1: " + err);
	});

	var provide2 = new Provide({
		"price" : 0.7, 
		"product_id": 02, 
		"supplier_id" : 3 
	});
	provide2.save(function(err) {
		if(err) console.log("--ERR: Error saving provide 2: " + err);
	});

	var provide3 = new Provide({
		"price" : 1, 
		"product_id": 03, 
		"supplier_id" : 3 
	});
	provide3.save(function(err) {
		if(err) console.log("--ERR: Error saving provide 3: " + err);
	});

	var provide4 = new Provide({
		"price" : 0.3, 
		"product_id": 04, 
		"supplier_id" : 3 
	});
	provide4.save(function(err) {
		if(err) console.log("--ERR: Error saving provide 4: " + err);
	});

	var provide5 = new Provide({
		"price" : 5.2, 
		"product_id": 05, 
		"supplier_id" : 3 
	});
	provide5.save(function(err) {
		if(err) console.log("--ERR: Error saving provide 5: " + err);
	});

	var provide6 = new Provide({
		"price" : 6.2, 
		"product_id": 06, 
		"supplier_id" : 3 
	});
	provide6.save(function(err) {
		if(err) console.log("--ERR: Error saving provide 6: " + err);
	});

	var provide7 = new Provide({
		"price" : 25, 
		"product_id": 07, 
		"supplier_id" : 3 
	});
	provide7.save(function(err) {
		if(err) console.log("--ERR: Error saving provide 7: " + err);
	});

	var provide8 = new Provide({
		"price" : 128, 
		"product_id": 08, 
		"supplier_id" : 3 
	});
	provide8.save(function(err) {
		if(err) console.log("--ERR: Error saving provide 8: " + err);
	});

	var provide9 = new Provide({
		"price" : 44.99, 
		"product_id": 09, 
		"supplier_id" : 3 
	});
	provide9.save(function(err) {
		if(err) console.log("--ERR: Error saving provide 9: " + err);
	});

	var provide10 = new Provide({
		"price" : 599, 
		"product_id": 10, 
		"supplier_id" : 3 
	});
	provide10.save(function(err) {
		if(err) console.log("--ERR: Error saving provide 10: " + err);
	});

	var provide11 = new Provide({
		"price" : 10.36, 
		"product_id": 11, 
		"supplier_id" : 3 
	});
	provide11.save(function(err) {
		if(err) console.log("--ERR: Error saving provide 11: " + err);
	});

	var provide12 = new Provide({
		"price" : 1.84, 
		"product_id": 12, 
		"supplier_id" : 3 
	});
	provide12.save(function(err) {
		if(err) console.log("--ERR: Error saving provide 12: " + err);
	});


	var provide13 = new Provide({
		"price" : 0.12, 
		"product_id": 01, 
		"supplier_id" : 4 
	});
	provide13.save(function(err) {
		if(err) console.log("--ERR: Error saving provide 13: " + err);
	});

	var provide14 = new Provide({
		"price" : 0.71, 
		"product_id": 02, 
		"supplier_id" : 4 
	});
	provide14.save(function(err) {
		if(err) console.log("--ERR: Error saving provide 14: " + err);
	});

	var provide15 = new Provide({
		"price" : 1.2, 
		"product_id": 03, 
		"supplier_id" : 4 
	});
	provide15.save(function(err) {
		if(err) console.log("--ERR: Error saving provide 15: " + err);
	});

	var provide16 = new Provide({
		"price" : 0.1, 
		"product_id": 04, 
		"supplier_id" : 4 
	});
	provide16.save(function(err) {
		if(err) console.log("--ERR: Error saving provide 16: " + err);
	});

	var provide17 = new Provide({
		"price" : 5.99, 
		"product_id": 05, 
		"supplier_id" : 4 
	});
	provide17.save(function(err) {
		if(err) console.log("--ERR: Error saving provide 17: " + err);
	});

	var provide18 = new Provide({
		"price" : 9.99, 
		"product_id": 06, 
		"supplier_id" : 4 
	});
	provide18.save(function(err) {
		if(err) console.log("--ERR: Error saving provide 18: " + err);
	});

	var provide19 = new Provide({
		"price" : 25.2, 
		"product_id": 07, 
		"supplier_id" : 4 
	});
	provide19.save(function(err) {
		if(err) console.log("--ERR: Error saving provide 19: " + err);
	});

	var provide20 = new Provide({
		"price" : 128.01, 
		"product_id": 08, 
		"supplier_id" : 4 
	});
	provide20.save(function(err) {
		if(err) console.log("--ERR: Error saving provide 20: " + err);
	});

	var provide21 = new Provide({
		"price" : 44.02, 
		"product_id": 09, 
		"supplier_id" : 4 
	});
	provide21.save(function(err) {
		if(err) console.log("--ERR: Error saving provide 21: " + err);
	});

	var provide22 = new Provide({
		"price" : 720, 
		"product_id": 10, 
		"supplier_id" : 4 
	});
	provide22.save(function(err) {
		if(err) console.log("--ERR: Error saving provide 22: " + err);
	});

	var provide23 = new Provide({
		"price" : 17, 
		"product_id": 11, 
		"supplier_id" : 4 
	});
	provide23.save(function(err) {
		if(err) console.log("--ERR: Error saving provide 23: " + err);
	});

	var provide24 = new Provide({
		"price" : 4, 
		"product_id": 12, 
		"supplier_id" : 4 
	});
	provide24.save(function(err) {
		if(err) console.log("--ERR: Error saving provide 24: " + err);
	});

	Purchase.remove({}, function(err) {
		if(err) console.log('--ERR: Remove purchase: ' + err);
	});
	var purchase1 = new Purchase({
		"_id": 1, 
		"deliveryDate" : new Date(1485961200*1000), 
		"paymentDate": new Date(1453029600*1000), 
		"customer_id" : 2
	});
	purchase1.save(function(err) {
		if(err) console.log("--ERR: Saving purchase1: " + err);
	});

	var purchase2 = new Purchase({
		"_id": 2, 
		"deliveryDate" : new Date(1485961200*1000), 
		"paymentDate": new Date(1453029600*1000), 
		"customer_id" : 2
	});
	purchase2.save(function(err) {
		if(err) console.log("--ERR: Saving purchase2: " + err);
	});


	var purchase3 = new Purchase({
		"_id": 3, 
		"deliveryDate" : new Date(1485961200*1000), 
		"paymentDate": new Date(1453029600*1000), 
		"customer_id" : 5
	});
	purchase3.save(function(err) {
		if(err) console.log("--ERR: Saving purchase3: " + err);
	});

	var purchase4 = new Purchase({
		"_id": 4, 
		"deliveryDate" : new Date(1485961200*1000), 
		"paymentDate": new Date(1453029600*1000), 
		"customer_id" : 5
	});
	purchase4.save(function(err) {
		if(err) console.log("--ERR: Saving purchase4: " + err);
	});

	PurchaseLine.remove({}, function(err) {
		if(err) console.log('--ERR: Remove purchase line: ' + err);
	});
	var purchaseLine1 = new PurchaseLine({
		"quantity": 1, 
		"purchase_id" : 1, 
		"provide_id" : 01 
	});
	purchaseLine1.save(function(err) {
		if(err) console.log("--ERR: Error saving Purchase Line 1: " + err);
	});

	var purchaseLine2 = new PurchaseLine({
		"quantity": 2, 
		"purchase_id" : 1, 
		"provide_id" : 02 
	});
	purchaseLine2.save(function(err) {
		if(err) console.log("--ERR: Error saving Purchase Line 2: " + err);
	});

	var purchaseLine3 = new PurchaseLine({
		"quantity": 3, 
		"purchase_id" : 1, 
		"provide_id" : 03 
	});
	purchaseLine3.save(function(err) {
		if(err) console.log("--ERR: Error saving Purchase Line 3: " + err);
	});

	var purchaseLine4 = new PurchaseLine({
		"quantity": 4, 
		"purchase_id" : 1, 
		"provide_id" : 04 
	});
	purchaseLine4.save(function(err) {
		if(err) console.log("--ERR: Error saving Purchase Line 4: " + err);
	});

	var purchaseLine5 = new PurchaseLine({
		"quantity": 5, 
		"purchase_id" : 1, 
		"provide_id" : 05 
	});
	purchaseLine5.save(function(err) {
		if(err) console.log("--ERR: Error saving Purchase Line 5: " + err);
	});

	var purchaseLine6 = new PurchaseLine({
		"quantity": 6, 
		"purchase_id" : 1, 
		"provide_id" : 06 
	});
	purchaseLine6.save(function(err) {
		if(err) console.log("--ERR: Error saving Purchase Line 6: " + err);
	});


	var purchaseLine7 = new PurchaseLine({
		"quantity": 1, 
		"purchase_id" : 2, 
		"provide_id" : 10 
	});
	purchaseLine7.save(function(err) {
		if(err) console.log("--ERR: Error saving Purchase Line 7: " + err);
	});

	var purchaseLine8 = new PurchaseLine({
		"quantity": 2, 
		"purchase_id" : 2, 
		"provide_id" : 11 
	});
	purchaseLine8.save(function(err) {
		if(err) console.log("--ERR: Error saving Purchase Line 8: " + err);
	});

	var purchaseLine9 = new PurchaseLine({
		"quantity": 3, 
		"purchase_id" : 2, 
		"provide_id" : 12 
	});
	purchaseLine9.save(function(err) {
		if(err) console.log("--ERR: Error saving Purchase Line 9: " + err);
	});

	var purchaseLine10 = new PurchaseLine({
		"quantity": 4, 
		"purchase_id" : 2, 
		"provide_id" : 13 
	});
	purchaseLine10.save(function(err) {
		if(err) console.log("--ERR: Error saving Purchase Line 10: " + err);
	});

	var purchaseLine11 = new PurchaseLine({
		"quantity": 5, 
		"purchase_id" : 2, 
		"provide_id" : 14 
	});
	purchaseLine11.save(function(err) {
		if(err) console.log("--ERR: Error saving Purchase Line 11: " + err);
	});

	var purchaseLine12 = new PurchaseLine({
		"quantity": 6, 
		"purchase_id" : 2, 
		"provide_id" : 15 
	});
	purchaseLine12.save(function(err) {
		if(err) console.log("--ERR: Error saving Purchase Line 12: " + err);
	});

	var purchaseLine13 = new PurchaseLine({
		"quantity": 1, 
		"purchase_id" : 3, 
		"provide_id" : 01 
	});
	purchaseLine13.save(function(err) {
		if(err) console.log("--ERR: Error saving Purchase Line 13: " + err);
	});

	var purchaseLine14 = new PurchaseLine({
		"quantity": 2, 
		"purchase_id" : 3, 
		"provide_id" : 02 
	});
	purchaseLine14.save(function(err) {
		if(err) console.log("--ERR: Error saving Purchase Line 14: " + err);
	});

	var purchaseLine15 = new PurchaseLine({
		"quantity": 3, 
		"purchase_id" : 3, 
		"provide_id" : 03 
	});
	purchaseLine15.save(function(err) {
		if(err) console.log("--ERR: Error saving Purchase Line 15: " + err);
	});

	var purchaseLine16 = new PurchaseLine({
		"quantity": 4, 
		"purchase_id" : 3, 
		"provide_id" : 04 
	});
	purchaseLine16.save(function(err) {
		if(err) console.log("--ERR: Error saving Purchase Line 16: " + err);
	});

	var purchaseLine17 = new PurchaseLine({
		"quantity": 5, 
		"purchase_id" : 3, 
		"provide_id" : 05 
	});
	purchaseLine17.save(function(err) {
		if(err) console.log("--ERR: Error saving Purchase Line 17: " + err);
	});

	var purchaseLine18 = new PurchaseLine({
		"quantity": 6, 
		"purchase_id" : 3, 
		"provide_id" : 06 
	});
	purchaseLine18.save(function(err) {
		if(err) console.log("--ERR: Error saving Purchase Line 18: " + err);
	});


	var purchaseLine19 = new PurchaseLine({
		"quantity": 1, 
		"purchase_id" : 4, 
		"provide_id" : 10 
	});
	purchaseLine19.save(function(err) {
		if(err) console.log("--ERR: Error saving Purchase Line 19: " + err);
	});

	var purchaseLine20 = new PurchaseLine({
		"quantity": 2, 
		"purchase_id" : 4, 
		"provide_id" : 11 
	});
	purchaseLine20.save(function(err) {
		if(err) console.log("--ERR: Error saving Purchase Line 20: " + err);
	});

	var purchaseLine21 = new PurchaseLine({
		"quantity": 3, 
		"purchase_id" : 4, 
		"provide_id" : 12 
	});
	purchaseLine21.save(function(err) {
		if(err) console.log("--ERR: Error saving Purchase Line 21: " + err);
	});

	var purchaseLine22 = new PurchaseLine({
		"quantity": 4, 
		"purchase_id" : 4, 
		"provide_id" : 13 
	});
	purchaseLine22.save(function(err) {
		if(err) console.log("--ERR: Error saving Purchase Line 22: " + err);
	});

	var purchaseLine23 = new PurchaseLine({
		"quantity": 5, 
		"purchase_id" : 4, 
		"provide_id" : 14 
	});
	purchaseLine23.save(function(err) {
		if(err) console.log("--ERR: Error saving Purchase Line 23: " + err);
	});

	var purchaseLine24 = new PurchaseLine({
		"quantity": 6, 
		"purchase_id" : 4, 
		"provide_id" : 15 
	});
	purchaseLine24.save(function(err) {
		if(err) console.log("--ERR: Error saving Purchase Line 24: " + err);
	});

	Rate.remove({}, function(err) {
		if(err) console.log('--ERR: Remove rates: ' + err);
	});
	var rate1 = new Rate({
		"value": 1, 
		"product_id" : 01, 
		"customer_id" : 2
	});
	rate1.save(function(err) {
		if(err) console.log("--ERR: Saving Rate 1: " + err);
	});

	var rate2 = new Rate({
		"value": 2, 
		"product_id" : 02, 
		"customer_id" : 2
	});
	rate2.save(function(err) {
		if(err) console.log("--ERR: Saving Rate 2: " + err);
	});

	var rate3 = new Rate({
		"value": 3, 
		"product_id" : 03, 
		"customer_id" : 2
	});
	rate3.save(function(err) {
		if(err) console.log("--ERR: Saving Rate 3: " + err);
	});

	var rate4 = new Rate({
		"value": 2, 
		"product_id" : 04, 
		"customer_id" : 2
	});
	rate4.save(function(err) {
		if(err) console.log("--ERR: Saving Rate 4: " + err);
	});

	var rate5 = new Rate({
		"value": 4, 
		"product_id" : 05, 
		"customer_id" : 2
	});
	rate5.save(function(err) {
		if(err) console.log("--ERR: Saving Rate 5: " + err);
	});

	var rate6 = new Rate({
		"value": 1, 
		"product_id" : 06, 
		"customer_id" : 2
	});
	rate6.save(function(err) {
		if(err) console.log("--ERR: Saving Rate 6: " + err);
	});

	var rate7 = new Rate({
		"value": 5, 
		"product_id" : 10, 
		"customer_id" : 2
	});
	rate7.save(function(err) {
		if(err) console.log("--ERR: Saving Rate 7: " + err);
	});

	var rate8 = new Rate({
		"value": 2, 
		"product_id" : 11, 
		"customer_id" : 2
	});
	rate8.save(function(err) {
		if(err) console.log("--ERR: Saving Rate 8: " + err);
	});

	var rate9 = new Rate({
		"value": 4, 
		"product_id" : 12, 
		"customer_id" : 2
	});
	rate9.save(function(err) {
		if(err) console.log("--ERR: Saving Rate 9: " + err);
	});

	var rate10 = new Rate({
		"value": 3, 
		"product_id" : 01, 
		"customer_id" : 5
	});
	rate10.save(function(err) {
		if(err) console.log("--ERR: Saving Rate 10: " + err);
	});

	var rate11 = new Rate({
		"value": 4, 
		"product_id" : 02, 
		"customer_id" : 5
	});
	rate11.save(function(err) {
		if(err) console.log("--ERR: Saving Rate 11: " + err);
	});

	var rate12 = new Rate({
		"value": 1, 
		"product_id" : 03, 
		"customer_id" : 5
	});
	rate12.save(function(err) {
		if(err) console.log("--ERR: Saving Rate 12: " + err);
	});

	var rate13 = new Rate({
		"value": 2, 
		"product_id" : 04, 
		"customer_id" : 5
	});
	rate13.save(function(err) {
		if(err) console.log("--ERR: Saving Rate 13: " + err);
	});

	var rate14 = new Rate({
		"value": 5, 
		"product_id" : 05, 
		"customer_id" : 5
	});
	rate14.save(function(err) {
		if(err) console.log("--ERR: Saving Rate 14: " + err);
	});

	var rate15 = new Rate({
		"value": 2, 
		"product_id" : 06, 
		"customer_id" : 5
	});
	rate15.save(function(err) {
		if(err) console.log("--ERR: Saving Rate 15: " + err);
	});

	var rate16 = new Rate({
		"value": 3, 
		"product_id" : 10, 
		"customer_id" : 5
	});
	rate16.save(function(err) {
		if(err) console.log("--ERR: Saving Rate 16: " + err);
	});

	var rate17 = new Rate({
		"value": 5, 
		"product_id" : 11, 
		"customer_id" : 5
	});
	rate17.save(function(err) {
		if(err) console.log("--ERR: Saving Rate 17: " + err);
	});

	var rate18 = new Rate({
		"value": 1, 
		"product_id" : 12, 
		"customer_id" : 5
	});
	rate18.save(function(err) {
		if(err) console.log("--ERR: Saving Rate 18: " + err);
	});

	Reputation.remove({}, function(err) {
		if(err) console.log('--ERR: Remove reputations: ' + err);
	});
	var reputation1 = new Reputation({
		"value": 3, 
		"supplier_id" : 3, 
		"customer_id" : 2
	});
	reputation1.save(function(err) {
		if(err) console.log("--ERR: saving reputation 1: " + err);
	});

	var reputation2 = new Reputation({
		"value": 4, 
		"supplier_id" : 4, 
		"customer_id" : 2
	});
	reputation2.save(function(err) {
		if(err) console.log("--ERR: saving reputation 2: " + err);
	});

	var reputation3 = new Reputation({
		"value": 5, 
		"supplier_id" : 3, 
		"customer_id" : 5
	});
	reputation3.save(function(err) {
		if(err) console.log("--ERR: saving reputation 3: " + err);
	});

	var reputation4 = new Reputation({
		"value": 2, 
		"supplier_id" : 4, 
		"customer_id" : 5
	});
	reputation4.save(function(err) {
		if(err) console.log("--ERR: saving reputation 4: " + err);
	});

	res.json("Done, check the console");
};