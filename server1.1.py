import os
from flask import Flask, render_template, url_for, redirect, flash, request
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = 'uploads'
app = Flask(__name__) #'__name__'= __main__ this is that flask knows where to look for static, template, etc. files
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route("/")
@app.route("/mainPage")
def mainPage():
    return render_template("mainPageTemplates/mainPageV1.1.html")

@app.route("/upload", methods=['GET', 'POST'])
def upload():
    if request.method == "POST":
        print("post request called")
        if request.files:
            file = request.files['file']
            file.save(os.path.join(app.config["UPLOAD_FOLDER"],secure_filename(file.filename)))
            print("file saved")
            return redirect(request.url)
        else:
            print('No Files Uploaded to Server!')
    return render_template("upload/upload.html")

@app.route("/newSidebar")
def newSidebar():
    return render_template("sidebar/newSidebar.html")

if __name__ == "__main__":
    app.run(debug = True)