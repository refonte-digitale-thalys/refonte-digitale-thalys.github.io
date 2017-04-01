from pages_thalys import list_of_pages
import requests

result = ""

number_of_pages = len(list_of_pages)
print("Beggining status check...")
for page_number, page_url in enumerate(list_of_pages) :
	status = str(requests.get(page_url).status_code)
	result += status + "\n"
	percentage = format((page_number/number_of_pages)*100, '.2f')
	print("Page {}/{} ({}%) - Status : {} ".format(page_number, number_of_pages, percentage, status), end='\r')

def export_to_file(text) :
	text_file = open("status_codes.txt", "w")
	text_file.write(text)
	text_file.close()

export_to_file(result)