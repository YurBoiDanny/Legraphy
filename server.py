import os
from flask import Flask, render_template, url_for, redirect, flash, request
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = set(['csv','json'])

app = Flask(__name__) #'__name__'= __main__ this is that flask knows where to look for static, template, etc. files
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.',1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/")
def hello():
    return "<h1>Hello World!</h1>"

@app.route("/d3Test")
def about():
    return render_template("forceDirectedGraph.html")

@app.route("/Examples/mobilePatentSuits")
def example():
    return render_template("mobilePatentSuits.html")

@app.route("/Examples/SidebarTutorial/StaticSidebar1")
def leftSidebar():
    return render_template("sidebarTemplates/staticSidebar1.html")

@app.route("/Examples/Icons")
def icons1():
    return render_template("floatingIconsTemplates/floatingIconTutorial.html")

@app.route("/Examples/botNavBar")
def botNavBar():
    return render_template("botNavBar/botNavBar.html")

@app.route("/Examples/rightSideNavBar")
def rightSidebar():
    return render_template("sidebarTemplates/staticRightSidebar.html")

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

if __name__ == "__main__":
    app.run(debug = True)