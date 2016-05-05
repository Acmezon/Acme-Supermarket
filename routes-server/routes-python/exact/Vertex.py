class Vertex(object):
	"""A Vertex is a node in a graph."""

	def __init__(self, label='', time_window = (0.0, 0.0)):
		self.label = label
		self.time_window = time_window

	def __repr__(self):
		"""Returns a string representation of this object that can
		be evaluated as a Python expression."""
		print_this = repr(self.label)
		return 'Vertex(%s)' % print_this

	__str__ = __repr__
	"""The str and repr forms of this object are the same."""