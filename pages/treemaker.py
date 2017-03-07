import json
from pages_thalys_short import list_of_pages

for index, page in enumerate(list_of_pages) :
	list_of_pages[index] = page.split('/')

class Node(object):

	def __init__(self, name, url=None, children=None):
		if children != None and children.isArray() == False :
			raise AssertionError
		self.name = name
		self.url = url
		self.children = children

	def __str__(self):
		if self.count():
			return '<Node : {} · {}>'.format(self.name, self.count())
		else :
			return '<Node: {}>'.format(self.name)


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

def branchify(pages):

	nodeset = set()

	for page in pages :
		nodeset.add(page[0])

	new_nodes = []

	for node in nodeset :
		new_nodes.append(Node(name=node))

	for node in new_nodes :

		if node.name == '/' :
			node.children = False
			node.url = node.name
		else :
			node.children = []
			for page in pages :
				if page[0] and page[0] == node.name :
					if len(page) == 1 :
						node.children.append('/') # no children nodes
					else :
						node.children.append(page[1:]) # a list of children nodes, with root node sliced out
			if len(node.children) > 1 :
				node.children = branchify(node.children)

	return new_nodes

#print(list_of_pages)

list_of_pages = branchify(list_of_pages)

def export_to_file() :
	text_file = open("tree.js", "w")
	text_file.write(
		"window.tree = " + 
		json.dumps(list_of_pages, ensure_ascii=False)
		)
	text_file.close()


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
		print(node)
#		print('{}{} {}'.format(tabulation, node.name, node.count()))
#		if node.children :
#			print_tree(node.children, tabulation=tabulation+'----')

print_tree(list_of_pages)