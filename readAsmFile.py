import csv
import glob

#filepath = '/Users/dannyg/Desktop/Legraphy/uploads/snake.asm'
listOfFiles = glob.glob('/Users/dannyg/Desktop/Legraphy/uploads/*.asm')
functionsCallCmds = {"call", "jmp", "je", "jne"}
resDict = {"source":{}, "target":{}}
source = [];
target = [];

for filename in listOfFiles:
    with open(filename) as fp:
        line = fp.readline()
        cnt = 1
        lineWrd = 1
        parentFunction = ""
        while line:
            #print("Line {}: {}".format(cnt, line.strip()))
            line = fp.readline()
            lenOfCurrStr = len(line.split())
            if lenOfCurrStr >= 1:
                    firstWrd = line.split()[0];
                    #print(firstWrd[0])
                    if firstWrd[0] == "@":
                        #print ("SUB-function:", line.split()[0],"at line:", cnt)
                        if parentFunction != "":
                            source.append(parentFunction)
                            target.append(line.split()[0])
                        else:
                            target.append(line.split()[0])
                            source.append("")
                    elif firstWrd in functionsCallCmds :
                        #print ("function:", line.split()[1],"at line:", cnt) 
                        if parentFunction != "":
                            source.append(parentFunction)
                            target.append(line.split()[1])
                        else:
                            target.append(line.split()[1])
                            source.append("")
                    elif lenOfCurrStr >= 2:
                        #print(line.split())
                        if line.split()[1] == "proc":
                            #print ("Start of function:",line.split()[0],"at line:",cnt)
                            parentFunction = line.split()[0]
                        elif line.split()[1] == "endp":
                            #print ("End of function:",line.split()[0],"at line:",cnt)
                            parentFunction = ""
                    #print(line.split()[1])
            cnt += 1
print("Finished Reading Files")

resDict["source"] = source
resDict["target"] = target
# print(len(source))
# print(len(target))  
# print(source)
# print(target)    
print(resDict)
data = resDict
# csv_columns = []
# for name, val in data.items():
#     csv_columns.append(name);
#     print(name)
try:
    with open('/Users/dannyg/Desktop/Legraphy/uploads/test.csv', 'w' ) as csvfile:
        #writer = csv.DictWriter(csvfile, fieldnames=csv_columns)
        writer = csv.writer(csvfile)
        row = ['source', 'target']
        writer.writerow(row);
        for i in range(len(resDict["source"])):
            row = [source[i],target[i]]
            print(row)
            writer.writerow(row)
except IOError:
    print("I/O error")