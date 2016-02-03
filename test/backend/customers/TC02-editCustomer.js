var should = require('should'),
	assert = require('assert'),
	request = require('superagent');
var should = require('should'),
	assert = require('assert'),
	request = require('superagent');

function stringGen(len) {
	var text = "";
	var charset = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789";
	for( var i=0; i < len; i++ )
		text += charset.charAt(Math.floor(Math.random() * charset.length));
	return text;
}

describe('System\'s customers management view', function () {
	var browser = request.agent();

	beforeEach(function (done) {
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {
			done();
		});
	});

	it('should let an admin edit a customer with a new value', function (done){
		browser
		.get('http://localhost:3000/api/customers')
		.end(function (err, res) {
			var customer = res.body[0];

			var customer_id = customer._id;
			var new_phone = '123456789';

			customer.phone = new_phone;
			browser
			.post('http://localhost:3000/api/customer')
			.send(customer)
			.end(function (err, res) {
				browser
				.get('http://localhost:3000/api/customer/'+customer_id)
				.end(function (err, res) {
					res.status.should.be.equal(200);
					res.body.phone.should.be.equal(new_phone);
					done();
				});
			});
		});
	});

	it('should let a customer edit itself', function (done){
		browser
		.get('http://localhost:3000/api/customers')
		.end(function (err, res) {
			var customer = res.body[0];

			var customer_id = customer._id;
			var new_phone = '987654321';
			var email = customer.email;
			var password = "customer";

			customer.phone = new_phone;
			browser
			.post('http://localhost:3000/api/signin')
			.send( { email : email, password : password } )
			.end(function (err, res) {
				browser
				.post('http://localhost:3000/api/customer')
				.send(customer)
				.end(function (err, res) {
					browser
					.get('http://localhost:3000/api/customer/'+customer_id)
					.end(function (err, res) {
						res.status.should.be.equal(200);
						res.body.phone.should.be.equal(new_phone);
						done();
					});
				});
			});
		});
	});

	it('shouldn\'t let a non-authenticated user edit a customer', function (done){
		browser
		.get('http://localhost:3000/api/customers')
		.end(function (err, res) {
			var customer = res.body[0];

			var customer_id = customer._id;
			var new_phone = '987654321';

			customer.phone = new_phone;
			browser
			.get('http://localhost:3000/api/signout')
			.end(function (err, res) {
				browser
				.post('http://localhost:3000/api/customer')
				.send(customer)
				.end(function (err, res) {
					res.status.should.be.equal(403);
					done();
				});
			});
		});
	});

	it('shouldn\'t let a customer edit other customer', function (done){
		browser
		.get('http://localhost:3000/api/customers')
		.end(function (err, res) {
			var customer_to_edit = res.body[0];
			var customer_editor = res.body[1];

			var customer_id = customer_to_edit._id;
			var new_phone = '987654321';

			var email = customer_editor.email;
			var password = "customer";

			customer_to_edit.phone = new_phone;
			browser
			.post('http://localhost:3000/api/signin')
			.send( { email : email, password : password } )
			.end(function (err, res) {
				browser
				.post('http://localhost:3000/api/customer')
				.send(customer_to_edit)
				.end(function (err, res) {
					res.status.should.be.equal(403);
					done();					
				});
			});
		});
	});

	it('should remove a customer', function (done){
		browser
		.get("http://localhost:3000/api/customers")
		.end(function (err, res){
			var L = res.body.length;
			for (var i = 0; i < L; i++) {
				if(res.body[i].email == "randmail@mail.com") {
					var id = res.body[i]._id;
					browser
					.del("http://localhost:3000/api/customer")
					.send({ id : id })
					.end(function (err, res){
						res.status.should.be.equal(200);
						res.body.success.should.be.exactly(true);
						done();
					});
				}
			}
		});
	});
});