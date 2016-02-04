var request = require('superagent');
var should = require('should');
var assert = require('assert');

describe('Create purchasing rule', function () {
	var browser = request.agent();

	it("shouldn't let an anonymous user create purchasing rules", function (done){
		browser
		.get('http://localhost:3000/api/signout')
		.end(function (err, res) {
			browser
			.post('http://localhost:3000/api/createPurchasingRule')
			.end(function (err, res) {
				res.status.should.be.equal(401);

				done();
			});
		});
	});

	it("shouldn't let a supplier create purchasing rules", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'ismael.perez@example.com', password : 'supplier' } )
		.end(function (err, res) {
			browser
			.post('http://localhost:3000/api/createPurchasingRule')
			.end(function (err, res) {
				res.status.should.be.equal(401);

				done();
			});
		});
	});

	it("shouldn't let a customer create purchasing rules for an already 'ruled' provide", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'alex.gallardo@example.com', password : 'customer' } )
		.end(function (err, res) {
			browser
			.get('http://localhost:3000/api/mypurchasingrules')
			.end(function (err, res) {
				var provide_id = res.body[0].provide_id;

				var rule = {
					startDate: new Date(),
					periodicity: 4,
					quantity: 1
				};

				browser
				.post('http://localhost:3000/api/createPurchasingRule')
				.send({ rule: rule, provide_id: provide_id })
				.end(function (err, res) {
					res.status.should.be.equal(503);

					done();
				});
			});
		});
	});

	it("shouldn't let a customer create purchasing rules for other customer", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'no.rules@mail.com', password : 'customer' } )
		.end(function (err, res) {
			browser
			.post("http://localhost:3000/api/products/filtered")
			.send( { ordering_sort: 'price', priceFilter : 500} )
			.end(function (err, res){

				var product = res.body[0];

				browser
				.get('http://localhost:3000/api/providesByProductId/' + product._id)
				.end(function (err, res) {
					should.not.exist(err);
					res.status.should.be.equal(200);

					var provide_id = res.body[0]._id;

					var rule = {
						startDate: new Date(),
						periodicity: 4,
						quantity: 1,
						customer_id: 3
					};

					browser
					.post('http://localhost:3000/api/createPurchasingRule')
					.send({ rule: rule, provide_id: provide_id })
					.end(function (err, res) {
						res.status.should.be.equal(403);

						done();
					});
				});
			});
		});
	});

	it("should let a customer create a new purchasing rule", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'no.rules@mail.com', password : 'customer' } )
		.end(function (err, res) {
			browser
			.post("http://localhost:3000/api/products/filtered")
			.send( { ordering_sort: 'price', priceFilter : 500} )
			.end(function (err, res){

				var product = res.body[0];

				browser
				.get('http://localhost:3000/api/providesByProductId/' + product._id)
				.end(function (err, res) {
					should.not.exist(err);
					res.status.should.be.equal(200);

					var provide_id = res.body[0]._id;

					var rule = {
						startDate: new Date(),
						periodicity: 4,
						quantity: 1
					};

					browser
					.post('http://localhost:3000/api/createPurchasingRule')
					.send({ rule: rule, provide_id: provide_id })
					.end(function (err, res) {
						res.status.should.be.equal(200);

						done();
					});
				});
			});
		});
	});

	it("shouldn't let an admin create purchasing rule due to missing customer_id", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {
			browser
			.post("http://localhost:3000/api/products/filtered")
			.send( { ordering_sort: 'price', priceFilter : 500} )
			.end(function (err, res){

				var product = res.body[0];

				browser
				.get('http://localhost:3000/api/providesByProductId/' + product._id)
				.end(function (err, res) {
					should.not.exist(err);
					res.status.should.be.equal(200);

					var provide_id = res.body[0]._id;

					var rule = {
						startDate: new Date(),
						periodicity: 4,
						quantity: 1
					};

					browser
					.post('http://localhost:3000/api/createPurchasingRule')
					.send({ rule: rule, provide_id: provide_id })
					.end(function (err, res) {
						res.status.should.be.equal(503);

						done();
					});
				});
			});
		});
	});

	it("shouldn't let an admin create purchasing rule due to the customer already has a rule for that provide", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'alex.gallardo@example.com', password : 'customer' } )
		.end(function (err, res) {
			browser
			.get('http://localhost:3000/api/mypurchasingrules')
			.end(function (err, res) {
				var provide_id = res.body[0].provide_id;

				var rule = {
					startDate: new Date(),
					periodicity: 4,
					quantity: 1
				};

				browser
				.post('http://localhost:3000/api/createPurchasingRule')
				.send({ rule: rule, provide_id: provide_id })
				.end(function (err, res) {
					res.status.should.be.equal(503);

					done();
				});
			});
		});

		
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {
			browser
			.post("http://localhost:3000/api/products/filtered")
			.send( { ordering_sort: 'price', priceFilter : 500} )
			.end(function (err, res){

				var product = res.body[0];

				browser
				.get('http://localhost:3000/api/providesByProductId/' + product._id)
				.end(function (err, res) {
					should.not.exist(err);
					res.status.should.be.equal(200);
					
					var provide_id = res.body[0]._id;

					var rule = {
						startDate: new Date(),
						periodicity: 4,
						quantity: 1
					};

					browser
					.post('http://localhost:3000/api/createPurchasingRule')
					.send({ rule: rule, provide_id: provide_id })
					.end(function (err, res) {
						res.status.should.be.equal(503);

						done();
					});
				});
			});
		});
	});
});