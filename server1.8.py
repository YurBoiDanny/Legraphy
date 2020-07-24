import os
import glob
from utilScripts import createCsvFileExport
from flask import Flask, render_template, url_for, redirect, flash, request, send_from_directory, jsonify, json, Response
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = 'uploads'
EXPORT_FOLDER = 'exports'
# '__name__'= __main__ this is that flask knows where to look for static, template, etc. files
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['EXPORT_FOLDER'] = EXPORT_FOLDER

@app.route("/test")
def test():

    flash("this is a message")
    return render_template("mainPageTemplates/test.html")

@app.route("/")
@app.route("/mainPage")
def mainPage():
    return render_template("mainPageTemplates/mainPageV1.8.html")


@app.route("/mainPageFresh")
def mainPageFresh():
    files = glob.glob(app.config['UPLOAD_FOLDER']+"/*")
    for f in files:
        os.remove(f)
    return render_template("mainPageTemplates/mainPageV1.8.html")


@app.route("/upload", methods=['GET', 'POST'])
def upload():
    if request.method == "POST":

        files = glob.glob(app.config['UPLOAD_FOLDER']+"/*")
        for f in files:
            os.remove(f)

        if request.files:
            file = request.files['file']
            originalFile = file.filename
            file.filename = "currentGraph.csv"
            file.save(os.path.join(
                app.config["UPLOAD_FOLDER"], secure_filename(file.filename)))
            print("file saved, filename = ", file.filename)
            #return redirect(request.url)
            return redirect("/mainPage")
        else:
            print('No Files Uploaded to Server!')
    return render_template("upload/upload.html")


@app.route("/uploads/<path:path>")
def send_file(path):
    #print('uploads', path)
    return send_from_directory('uploads', path)


@app.route("/downloadExport", methods=['GET'])
def downloadExport():
    filename = os.path.join(app.config['EXPORT_FOLDER'], "currentLinks.csv")
    print(filename)
    #return  send_file(filename, mimetype='text/csv',attachment_filename='exportOfGraphParameters.csv', as_attachment=True)
    return send_from_directory(directory=app.config['EXPORT_FOLDER'], filename="currentLinks.csv", as_attachment=True)


@app.route("/createCsvExport", methods=['POST'])
def createCSV():
    if request.method == 'POST':
        print("Create CSV post request called!")

        inputDict = request.get_json()
        data = inputDict["glinks"]
        print(type(data))
        print(data[0])

        if not bool(data):  # If the dictionary is empty
            print("NO DATA TO EXPORT!")
        else:
            createCsvFileExport(
                app.config['EXPORT_FOLDER']+"/currentLinks.csv", data)
        # print(nodes)
        # print(links)
        return "good"


if __name__ == "__main__":
    app.run(debug=True)
