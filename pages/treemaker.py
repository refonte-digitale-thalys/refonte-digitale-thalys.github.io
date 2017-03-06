from pages_thalys_short import list_of_pages

for index, page in enumerate(list_of_pages) :
    list_of_pages[index] = page.split('/')

def branchify(pages):

    nodes = set()
    for page in pages :
        nodes.add(page[0])

    new_pages = []

    for node in nodes :
        nodeName = node
        print(list_of_pages)
        nodePages = list(filter(lambda x: x[0] == nodeName, list_of_pages)) # make this into a function
        for page in nodePages :
            del page[0]
        if nodeName :
            new_pages.append({
                'name': nodeName,
                'pages': nodePages,
                })
        else :
            new_pages.append({
                'name': '/',
                })
    return new_pages

#print(list_of_pages)

list_of_pages = branchify(list_of_pages)

#for index, page in enumerate(list_of_pages) :
#    print(page)
#    list_of_pages[index]['pages'] = branchify(page['pages'])
