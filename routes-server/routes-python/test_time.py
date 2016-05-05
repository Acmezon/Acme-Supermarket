import numpy as np
import matplotlib.pyplot as plt
import time

from maps.acme_database import get_customers
from exact.Dumas import Dumas
from exact.read_file import from_google_maps
from heuristic.Customer import Customer
from heuristic.Graph import TSP_Graph
from heuristic.TPH import TPH

def time_exact(n, customers):
	data = np.load('maps/matrices{0}.npy'.format(n))
	time_matrix = data[0]
	
	t = time.time()
	graph = from_google_maps(customers, time_matrix)
	dumas = Dumas(graph)
	solution = dumas.run()

	exact_time = time.time() - t
	print("Exact time: " + str(exact_time) + " s")

	return exact_time, solution.is_feasible()

def time_heuristic(n, customers):
	data = np.load('maps/matrices{0}.npy'.format(n))
	customers_ids = customers['id']    
	
	t = time.time()
	time_graph = TSP_Graph(customers_ids.size)
	time_graph.set_ids(customers_ids)
	time_graph.set_matrix(data[0])
	
	distance_graph = TSP_Graph(customers_ids.size)
	distance_graph.set_ids(customers_ids)
	distance_graph.set_matrix(data[1])
	
	customers_list = []
	for customer in customers:
		customer_obj = Customer(customer['id'], customer['ws'], customer['we'])
		customer_obj.set_row(distance_graph.get_customer_index(customer['id']))
		
		customers_list.append(customer_obj)

	tph = TPH(20, 50, optimize='t')
	tph.set_customers_ids(customers_ids)
	tph.set_customers_list(customers_list)
	tph.set_distance_matrix(data[1])
	tph.set_time_matrix(data[0])
	
	best_sol = tph.run()
	
	heur_time = time.time() - t
	print("Heur time: " + str(heur_time) + " s")

	return heur_time, best_sol.is_valid()

def run_all():
	N_values = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
	times_exact = []
	feasible_exact = []
	
	times_heur = []
	feasible_heur = []
	for n in N_values:

		print("N: " + str(n))

		if n == 5:
			ids = [0, 3, 7, 14, 18, 5]
		elif n == 6:
			ids = [0, 3, 7, 14, 18, 5, 15]
		elif n == 7:
			ids = [0, 3, 7, 14, 18, 5, 15, 19]
		elif n == 8:
			ids = [0, 3, 7, 14, 18, 5, 11, 15, 19]
		elif n == 9:
			ids = [0, 3, 7, 14, 18, 5, 11, 15, 19, 1]
		elif n == 10:
			ids = [0, 3, 7, 14, 18, 31, 5, 11, 15, 19, 1]
		elif n == 11:
			ids = [0, 3, 7, 14, 18, 31, 5, 11, 15, 19, 1, 2]
		elif n == 12:
			ids = [0, 3, 7, 14, 18, 31, 5, 11, 15, 19, 1, 2, 6]
		elif n == 13:
			ids = [0, 3, 7, 14, 18, 31, 5, 11, 15, 19, 1, 2, 6, 10]
		elif n == 14:
			ids = [0, 3, 7, 14, 18, 31, 5, 11, 15, 19, 1, 2, 6, 10, 12]
		elif n == 15:
			ids = [0, 3, 7, 14, 18, 31, 5, 11, 15, 19, 1, 2, 6, 10, 12, 25]
			
		customers = get_customers(ids)
		
		if n < 12:
			exact_time, exact_feasible = time_exact(n, customers)        
			times_exact.append(exact_time)
			if exact_feasible:
				feasible_exact.append('g')
			else:
				feasible_exact.append('r')     
		
		heur_time, heur_feasible = time_heuristic(n, customers)
		times_heur.append(heur_time)
		if heur_feasible:
			feasible_heur.append('g')
		else:
			feasible_heur.append('r')
	
	fig = plt.figure()
	plt.plot(list(range(5, 12)), times_exact)
	plt.scatter(list(range(5, 12)), times_exact, c=feasible_exact)
	plt.plot(N_values, times_heur)
	plt.scatter(N_values, times_heur, c=feasible_heur)
	plt.legend(['Dumas', 'TPH'], loc='upper left')
	plt.savefig('test-res.png', dpi=271, bbox_inches='tight')
	fig.clear()
	plt.close('all')

def run_heur():
	N_values = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
	
	times_heur = []
	feasible_heur = []
	for n in N_values:

		print("N: " + str(n))

		if n == 5:
			ids = [0, 3, 7, 14, 18, 5]
		elif n == 6:
			ids = [0, 3, 7, 14, 18, 5, 15]
		elif n == 7:
			ids = [0, 3, 7, 14, 18, 5, 15, 19]
		elif n == 8:
			ids = [0, 3, 7, 14, 18, 5, 11, 15, 19]
		elif n == 9:
			ids = [0, 3, 7, 14, 18, 5, 11, 15, 19, 1]
		elif n == 10:
			ids = [0, 3, 7, 14, 18, 31, 5, 11, 15, 19, 1]
		elif n == 11:
			ids = [0, 3, 7, 14, 18, 31, 5, 11, 15, 19, 1, 2]
		elif n == 12:
			ids = [0, 3, 7, 14, 18, 31, 5, 11, 15, 19, 1, 2, 6]
		elif n == 13:
			ids = [0, 3, 7, 14, 18, 31, 5, 11, 15, 19, 1, 2, 6, 10]
		elif n == 14:
			ids = [0, 3, 7, 14, 18, 31, 5, 11, 15, 19, 1, 2, 6, 10, 12]
		elif n == 15:
			ids = [0, 3, 7, 14, 18, 31, 5, 11, 15, 19, 1, 2, 6, 10, 12, 25]
			
		customers = get_customers(ids)     
		
		heur_time, heur_feasible = time_heuristic(n, customers)
		times_heur.append(heur_time)
		if heur_feasible:
			feasible_heur.append('g')
		else:
			feasible_heur.append('r')
	
	fig = plt.figure()
	plt.plot(N_values, times_heur)
	plt.scatter(N_values, times_heur, c=feasible_heur)
	plt.legend(['TPH'], loc='upper left')
	plt.savefig('test-res-heuristic.png', dpi=271, bbox_inches='tight')
	fig.clear()
	plt.close('all')

if __name__=="__main__":
	run_heur()

		

