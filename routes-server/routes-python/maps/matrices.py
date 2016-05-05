# -*- coding: utf-8 -*-
import maps.apikey as api
import googlemaps
import math
import numpy as np
import os.path
import time

def get_matrices(coords):

    gmaps = googlemaps.Client(key=api.key)
    
    coords = np.array(coords)    
    
    coords_len = coords.size
    cust_sections = math.floor(coords_len / 10)
    cust_remain = coords.size % 10
    
    time_matrix = np.empty((coords_len, coords_len))
    distance_matrix = np.empty((coords_len, coords_len))
    
    for i in range(cust_sections):
        first_section = coords[i*10:i*10 + 10]
        for j in range(cust_sections):
            second_section = coords[j*10:j*10 + 10]
            
            res = gmaps.distance_matrix(first_section, second_section)
            
            for row, dict in enumerate(res['rows']):
                for column, element in enumerate(dict['elements']):
                    time_matrix[10 * i + row, 10 * j + column] = element['duration']['value']
                    distance_matrix[10 * i + row, 10 * j + column] = element['distance']['value']
    
            time.sleep(10)
        
    if cust_remain > 0:
        last_element = coords_len - cust_remain
        coords_remain = coords[last_element:]
        
        # Horizontal
        for i in range(cust_sections):
            coords_section = coords[i:i + 10]
            
            res = gmaps.distance_matrix(coords_section, coords_remain)
            
            for row, dict in enumerate(res['rows']):
                for column, element in enumerate(dict['elements']):
                    time_matrix[10 * i + row, last_element + column] = element['duration']['value']
                    distance_matrix[10 * i + row, last_element + column] = element['distance']['value']

            time.sleep(10)
            
        # Vertical
        for i in range(cust_sections):
            coords_section = coords[i:i + 10]
            
            res = gmaps.distance_matrix(coords_remain, coords_section)
            
            for row, dict in enumerate(res['rows']):
                for column, element in enumerate(dict['elements']):
                    time_matrix[last_element + row, 10 * i + column] = element['duration']['value']
                    distance_matrix[last_element + row, 10 * i + column] = element['distance']['value']

            time.sleep(10)
        
        res = gmaps.distance_matrix(coords_remain, coords_remain)
        
        for row, dict in enumerate(res['rows']):
            for column, element in enumerate(dict['elements']):
                time_matrix[last_element + row, last_element + column] = element['duration']['value']
                distance_matrix[last_element + row, last_element + column] = element['distance']['value']
        
    return [time_matrix, distance_matrix]