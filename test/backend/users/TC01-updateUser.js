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

	it('should let an admin edit a user with a new value', function (done){
		browser
		.get('http://localhost:3000/api/customers')
		.end(function (err, res) {
			var customer = res.body[0];

			var customer_id = customer._id;
			var new_surname = 'Surname';

			browser
			.post('http://localhost:3000/api/user/updateUser')
			.send({ id: customer_id, field: 'surname', data: new_surname})
			.end(function (err, res) {
				browser
				.get('http://localhost:3000/api/customer/'+customer_id)
				.end(function (err, res) {
					res.status.should.be.equal(200);
					res.body.surname.should.be.equal(new_surname);
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
			var new_surname = 'Surname';
			var email = customer.email;
			var password = "customer";
			
			browser
			.post('http://localhost:3000/api/signin')
			.send( { email : email, password : password } )
			.end(function (err, res) {
				browser
				.post('http://localhost:3000/api/user/updateUser')
				.send({ id: customer_id, field: 'surname', data: new_surname})
				.end(function (err, res) {
					browser
					.get('http://localhost:3000/api/customer/'+customer_id)
					.end(function (err, res) {
						res.status.should.be.equal(200);
						res.body.surname.should.be.equal(new_surname);
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
			var new_surname = '987654321';

			browser
			.get('http://localhost:3000/api/signout')
			.end(function (err, res) {
				browser
				.post('http://localhost:3000/api/user/updateUser')
				.send({ id: customer_id, field: 'surname', data: new_surname})
				.end(function (err, res) {
					res.status.should.be.equal(401);
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
			var new_surname = '987654321';

			var email = customer_editor.email;
			var password = "customer";

			browser
			.post('http://localhost:3000/api/signin')
			.send( { email : email, password : password } )
			.end(function (err, res) {
				browser
				.post('http://localhost:3000/api/user/updateUser')
				.send({ id: customer_id, field: 'surname', data: new_surname})
				.end(function (err, res) {
					res.status.should.be.equal(401);
					done();					
				});
			});
		});
	});

	it('should let a user edit self password', function (done){
		browser
		.get('http://localhost:3000/api/customers')
		.end(function (err, res) {
			var customer = res.body[0];

			var customer_id = customer._id;
			var email = customer.email;
			var password = "customer";
			var newPass = "newpassword"

			browser
			.post('http://localhost:3000/api/signin')
			.send( { email : email, password : password } )
			.end(function (err, res) {
				browser
				.post('http://localhost:3000/api/api/user/changePassword')
				.send({ id: customer_id, oldPass: password, newPass: newPass })
				.end(function (err, res) {
					browser
					.post('http://localhost:3000/api/signin')
					.send( { email : email, password : newPass } )
					.end(function (err, res) {
						res.status.should.be.equal(200);

						res.body.success.should.be.true;
						done();
					});
				});
			});
		});
	});

	it('should let a user edit back self password', function (done){
		browser
		.get('http://localhost:3000/api/customers')
		.end(function (err, res) {
			var customer = res.body[0];

			var customer_id = customer._id;
			var email = customer.email;
			var password = "newpassword";
			var newPass = "customer"

			browser
			.post('http://localhost:3000/api/signin')
			.send( { email : email, password : password } )
			.end(function (err, res) {
				browser
				.post('http://localhost:3000/api/api/user/changePassword')
				.send({ id: customer_id, oldPass: password, newPass: newPass })
				.end(function (err, res) {
					browser
					.post('http://localhost:3000/api/signin')
					.send( { email : email, password : newPass } )
					.end(function (err, res) {
						res.status.should.be.equal(200);

						res.body.success.should.be.true;
						done();
					});
				});
			});
		});
	});
});