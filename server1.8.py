import os
from utilScripts import createCsvFileExport
from flask import Flask, render_template, url_for, redirect, flash, request, send_from_directory, jsonify,json
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = 'uploads'
EXPORT_FOLDER = 'exports'
app = Flask(__name__) #'__name__'= __main__ this is that flask knows where to look for static, template, etc. files
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['EXPORT_FOLDER'] = EXPORT_FOLDER

@app.route("/")
@app.route("/mainPage")
def mainPage():
    return render_template("mainPageTemplates/mainPageV1.8.html")

@app.route("/upload", methods=['GET', 'POST'])
def upload():
    if request.method == "POST":
        print("Upload post request called")
        if request.files:
            file = request.files['file']
            file.save(os.path.join(app.config["UPLOAD_FOLDER"],secure_filename(file.filename)))
            print("file saved")
            return redirect(request.url)
        else:
            print('No Files Uploaded to Server!')
    return render_template("upload/upload.html")


@app.route("/uploads/<path:path>")
def send_file(path):
        #print('uploads', path)
        return send_from_directory('uploads',path)

@app.route("/development")
def contextMenu():
    return render_template("development/addRemoveNodesAndEdges2.html")

@app.route("/mainPage(2)")
def mainPage2():
    return render_template("mainPageTemplates/mainPageV1.3(2).html")

@app.route("/mainPage(3)")
def mainPage3():
    return render_template("mainPageTemplates/mainPageV1.3.html")

@app.route("/createCsvExport", methods=['POST'])
def createCSV():
    if request.method == 'POST':
        print("Create CSV post request called!")
        data = request.get_json()
        data = data["allData"]
        print(type(data));
        print(data);

        if (len(data[0]) == 0):
            print("NO NODES TO EXPORT!")
        else:    
            createCsvFileExport(app.config['EXPORT_FOLDER']+"/currentNodes.csv",data[0]);
            if (len(data[1]) == 0):
                print("THERE ARE NO LINKS TO THE NODES!")
            else:
                createCsvFileExport(app.config['EXPORT_FOLDER']+"/currentLinks.csv",data[1]);
        # print(nodes)
        # print(links)
        return "good"

if __name__ == "__main__":
    app.run(debug = True)