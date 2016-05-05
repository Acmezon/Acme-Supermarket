# -*- coding: utf-8 -*-
from heuristic.Solution import Solution

def local1shift(solution, optimize):
    sol_customers = solution.get_solution()
    
    better_solution = None
    for i in range(1, len(sol_customers)):
        index_origin = i
        for j in range(1, len(sol_customers)):
            index_new = j
            
            if index_new == index_origin:
                continue
            
            solution_new = Solution(solution.get_solution().size, solution=solution)                
            solution_new.one_shift(index_origin, index_new)
            
            better = False
            if optimize == 'd':
                if solution_new.get_distance_cost() < solution.get_distance_cost():
                    solution_new.recompute_validity(min(i, j), prev_sol=solution)
                    better = True
            else:
                if solution_new.get_time_cost() < solution.get_time_cost():
                    solution_new.recompute_validity(min(i, j), prev_sol=solution)
                    better = True
                    
            if better and solution_new.is_valid():
                better_solution = solution_new
                break
        
        if better_solution is not None:
            break
    
    if better_solution is None:
        better_solution = solution
        
    return better_solution

def local2opt(solution, optimize):
    sol_customers = solution.get_solution()
    
    better_solution = None
    
    for i in range(1, len(sol_customers)):        
        index_origin = i
        for j in range(1, len(sol_customers)):
            index_new = j
            
            if index_new == index_origin:
                continue

            solution_new = Solution(solution.get_solution().size, solution=solution)                
            solution_new.two_opt(index_origin, index_new)
            
            better = False
            if optimize == 'd':
                if solution_new.get_distance_cost() < solution.get_distance_cost():
                    solution_new.recompute_validity(min(i, j), prev_sol=solution)
                    better = True
            else:
                if solution_new.get_time_cost() < solution.get_time_cost():                    
                    solution_new.recompute_validity(min(i, j), prev_sol=solution)
                    better = True
                    
            if better and solution_new.is_valid():
                better_solution = solution_new
                break
            elif better and solution_new.get_valid_customers()[j] == 0:
                break
            
        
        if better_solution is not None:
            break
        
    if better_solution is None:
        better_solution = solution
        
    return better_solution
    
def vnd(solution, optimize):
    new_solution = None
    
    while not solution == new_solution:
        solution = local1shift(solution, optimize)
        new_solution = Solution(solution.get_solution().size, solution=solution)
        solution = local2opt(solution, optimize)
        
    return new_solution