# -*- coding: utf-8 -*-
import numpy as np
import time

from maps.acme_database import get_customers
from heuristic.Customer import Customer
from heuristic.Graph import TSP_Graph
from heuristic.TPH import TPH

N_values = [9, 11, 13, 14]
times_exact = []
feasible_exact = []

times_heur = []
feasible_heur = []
for n in N_values:
    if n == 9:
        ids = [0, 3, 7, 14, 18, 5, 11, 15, 19, 1]
    elif n == 11:
        ids = [0, 3, 7, 14, 18, 31, 5, 11, 15, 19, 1, 2]
    elif n == 13:
        ids = [0, 3, 7, 14, 18, 31, 5, 11, 15, 19, 22, 1, 2, 4]
    elif n == 14:
        ids = [0, 3, 7, 14, 18, 31, 33, 5, 11, 15, 19, 22, 23, 2, 4]
        
    customers = get_customers(ids)
    
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
    
    tph = TPH(20, 50, optimize='d')
    tph.set_customers_ids(customers_ids)
    tph.set_customers_list(customers_list)
    tph.set_distance_matrix(data[1])
    tph.set_time_matrix(data[0])
    
    best_sol = tph.run()
    
    print(ids)
    print(best_sol)
    print(best_sol.is_valid())
    print(best_sol.get_time_cost())
    print(best_sol.get_distance_cost())
    print(best_sol.get_valid_customers())