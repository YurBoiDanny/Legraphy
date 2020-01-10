import csv

dict_data =         [
            {'name': 'A1', 'y': 480.64377572297064, 'x': 861.5194919102235, 'index': 0, 'vy': -0.5197590779070472, 'vx': 0.9793141187257082
            },
            {'name': 'A2', 'y': 538.6682346958655, 'x': 919.5373361364342, 'index': 1, 'vy': -0.493281593529113, 'vx': 1.003598712519397
            },
            {'name': 'A3', 'y': 494.2319071082206, 'x': 875.0859840050026, 'index': 2, 'vy': -0.4884072383542886, 'vx': 1.0034865926192276
            },
            {'name': 'A4', 'y': 507.231306130595, 'x': 888.1040822894852, 'index': 3, 'vy': -0.47234305452117026, 'vx': 1.0257654857792378
            },
            {'name': 'A5', 'y': 576.8091914104041, 'x': 957.6782248605582, 'index': 4, 'vy': -0.5792468471903127, 'vx': 0.9176119771516307
            },
            {'name': 'A6', 'y': 642.6915076342368, 'x': 1023.5605030592491, 'index': 5, 'vy': -1.4209735955593754, 'vx': 0.0758726239408487
            },
            {'name': 'A7', 'y': 683.1512264938683, 'x': 1064.0202140477836, 'index': 6, 'vy': -1.4939458804605694, 'vx': 0.0028975454098582707
            },
            {'name': 'A8', 'y': 614.3498897765122, 'x': 995.218887733997, 'index': 7, 'vy': -0.71246488636505, 'vx': 0.784381915085102
            }
        ]

csv_columns = []
for name, data in dict_data[0].items():
    csv_columns.append(name);
    #print (name)
csv_file = "Names.csv"
try:
    with open(csv_file, 'w') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=csv_columns)
        writer.writeheader()
        for data in dict_data:
            writer.writerow(data)
except IOError:
    print("I/O error")

