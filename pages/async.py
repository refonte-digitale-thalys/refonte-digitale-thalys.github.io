from pages_thalys import list_of_pages
import requests, asyncio

results = {}

number_of_pages = len(list_of_pages)

async def main():
	loop = asyncio.get_event_loop()
	for page_index, page_url in enumerate(list_of_pages) :
		results[page_index] = loop.run_in_executor(None, requests.get, page_url)
	for page_index, page_url in enumerate(list_of_pages) :
		request = await results[page_index]
		status = str(request.status_code)
		results[page_index] = [page_index, page_url, status]
		percentage = format((page_index/number_of_pages)*100, '.2f')
		print("Page {}/{} ({}%) - Status : {} ".format(page_index, number_of_pages, percentage, status), end='\r')	

print("Beggining status check...")
loop = asyncio.get_event_loop()
loop.run_until_complete(main())

printout = ""

for index in results :
	line = ""
	for item in results[index] :
		line += str(item) + ","
	printout += line + "\n"

def export_to_file(text) :
	text_file = open("status_codes.txt", "w")
	text_file.write(text)
	text_file.close()

export_to_file(printout)