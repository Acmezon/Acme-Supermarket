# -*- coding: utf-8 -*-
import numpy as np

class TSP_Graph:
    def __init__(self, n_customers):
        self.matrix = np.empty((n_customers, n_customers))
        
    def set_ids(self, customer_ids):
        self.customer_ids = customer_ids
    
    def get_value(self, i, j):
        return self.matrix[i, j]
        
    def set_value(self, i, j, time):
        self.matrix[i, j] = time
    
    def get_matrix(self):
        return self.matrix
    
    def set_matrix(self, matrix):
        if not isinstance(matrix, np.ndarray):
            matrix = np.array(matrix)            
            
        if matrix.shape != self.matrix.shape:
            raise ValueError("The input matrix shape is not equal to the \
                                graph's matrix shape. Original shape: {0}. \
                                New shape: {1}"
                                .format(self.matrix.shape,
                                        matrix.shape))
                                        
        self.matrix = matrix
        
    def get_customer_index(self, customer_id):
        if self.customer_ids is None:
            raise NameError("customer_ids vector not setted yet")
        
        customer_index = np.where(self.customer_ids == customer_id)[0]
        
        if not customer_index.size:
            raise KeyError("Customer Id does not exists")
        
        return customer_index[0]
        
    def get_customer_id(self, customer_row):
        if self.customer_ids is None:
            raise NameError("customer_ids vector not setted yet")
        
        return self.customer_ids[customer_row]