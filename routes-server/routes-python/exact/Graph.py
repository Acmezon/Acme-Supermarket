from exact.Edge import Edge

class Graph(object):
    """
    A Graph is a dictionary of dictionaries.  The outer
    dictionary maps from a vertex to an inner dictionary.
    The inner dictionary maps from other vertices to edges.
    
    For vertices a and b, graph[a][b] maps
    to the edge that connects a->b, if it exists.
    (Directed graph implementation)
    """

    def __init__(self, start, end, vertices=[], edges=[]):
        """Creates a new graph.
        Vertices are a list of vertex type.
        Depot is a depot vertice. Vehicle starts and ends there. 
        Start and end depot contained in Vertices and its edges contained in edges
        """
        self.map = {}
        self.start = start
        self.end = end

        for v in vertices:
            self.add_vertex(v)

        for e in edges:
            self.add_edge(e)

        self.remove_edge(self.start, self.end)
        self.remove_edge(self.end, self.start)
        

    def __str__(self):
        return dict.__str__(self.map)

    def __repr__(self):
        print_this = repr(self.map)
        return 'Graph(%s)' % print_this

    def add_vertex(self, v):
        """
        Add a vertex to the complete graph.
        Also maps the edges as a complete graph
        """

        keys = self.map.keys()
        self.map[v] = {}

        for key in keys:
            if key!=v:
                self.map[v][key] = Edge(v, key, float('Inf'))
                self.map[key][v] = Edge(key, v, float('Inf'))

    def add_edge(self, edge):
        """Adds an edge to the graph by adding an entry in both directions.
        If there is already an edge connecting these Vertices, the
        new edge replaces it.
        """
        self.map[edge.v1][edge.v2] = edge

    def remove_edge(self, v, w):
        """Removes (e) from the graph."""
        del self.map[v][w]

    def get_edge(self, v, w):
        """Returns the edge (v, w) if it exists, None otherwise.
        has_edge is a synonym for get_edge"""
        try:
            return self.map[v][w]
        except KeyError:
            return None

    has_edge = get_edge

    def vertices(self):
        """Returns a list of vertices in this graph."""
        return self.map.keys()

    def edges(self):
        """Returns a set of the edges in this graph."""
        s = []
        for keys in self.map:
            for keys2 in self.map[keys]:
                s.append(self.map[keys][keys2])
        return s

    def time_edge(self, v, w):
        """Returns the duration of an edge connecting vertives v and w."""
        edge = self.get_edge(v, w)
        if edge:
            return edge.time
        else:
            return float('Inf')
    cost_edge = time_edge