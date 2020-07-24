import csv


def createCsvFileExport(fileLocation, data):
    csv_columns = ["source", "target", "edge"]
    # for name, val in len(data[0].items():
    #     csv_columns.append(name)
    try:
        with open(fileLocation, 'w') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=csv_columns)
            writer.writeheader()
            # for vals in data:
            #     writer.writerow(vals)
            for x in range(len(data)):
                source = ""
                target = ""
                edge = ""
                for y in range(2):
                    #Get Source and Target Names
                    source = data[x]["source"]["name"]
                    target = data[x]["target"]["name"]
                edge = data[x]["edge"]  # Get Edge Name
                #print("source",source," target",target," edge", edge)
                writer.writerow(
                    {'source': source, 'target': target, 'edge': edge})
    except IOError:
        print("I/O error")
