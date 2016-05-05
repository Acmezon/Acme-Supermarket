# -*- coding: utf-8 -*-
import os
import numpy as np

from heuristic.Customer import Customer
from heuristic.Graph import TSP_Graph
from heuristic.TPH import TPH
from datetime import date, datetime, timedelta
from pymongo import MongoClient
from maps.acme_database import today_customers, today_purchases
from maps.matrices import get_matrices

def run_acmesupermarket(today_purchases, today_customers):
    client = MongoClient()
    db = client['Acme-Supermarket']
    
    customers_coords = [coords.replace(b';', b',').decode('utf-8') for coords in today_customers['c']]
    
    customers_ids = today_customers['id']

    today = datetime.utcnow().date()
    route = {
        'day' : today.day,
        'month': today.month,
        'year': today.year,
        'times': [None] * customers_ids.size
    }
    
    if len(today_customers):

        data = get_matrices(customers_coords)
        
        time_graph = TSP_Graph(customers_ids.size)
        time_graph.set_ids(customers_ids)
        time_graph.set_matrix(data[0])
        
        distance_graph = TSP_Graph(customers_ids.size)
        distance_graph.set_ids(customers_ids)
        distance_graph.set_matrix(data[1])
        
        customers_list = []
        for customer in today_customers:
            customer_obj = Customer(customer['id'], customer['ws'], customer['we'])
            customer_obj.set_row(distance_graph.get_customer_index(customer['id']))
            
            customers_list.append(customer_obj)
        
        searchingSolution = True
        deleted_customers = []
        while (searchingSolution):
            tph = TPH(20, 50, optimize='t')
            tph.set_customers_ids(customers_ids)
            tph.set_customers_list(customers_list)
            tph.set_distance_matrix(data[1])
            tph.set_time_matrix(data[0])
            
            best_sol = tph.run()

            if best_sol.is_valid():
                searchingSolution = False
            else:
                violated_customers = np.where(best_sol.get_valid_customers() == 0)[0]
                
                deleted_customer = best_sol.get_solution()[violated_customers[0]]
                to_delete = Customer(-1, 0, 0)
                to_delete.set_row(deleted_customer)

                deleted_customer = customers_list[customers_list.index(to_delete)]
                
                customers_ids = np.delete(customers_ids, np.where(customers_ids == deleted_customer.get_id())[0][0])
                customers_list.remove(deleted_customer)
                
                deleted_customers.append(deleted_customer)
                tomorrow = date.today() + timedelta(days=1)
                for purchase in today_purchases:
                    if purchase['customer_id']==deleted_customer.get_id():
                        result = db.purchases.update_one(
                            {"_id": purchase['_id']},
                            {"$set": {"deliveryDate": tomorrow}}
                        )

        route['customers'] = [int(id_) for id_ in best_sol.get_solution()]
        route['customers'][0] = -1
        route['customers'].append(-1)
        
        for i, customer in enumerate(best_sol.get_solution()):
            c = Customer(-1, 0, 0)
            c.set_row(customer)

            cust = best_sol.get_customers_list()[best_sol.get_customers_list().index(c)]
            route['times'][i] = cust.get_time_visited()
        route['times'].append(23*60*60)

        for i, s in enumerate(route['times']):
            hour = int(s/3600)
            minute = int((s-(hour*3600))/60)
            second = int(s-((hour*3600)+(minute*60)))
            t = datetime(today.year, today.month, today.day, 
                hour, minute, second)
            route['times'][i] = t

    else:
        route['customers'] = []
        route['times'] = []

    db.routes.insert_one(route)

if __name__=="__main__":
    run_acmesupermarket()