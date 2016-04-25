# -*-coding:utf-8-*-

import numpy as np
from pymongo import MongoClient
import tables
import sys
import time

def connect():
    connection = MongoClient()
    return connection


def disconnect(connection):
    connection.close()


def compute_ratings_matrix(ratings_matrix_file):
    """
    Computes the rating matrix
        Input:
            ratings_matrix_file: Filename output rating matrix
    """

    connection = connect()
    db = connection['Acme-Supermarket']

    matrix_file = ratings_matrix_file
    hdf5_matrix = tables.openFile(matrix_file, mode='w')

    filters = tables.Filters(complevel=5, complib='blosc')

    products = db.products.find({}, {'_id': 1})
    products = [p['_id'] for p in products]
    products = np.concatenate((np.array([-1]), products))
    products_count = db.products.count()

    customers = db.actors.find({'_type': 'Customer'}, {'_id': 1})
    customers = [c['_id'] for c in customers]
    customers_count = db.actors.count({'_type': 'Customer'})

    data_storage = hdf5_matrix.createEArray(
        hdf5_matrix.root, 'data',
        tables.UInt32Atom(),
        shape=(0, products_count + 1),
        filters=filters,
        expectedrows=customers_count)

    data_storage.append(products[:][None])
    for customer_id in customers:
        # Each column 0: Customer IDs
        # Product ratings in columns 1+
        row = np.zeros((products_count + 1,))

        row[0] = customer_id
        ratings = db.rates.find({'customer_id': customer_id},
                                {'product_id': 1, 'value': 1})

        for rating in ratings:
            row[np.where(products == rating['product_id'])[0][0]] = rating[
                'value']

        data_storage.append(row[:][None])

    hdf5_matrix.close()
    disconnect(connection)

    return matrix_file