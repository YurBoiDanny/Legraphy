import csv

# def parseExportData(dataType):
#     #Declare Dictionary
#     res = [[]];

#     #Add first Row for the Colomn Titles
#     if dataType == "links":
#         # get the title for the first row

#     else dataType == "nodes":

#     return res


def createCsvFileExport(fileLocation, data):
    csv_columns = []
    for name, val in data[0].items():
        csv_columns.append(name);
    try:
        with open(fileLocation, 'w' ) as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=csv_columns)
            writer.writeheader()
            for vals in data:
                writer.writerow(vals)
    except IOError:
        print("I/O error")