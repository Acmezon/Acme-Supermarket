# -*- coding: utf-8 -*-
import numpy as np

from heuristic.utils import raise_value_error
from heuristic.Graph import TSP_Graph
from heuristic.Constructive import random_solution, perturbation, local1shift
from heuristic.VND import vnd

class TPH:
    
    def __init__(self, maxIter, maxLevel, optimize='d'):
        assert maxIter > 0
        assert maxLevel > 0
        assert optimize == 'd' or optimize == 't'

        self.maxIter = maxIter
        self.maxLevel = maxLevel
        self.optimize = optimize
        self.customers_ids = None
        self.customers_list = None
        self.distance_matrix = None
        self.time_matrix = None
        
    def get_maxLevel(self):
        return self.maxLevel
        
    def set_maxLevel(self, maxLevel):
        if not isinstance(maxLevel, int):
            raise_value_error('maxLevel', int, type(maxLevel))
            
        self.maxLevel = maxLevel
        
    def get_maxIter(self):
        return self.maxIter
        
    def set_maxIter(self, maxIter):
        if not isinstance(maxIter, int):
            raise_value_error('maxIter', int, type(maxIter))
            
        self.maxIter = maxIter
    
    def get_optimize(self):
        return self.optimize
        
    def set_optimize(self, optimize):
        assert optimize == 'd' or optimize == 't'
        
        self.optimize = optimize

    def get_customers_ids(self):
        return self.customers_ids
        
    def set_customers_ids(self, customers_ids):
        if not isinstance(customers_ids, list) and \
            not isinstance(customers_ids, np.ndarray):
                raise_value_error('customers_ids', list, type(customers_ids))
        
        customers_ids = np.array(customers_ids)
        if self.customers_list is not None:
            assert len(self.customers_list) == customers_ids.size
        
        if self.distance_matrix is not None:
            assert self.distance_matrix.shape[0] == customers_ids.size
            
        if self.time_matrix is not None:
            assert self.time_matrix.shape[0] == customers_ids.size
            
        self.customers_ids = customers_ids
        
    def get_customers_list(self):
        return self.customers_list
        
    def set_customers_list(self, customers_list):
        if not isinstance(customers_list, list) and \
            not isinstance(customers_list, np.ndarray):
                raise_value_error('customers_list', list, type(customers_list))
        
        customers_list = list(customers_list)
        if self.customers_ids is not None:
            assert len(self.customers_ids) == len(customers_list)
        
        if self.distance_matrix is not None:
            assert self.distance_matrix.shape[0] == len(customers_list)
            
        if self.time_matrix is not None:
            assert self.time_matrix.shape[0] == len(customers_list)
            
        self.customers_list = customers_list
        
    def get_time_matrix(self):
        return self.time_matrix
        
    def set_time_matrix(self, time_matrix):
        if not isinstance(time_matrix, np.ndarray):
            raise_value_error('time_matrix', np.ndarray, type(time_matrix))
            
        if self.customers_ids is not None:
            assert len(self.customers_ids) == time_matrix.shape[0]
            
        if self.customers_list is not None:
            assert len(self.customers_list) == time_matrix.shape[0]
        
        if self.distance_matrix is not None:
            assert self.distance_matrix.shape == time_matrix.shape
            
        self.time_matrix = time_matrix
        
    def get_distance_matrix(self):
        return self.distance_matrix
        
    def set_distance_matrix(self, distance_matrix):
        if not isinstance(distance_matrix, np.ndarray):
            raise_value_error('distance_matrix', np.ndarray, type(distance_matrix))
            
        if self.customers_ids is not None:
            assert len(self.customers_ids) == distance_matrix.shape[0]
            
        if self.customers_list is not None:
            assert len(self.customers_list) == distance_matrix.shape[0]
        
        if self.time_matrix is not None:
            assert self.time_matrix.shape == distance_matrix.shape
            
        self.distance_matrix = distance_matrix
        
    def run(self):
        assert self.get_customers_ids() is not None
        assert self.get_customers_list() is not None
        assert self.get_distance_matrix() is not None
        assert self.get_time_matrix() is not None
        
        time_graph = TSP_Graph(self.get_customers_ids().size)
        time_graph.set_ids(self.get_customers_ids())
        time_graph.set_matrix(self.get_time_matrix())
        
        distance_graph = TSP_Graph(self.get_customers_ids().size)
        distance_graph.set_ids(self.get_customers_ids())
        distance_graph.set_matrix(self.get_distance_matrix())

        best_sol = None
        
        for _ in range(self.get_maxIter()):
            level = 1
            solution = random_solution(time_graph, self.get_customers_list())
            solution.set_distances(distance_graph)
            
            solution = local1shift(solution)
            
            while (not solution.is_valid()) and level < self.get_maxLevel():
                improved_sol = perturbation(solution, level)
                improved_sol = local1shift(improved_sol)
                
                improved_sol.recompute_validity(1)
                improved_sol.compute_validity()
                if improved_sol.get_constructive_obj() < solution.get_constructive_obj():
                    solution = improved_sol
                    level = 1
                else:
                    level += 1
            
            solution.recompute_validity(1)
            solution.compute_validity()
            if solution.is_valid():
                best_sol = solution
                level = 1
                solution = vnd(solution, self.optimize)
                solution.recompute_validity(1)
                solution.compute_validity()
                
                while level < self.get_maxLevel():
                    improved_sol = perturbation(solution, level)
                    improved_sol = vnd(improved_sol, self.optimize)
                    
                    solution.recompute_validity(1)
                    solution.compute_validity()                    
                    
                    if self.optimize == 'd':
                        if improved_sol.is_valid() and \
                            improved_sol.get_distance_cost() < \
                            solution.get_distance_cost():
                            solution = improved_sol
                            level = 1
                        else:
                            level += 1
                    else:
                        if improved_sol.is_valid() and \
                        improved_sol.get_time_cost() < \
                        solution.get_time_cost():
                            solution = improved_sol
                            level = 1
                        else:
                            level += 1

            if best_sol is None:
                best_sol = solution
            elif not best_sol.is_valid() and solution.is_valid():
                best_sol = solution
            
            if self.optimize == 'd':
                if solution.is_valid() and \
                solution.get_distance_cost() \
                < best_sol.get_distance_cost():
                    best_sol = solution
            else:
                if solution.is_valid() and \
                solution.get_time_cost() < \
                best_sol.get_time_cost():
                    best_sol = solution
                    
        best_sol.recompute_validity(1)
        best_sol.compute_validity()

        return best_sol