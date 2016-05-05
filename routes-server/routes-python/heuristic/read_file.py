# -*- coding: utf-8 -*-
import numpy as np

from heuristic.Customer import Customer

def lopez_ibanez_blum_format(filepath):
    lines = [line.strip().split() for line in open(filepath, 'r')]
    N = int(lines[0][0])
    time_matrix = np.empty((N, N))
    distance_matrix = np.empty((N, N))
    
    customers_list = []
    customers_ids = []
    
    # Read edges
    for i in range(len(lines[1:N+1])):
        line = lines[1:N+1][i]
        for j in range(len(line)):
            cost = float(line[j])
            time_matrix[i, j] = cost
            distance_matrix[i, j] = cost

    # Read time windows
    for i in range(len(lines[N+1:(2*N)+1])):
        line = lines[N+1:(2*N)+1][i]
        ws = float(line[0])
        we = float(line[1])
        
        customer = Customer(i, ws, we)
        customer.set_row(i)
        
        customers_list.append(customer)
        customers_ids.append(i)
    
    data = [time_matrix, distance_matrix]
    customers = [customers_list, customers_ids]
    
    return data, customers