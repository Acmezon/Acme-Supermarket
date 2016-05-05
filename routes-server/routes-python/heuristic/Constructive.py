# -*- coding: utf-8 -*-
import numpy as np
import heuristic.utils as utils
import random

from heuristic.Graph import TSP_Graph
from heuristic.Solution import Solution

def random_solution(graph, customers_list):
    if not isinstance(graph, TSP_Graph):
        utils.raise_value_error(graph, TSP_Graph, type(graph))
    
    if not isinstance(customers_list, list):
        utils.raise_value_error("customers_list", list, type(customers_list))
        
    customers = np.empty((len(customers_list),), 
                         dtype=[('id', 'i4'), ('ws', 'i8'), ('we', 'i8'), ('t', 'i8')])
    
    for i, customer in enumerate(customers_list):
        depot_pos = graph.get_customer_index(0)        
        c_pos = customer.get_row()
        customers[i] = (customer.get_row(), 
                        customer.get_window_start(),
                        customer.get_window_end(),
                        graph.get_value(depot_pos, c_pos))
    
    # Almacen siempre el primero, su ventana empieza en 0 y el tiempo hasta si
    # mismo es 0
    
    customers = customers[np.argsort(customers, order=('we', 't'))]
    
    depot = np.where(customers['id'] == 0)[0][0]
    
    customers = np.concatenate(([customers[depot]],
                                customers[0:depot],
                                customers[depot+1:]))
    ###############
    ## Provisional, se quitara la inversion del orden, es para forzar una solucion
    ## inicial invalida
    ##
    ## customers = customers[np.argsort(customers, order=('ws', 't'))[::-1]]
    ## first = customers[0]
    ## last = customers[-1]
    ## customers = np.concatenate(([last], customers[1:-1], [first]))
    ###############
    
    solution = Solution(len(customers_list))
    
    solution.set_graph(graph)
    solution.set_solution(customers['id'])
    
    
    start_time = int(customers['ws'][1] - customers['t'][1])
    if start_time < 0:
        start_time = 0

    solution.set_start_time(start_time)
    
    curr_time = start_time
    for i, c_row in enumerate(solution.get_solution()):
        customer = next((c for c in customers_list if c.get_row() == c_row), None)
        time_visited = curr_time + customers['t'][i]

        if time_visited < customer.get_window_start():
            time_visited = customer.get_window_start()
        
        customer.set_time_visited(int(time_visited))
        curr_time = time_visited
    
    solution.set_customer_list(customers_list)
    
    solution.compute_validity()
    
    return solution
    
def perturbation(solution, level):
    solution_new = Solution(solution.get_solution().size, solution=solution)    
    
    min_index = solution_new.get_solution().size * 10000
    for i in range(level):
        index_origin = random.randint(1, solution_new.get_solution().size - 1)
        index_new = random.randint(1, solution_new.get_solution().size - 1)
        
        curr_min = min(index_origin, index_new)
        
        if curr_min < min_index:
            min_index = curr_min
        
        solution_new.one_shift(index_origin, index_new)
    
    solution_new.recompute_validity(min_index)
    solution_new.compute_validity()
        
    return solution_new
    
def local1shift(solution):
    customers_validity = solution.get_valid_customers()
    
    valid_customers = np.where(customers_validity == 1)[0]
    violated_customers = np.where(customers_validity == 0)[0]
    
    better_solution = None
    min_index = customers_validity.size * 10000

    # Backward movement of violated customers    
    for i in violated_customers:
        index_origin = i
        for j in range(i - 1, 0, -1):
            index_new = j
                            
            if not solution.is_arc_valid(i, j):
                break
            
            solution_new = Solution(solution.get_solution().size, solution=solution)                
            solution_new.one_shift(index_origin, index_new)
            min_ = min(index_origin, index_new)

            if min_ < min_index:            
                min_index = min_
            
            if solution_new.get_constructive_obj() > solution.get_constructive_obj():
                better_solution = solution_new
                break
        
        if better_solution is not None:
            break
        
    if better_solution is None:
        # Forward movement of non-violated customers
        for i in valid_customers:
            # Depot can't be moved
            if solution.get_solution()[i] == 0:
                continue

            index_origin = i
            for j in range(i + 1, customers_validity.size):
                index_new = j
                
                if not solution.is_arc_valid(j, i):
                    break
                
                solution_new = Solution(solution.get_solution().size, solution=solution)                
                solution_new.one_shift(index_origin, index_new)
                min_ = min(index_origin, index_new)

                if min_ < min_index:            
                    min_index = min_
                
                if solution_new.get_constructive_obj() > solution.get_constructive_obj():
                    better_solution = solution_new
                    break
            
            if better_solution is not None:
                break
            
    if better_solution is None:
        # Backward movement of non-violated customers
        for i in valid_customers:
            # Depot can't be moved
            if solution.get_solution()[i] == 0:
                continue

            index_origin = i
            for j in range(i - 1, 0, -1):
                index_new = j
                                
                if not solution.is_arc_valid(i, j):
                    break
                
                solution_new = Solution(solution.get_solution().size, solution=solution)                
                solution_new.one_shift(index_origin, index_new)
                min_ = min(index_origin, index_new)

                if min_ < min_index:            
                    min_index = min_
                
                if solution_new.get_constructive_obj() > solution.get_constructive_obj():
                    better_solution = solution_new
                    break
            
            if better_solution is not None:
                break
            
    if better_solution is None:
        # Forward movement of violated customers
        for i in violated_customers:
            index_origin = i
            
            for j in range(i + 1, customers_validity.size):
                index_new = j
                
                if not solution.is_arc_valid(j, i):
                    break
                
                solution_new = Solution(solution.get_solution().size, solution=solution)                
                solution_new.one_shift(index_origin, index_new)
                min_ = min(index_origin, index_new)

                if min_ < min_index:            
                    min_index = min_
                
                if solution_new.get_constructive_obj() > solution.get_constructive_obj():
                    better_solution = solution_new
                    break
            
            if better_solution is not None:
                break
    
    if better_solution is None:
        better_solution = solution

    better_solution.recompute_validity(min_index)
    better_solution.compute_validity()

    return better_solution