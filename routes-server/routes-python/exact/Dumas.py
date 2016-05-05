from operator import attrgetter
from exact.Solution import Solution
from exact.read_file import lopez_ibanez_blum_format

class Dumas(object):
	"""Problem implementation"""

	def __init__(self, graph):
		"""The Dumas implementation takes a graph"""
		self.graph = graph

	def __repr__(self):
		"""Return a string representation of this object that can
		be evaluated as a Python expression."""
		n_vertices = len(self.graph.vertices())
		n_edges = len(self.graph.edges())
		print_this = "N_vertices: " + str(n_vertices) + ". E_edges: " + str(n_edges)
		return 'Dumas(%s)' % print_this

	__str__=__repr__
	"""The str and repr forms of this object are the same."""

	def run(self):
		"""
		Run method initializes the problem instances and gives the first recursive call.
		Returns
		--------
		solution : Final solution (object)
		"""
		S = list(self.graph.vertices())
		end_depot = self.graph.end
		solution = self.f(S, end_depot)
		solution = self.join_solution(solution, end_depot)
		return solution

	def f(self, S, j):
		"""
		Dumas exact algorithm for the TSPTW
		Literature: http://pubsonline.informs.org/doi/pdf/10.1287/opre.43.2.367

		Parameters
		--------
			S: Subset of unvisited nodes of the solution
			j: Final node of path. Contained in S.
		Returns
		--------
			End time t of a path starting at depot node, 
			passing through every node in S exactly once, 
			ending at node j (contained in S).
		"""

		if len(S)==2:
			return self.base_case(S, j)
		else:
			s = list(S)
			s.remove(j)
			feasible_solutions = []
			for i in s:
				
				if i!=self.graph.start:
					
					solution = self.f(s, i)
					if solution is None:
						# if None then no solutions feasibles
						continue

					new_solution = self.join_solution(solution, i)	

					if new_solution.is_feasible():
						feasible_solutions.append(new_solution)
			return self.choose_sol(feasible_solutions)

	def choose_sol(self, solutions):
		"""
		Choose the least cost solution in the feasible solutions list.
		In case the feasible solutions is empty, returns None
		Parameters
		--------
			solutions: List of feasible solutions
		Returns
		--------
			solution Solution (object)
		"""
		if len(solutions)==0:
			# No feasible solutions
			return None
		else:
			# Returns the solution with minimum solution.cost
			return min(solutions, key=attrgetter('cost'))

	def join_solution(self, solution, vertex):
		"""
		Base case.
			f({1,j}, j) = tj      if (1,j) in E (edges)
			f({1,j}, j) = Inf     otherwise
		
		Returns new t_j
		t_j = max {a_1 + s_1 + t_ij, a_j}
		where
		a_j <= t_j <= b_j
		"""
		t_i = solution.last_time()
		t_ij = self.graph.time_edge(solution.last_vertex(), vertex)
		a_j = vertex.time_window[0]
		t_j = max([t_i + t_ij, a_j])
		solution.add_vertex(vertex, t_j)
		return solution

	def base_case(self, S, j):
		"""Create new solution"""
		solution = Solution(self.graph, self.graph.start)
		return solution