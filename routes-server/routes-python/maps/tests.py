# -*- coding: utf-8 -*-
import numpy as np
import os.path

from matrices import get_matrices
from acme_database import get_customers

def test_generate_matrix(ids):
	customers = get_customers(ids)
	customers_coords = [coords.replace(b';', b',').decode('utf-8') for coords in customers['c']]

	path = 'matrices{0}.npy'.format(len(ids) - 1)
	if not os.path.isfile(path):
		data = get_matrices(customers_coords)
		np.save(path, data)

if __name__=='__main__':
	N_values = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
	for n in N_values:
		if n == 5:
			ids = [0, 3, 7, 14, 18, 5]
		elif n == 6:
			ids = [0, 3, 7, 14, 18, 5, 15]
		elif n == 7:
			ids = [0, 3, 7, 14, 18, 5, 15, 19]
		elif n == 8:
			ids = [0, 3, 7, 14, 18, 5, 11, 15, 19]
		elif n == 9:
			ids = [0, 3, 7, 14, 18, 5, 11, 15, 19, 1]
		elif n == 10:
			ids = [0, 3, 7, 14, 18, 31, 5, 11, 15, 19, 1]
		elif n == 11:
			ids = [0, 3, 7, 14, 18, 31, 5, 11, 15, 19, 1, 2]
		elif n == 12:
			ids = [0, 3, 7, 14, 18, 31, 5, 11, 15, 19, 1, 2, 6]
		elif n == 13:
			ids = [0, 3, 7, 14, 18, 31, 5, 11, 15, 19, 1, 2, 6, 10]
		elif n == 14:
			ids = [0, 3, 7, 14, 18, 31, 5, 11, 15, 19, 1, 2, 6, 10, 12]
		elif n == 15:
			ids = [0, 3, 7, 14, 18, 31, 5, 11, 15, 19, 1, 2, 6, 10, 12, 25]
		test_generate_matrix(ids)