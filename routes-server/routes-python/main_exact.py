# -*- coding: utf-8 -*-
import argparse
import datetime
import os
import numpy as np

from exact.read_file import from_google_maps, lopez_ibanez_blum_format
from exact.Dumas import Dumas
from datetime import date, datetime, timedelta
from pymongo import MongoClient
from maps.acme_database import today_customers, today_purchases
from maps.matrices import get_matrices

def run_acmesupermarket(today_purchases, today_customers):
	customers_coords = [coords.replace(b';', b',').decode('utf-8') for coords in today_customers['c']]

	client = MongoClient()
	db = client['Acme-Supermarket']

	today = datetime.utcnow().date()
	route = {
		'day' : today.day,
		'month': today.month,
		'year': today.year
	}

	if len(today_customers):
   
		data = get_matrices(customers_coords)
		time_matrix = data[0]

		searchingSolution = True
		while (searchingSolution):

			for c in today_customers:
				print(c)
			
			graph = from_google_maps(today_customers, time_matrix)
			dumas = Dumas(graph)
			sol = dumas.run()

			if sol.is_feasible():
				searchingSolution = False
			else:
				deleted_customer = today_customers[-1]
				today_customers = np.delete(today_customers,-1)
				tomorrow = datetime.date.today() + datetime.timedelta(days=1)
				for purchase in today_purchases:
					if purchase['customer_id']==deleted_customer['id']:
						result = db.purchases.update_one(
							{"_id": purchase['_id']},
							{"$set": {"deliveryDate": tomorrow}}
						)

		result_customers = []
		for vertex in sol.vertices:
			if vertex.label!='start' and vertex.label!='end':
				result_customers.append(-1)
			elif vertex.label=='end':
				result_customers.append(-1)
			else:
				result_customers.append(int(vertex.label))

		result_times = []
		for s in sol.times:
			hour = int(s/3600)
			minute = int((s-(hour*3600))/60)
			second = int(s-((hour*3600)+(minute*60)))
			t = datetime(today.year, today.month, today.day, 
				hour, minute, second)
			result_times.append(t)


		route['customers'] = result_customers
		route['times'] = result_times


	else:
		route['customers'] = []
		route['times'] = []

	db.routes.insert(route)

def run_example():
	n = input("Numero de clientes [10-14]: ")
	graph = lopez_ibanez_blum_format('exact/examples/n20w'+n+'.001.txt')
	dumas = Dumas(graph)
	sol = dumas.run()
	print("-----------")
	print(sol)
	print(sol.times)
	print(sol.is_feasible())
	print(sol.total_cost())

if __name__=="__main__":
	ap = argparse.ArgumentParser()
	ap.add_argument("-s", "--source", required=True, choices=[
                    'example', 'Acme-Supermarket'],
                    help="Data source used: Example /\
                     Acme-Supermarket DB")
	args = vars(ap.parse_args())
	if args['source']=='example':
		run_example()
	else:
		run_acmesupermarket()