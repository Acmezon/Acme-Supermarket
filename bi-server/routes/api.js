var SalesFact = require('../models/sales_fact'),
	ProductDim = require('../models/product_dim'),
	SupplierDim = require('../models/supplier_dim'),
	TimeDim = require('../models/time_dim');
	sync = require('synchronize'),
	SortedMap = require("collections/sorted-map"),
	fs = require('fs'),
	ServiceReports = require('./service_reports');

exports.getSalesOverTime = function(req, res) {
	var supplier_id = req.params.id;
	console.log("Api-GetSalesOverTime-Supplier: " + supplier_id);

	SalesFact.find({"supplier_id" : supplier_id}, function (err, facts) {
		if(err) {
			res.sendStatus(500);
			return;
		}

		sync.fiber(
		function (){
			var completed_facts = {};

			for(var i=0; i<facts.length; i++) {
				var fact = facts[i];

				var fact_date = sync.await(TimeDim.find({"time_id" : fact.time_id}, sync.defer()))[0];				
				fact_date = new Date(fact_date.date);

				//fact_date = fact_date.getDate() + "/" + fact_date.getMonth() + "/" + fact_date.getFullYear();
				fact_product = fact.product_id;

				if(!(fact_date in completed_facts)) {
					var sales_data = {};
					sales_data[fact_product] = 1;
					
					completed_facts[fact_date] = sales_data;
				} else {
					var sales_data = completed_facts[fact_date];

					if(!(fact_product in sales_data)) {
						sales_data[fact_product] = 1;
					} else {
						sales_data[fact_product] = sales_data[fact_product] + 1;
					}

					completed_facts[fact_date] = sales_data;
				}
			}

			var products_number = sync.await(SalesFact.find({"supplier_id" : supplier_id}).distinct("product_id", sync.defer())).length;

			var dates = Object.keys(completed_facts);
			dates.sort(function (a, b){
				return (new Date(a)).getTime() - (new Date(b)).getTime();
			});

			var header = ["date"];
			var final_data = [];

			for(var i=0; i<dates.length; i++) {
				var date = new Date(dates[i]);
				var products = completed_facts[date];

				var ids = Object.keys(products);

				var new_line = [];
				for(var number = 0; number < products_number; number++) {
					new_line.push("");
				}

				new_line.splice(0, 0, date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate());
				final_data.push(new_line);

				for(var j=0; j<ids.length; j++){
					var product_id = ids[j];
					if(header.indexOf(product_id) < 0) {
						header.push(product_id);
					}

					var index = header.indexOf(product_id);
					var current_line = final_data[i];

					current_line.splice(index, 0, products[product_id]);
				}
			}

			var final_header = ["date"];
			for(var i = 1; i < header.length; i++) {
				var product = sync.await(ProductDim.find({"product_id" : header[i]}, sync.defer()))[0];
				final_header.push(product.name);
			}
			final_data.splice(0, 0, final_header);

			return final_data;
		}, 
		function (err, data) {
			if(err) {
				console.log(err);
				res.status(500).send(err);
			} else {
				var csv = [];
				for(var i = 0; i < data.length; i++) {
					csv.push(data[i].join(";"));
				}

				csv = csv.join("\n");
				res.status(200).send(csv);
			}
		});
	})
}

exports.notFound = function(req, res) {
	console.log("Route not found: " + req.originalUrl);
	res.sendStatus(404);
}

exports.getReport = function (req, res) {
	var year = parseInt(req.body.year) || null,
		supplier_email = req.body.supplier_email;

	console.log("Funtion-BI_API-getReport --suppier: " + supplier_email + " --year: " + year);

	if (year && supplier_email) {

		var expectedURI =  "../public/reports/sales/" + supplier_email + year + ".pdf";

		fs.access(expectedURI, fs.F_OK, function(err) {
		    if (!err) {
		        console.log('File exists');
				var today = new Date();
				if (year==today.getFullYear()) {
					// Update report
					ServiceReports.generateReport(year, supplier_email, expectedURI, function (response) {
			    		if (response.success) {
			    			res.sendStatus(200);
			    		} else{
			    			res.status(response.code).json({success: false})
			    		}
		    		});
				} else {
					// Returns report already generated
					res.sendStatus(200);
				}
		    } else {
		        console.log('File dont exists');
				// Create report
				ServiceReports.generateReport(year, supplier_email, expectedURI, function (response) {
		    		if (response.success) {
		    			res.sendStatus(200)
		    		} else{
		    			res.status(response.code).json({success: false})
		    		}
		    	});
		    }
		});
	} else {
		res.status(500);
	}
}

