import csv

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