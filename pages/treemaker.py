import json
from pages_thalys import list_of_pages

for index, page in enumerate(list_of_pages) :
	list_of_pages[index] = page.split('/')

class Node(object):

	def __init__(self, name, url=None, children=None, adress=''):
		self.name = name
		self.url = url
		self.children = children
		self.adress = adress

	@property
	def children(self):
		return self._children

	@children.setter
	def children(self, x):
		if x != None and type(x) != list :
			raise Exception("Node children must be 'None' or List, not {}.".format(type(x)))
		self._children = x

	def __str__(self):
		string = '<Node : {}'.format(self.name)
		if self.url: string += ' · url("{}")'.format(self.url)
		if self.count(): string += ' · {}'.format(self.count())
		if self.children: string += ' · hasChildren'
		string += '>'
		return string

	def tree(self, tabulation=''):
		string = tabulation + '<Node : {}'.format(self.name)
		if self.url: string += ' · "{}{}"'.format(self.adress, self.url)
		if self.count(): string += ' · {}'.format(self.count())
		string += '>'
		if self.children:
			string += '\n'
			for node in self.children :
				string += node.tree(tabulation=tabulation+'    ')
		return string

	def json_tree(self):
		string = "{"
		string += "'name': '{}'".format(self.name)
		if self.url: string += ", 'adress': '{}{}'".format(self.adress, self.url)
		if self.count(): string += ", 'count': {}".format(self.count())
		if self.children:
			string += ", 'children': ["
			for node in self.children[:-1] :
				string += node.json_tree() + ','
			string += self.children[-1].json_tree()
			string += ']'
		string += '}'
		return string

	def __repr__(self):
		return str(self)

	def __hash__(self): return hash(id(self))
	def __eq__(self, x): return x is self
	def __ne__(self, x): return x is not self

	def count(self):
		if self.children :
			return len(self.children)
		else :
			return None


def say(something):
	print(something)
	print()

def branchify(pages, adress=''):

	nodeset = set()

	for page in pages :
		nodeset.add(page[0])

	new_nodes = []

	for node in nodeset :
		new_nodes.append(Node(name=node, adress=adress+'/'+node))

	for node in new_nodes :

		if node.name == '/' :
			node.children = None
			node.url = node.name
		else :
			node.children = []
			for page in pages :
				if page[0] and page[0] == node.name :
					if len(page) == 1 :
						node.url = '/' # no children nodes
					else :
						node.children.append(page[1:]) # a list of children nodes, with root node sliced out
			if len(node.children) > 0 :
				node.children = branchify(node.children, adress=node.adress)

	return new_nodes

#print(list_of_pages)

list_of_pages = branchify(list_of_pages)

def export_to_file(tree) :
	text_file = open("tree.js", "w")
	text_file.write("window.tree = " + tree)
	text_file.close()

export_to_file(list_of_pages[0].json_tree())

print(list_of_pages[0].json_tree())

#def count_pages(nodes) :
#	for node in nodes :
#		number = 0
#		if 'pages' in node :
#			for page in node['pages'] :
#				if page['name'] == '/' :
#					number += 1
#				else :
#					page['pages'] = count_pages(page['pages'])
#		node['count'] = number
#	return nodes

#say(list_of_pages)

def node_count(node):
	if 'count' in node :
		return '(' + str(node['count']) + ')'
	else :
		return ''

def print_tree(nodes, tabulation='') :
	for node in nodes :
#		print('Type : ', type(node))
#		print('Children : ', node.children)
		print()
		print(node.json_tree())
#		if node.children :
#			print_tree(node.children, tabulation=tabulation+'----')

#print_tree(list_of_pages)