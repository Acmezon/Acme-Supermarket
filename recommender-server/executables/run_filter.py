import argparse
import numpy as np
import preprocessing.acmesupermarket as acmesupermarket
import items
from pymongo import MongoClient
import time

def run(operation, user_id):
    if operation=='pre':
        items.compute_similarity('executables/files/ratings_matrix_acme-supermarket.hdf5', 'files/similarity_matrix_acme-supermarket.hdf5')
    else:
        acmesupermarket.compute_ratings_matrix('executables/files/ratings_matrix_acme-supermarket.hdf5')
        
        estimated_ratings = np.array(items.run('executables/files/ratings_matrix_acme-supermarket.hdf5', 'executables/files/similarity_matrix_acme-supermarket.hdf5', 1), dtype=[('r', 'f4'), ('p', 'i4')])
        estimated_ratings = estimated_ratings[np.argsort(estimated_ratings, order=('r', 'p'))[::-1]]
        
        connection = MongoClient()
        db = connection['Acme-Supermarket-Recommendations']
        for rating, product in estimated_ratings[:10]:
            db.recommendations_rates.insert_one({
                "customer_id": user_id,
                "product_id": product.item(),
                "rating": rating.item()
            })
        
			

if __name__=="__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("-o", "--operation", required = True, choices=['pre', 'run'], help = "Operation to run: pre / run")
    ap.add_argument("-u", "--userid", required = True, help = "User ID")
    args = vars(ap.parse_args())
    run(args['operation'], int(args['userid']))