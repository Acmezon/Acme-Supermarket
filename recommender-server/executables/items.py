# -*-coding:utf-8-*-

import numpy as np
import tables
import os

import math


def run(ratings_matrix, similarity_matrix, user, N=5):
    """
    Gives a prediction for a product.

    Input:
            user: user to make the prediction for
            product: Product of prediction
            N: Neighbour distance.
            ratings_matrix : Ratings matrix. Ratings are numbers 1-5. Rows are
            users, columns are items.
            First element of each row is the User ID. First element of
            each column is the Product ID.

                            I1  I2  I3
                    A1  4   5   2

                    A2  3   1   4

                    A3  3   3   1
    """

    similarity_file = tables.open_file(similarity_matrix, mode='r')
    similarity = similarity_file.root.data
    ratings_matrix_file = tables.open_file(ratings_matrix, mode='r')
    ratings_matrix = ratings_matrix_file.root.data

    row_of_user = np.where(ratings_matrix[:, 0] == user)[0]
    
    if len(row_of_user) == 0:
        similarity_file.close()
        ratings_matrix_file.close()
        raise ValueError("Error: User not registered in the system")
    
    row_of_user = row_of_user[0]
    product_ids = np.array(similarity[0, 1:], dtype='i4')
    user_ratings = ratings_matrix[row_of_user, 1:]
    user_products_rated = product_ids[np.nonzero(user_ratings)]
    
    estimated_ratings = []
    
    for product in product_ids:
        column_of_product = np.where(ratings_matrix[0, :] == product)[0]
        column_of_product = column_of_product[0]

        if ratings_matrix[row_of_user, column_of_product] > 0:
             continue
        else:
            product_similarities = similarity[
                np.where(similarity[:, 0] == product)[0][0], :]

            similarities = np.fromiter(zip(product_similarities[1:], product_ids),
                                       dtype=[('s', 'f4'), ('p', 'i4')])                                 
                                       
            similarities = np.delete(similarities,
                                     np.where(similarities['p'] == product)[0][0])
            similarities = similarities[np.argsort(similarities,
                                                   order=('s', 'p'))[::-1]]
            similarities = similarities[np.in1d(similarities['p'],
                                                user_products_rated)]
                          
            similarities = similarities[:N]
            products_indices = [np.where(product_ids == p_id)[0][0] for p_id in similarities['p']]
            neigh_user_ratings = user_ratings[products_indices]

            numerator = np.sum(similarities['s'] * neigh_user_ratings)
            denominator = np.sum(similarities['s'])

            if denominator == 0:
                result = 0
            else:
                result = numerator / denominator
            
            estimated_ratings.append((result, product))

    similarity_file.close()
    ratings_matrix_file.close()

    return estimated_ratings


def compute_similarity(ratings_matrix_file, similarity_matrix_file):
    """
    Calculate similarity for all pairs of products.

    ratings_matrix : Ratings matrix. Ratings are numbers 1-5. Rows are users,
    columns are items.
    First element of each row is the User ID. First element of each column
    is the Product ID.

                    I1  I2  I3
            A1  4   5   2

            A2  3   1   4

            A3  3   3   1
    """

    ratings_matrix = tables.openFile(ratings_matrix_file, mode='r').root.data

    products = ratings_matrix.shape[1]

    similarity_file = tables.openFile(
        'tmp.hdf5', mode='w')
    filters = tables.Filters(complevel=5, complib='blosc')
    data_storage = similarity_file.createCArray(
        similarity_file.root, 'data',
        tables.Float64Atom(),
        shape=(products, products),
        filters=filters)

    data_storage[0, :] = ratings_matrix[0, :]   # IDs de productos
    data_storage[:, 0] = ratings_matrix[0, :]   # IDs de productos
    
    print(data_storage[0, :])
    print(ratings_matrix[0, :])

    for product1 in range(1, products):  # Se excluye la columna de IDs
        print("\n" + str(product1) + "/" + str(products))
        for product2 in range(product1,
                              products):    # Se excluye la columna de IDs
            print(str(product2) + "/" + str(products), end='\r')

            if product1 != product2:

                p1_ratings = ratings_matrix[1:, product1]
                p2_ratings = ratings_matrix[1:, product2]

                p1_rating_indices = np.nonzero(p1_ratings)[0]
                p2_rating_indices = np.nonzero(p2_ratings)[0]

                common_indices = np.intersect1d(p1_rating_indices,
                                                p2_rating_indices)

                if common_indices.size > 0:
                    means = np.fromiter(
                        (np.mean(x[np.nonzero(x)[0]])
                         for x in
                         ratings_matrix[common_indices + 1, 1:]),
                        dtype=np.float64
                    )

                    p1_ratings_values = p1_ratings[common_indices] - means
                    p2_ratings_values = p2_ratings[common_indices] - means

                    numerator = np.sum(
                        p1_ratings_values * p2_ratings_values)

                    p1_denominator = np.sqrt(
                        np.sum(np.power(p1_ratings_values, 2)))
                    p2_denominator = np.sqrt(
                        np.sum(np.power(p2_ratings_values, 2)))

                    similarity = numerator / \
                        (p1_denominator * p2_denominator)
                else:
                    similarity = 0.0
            else:
                similarity = 1.0
            
            if math.isnan(similarity):
                break
            data_storage[product1, product2] = similarity
            data_storage[product2, product1] = similarity

    ratings_matrix.close()
    similarity_file.close()
    
    if os.path.isfile(similarity_matrix_file):
        os.remove(similarity_matrix_file)
    
    os.rename('tmp.hdf5', similarity_matrix_file)