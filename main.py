"""Example Flask project template."""

from flask import Flask, jsonify, request, render_template, url_for, redirect
import flask_login
import db_handler
import random
import string
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'verysecret'

login_manager = flask_login.LoginManager()
login_manager.init_app(app)

users = {'admin': {'password': 'admin'}}

class User(flask_login.UserMixin):
    pass

# http://0.0.0.0:80/api/v1.1?deg=13.0
@app.route('/', methods=['GET', 'POST'])
def main():
    """Handle main path."""
    return render_template("index.html")

@app.route('/3D/')
def disploy_3D():
    return render_template("3D.html")

@login_manager.user_loader
def user_loader(name):
    if name not in users:
        return

    user = User()
    user.id = name
    return user

@login_manager.request_loader
def request_loader(request):
    name = request.form.get('username')
    if name not in users:
        return

    user = User()
    user.id = name

    user.is_authenticated = True

    return user

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return '''
                   <form action='login' method='POST'>
                    <input type='text' name='username' id='username' placeholder='username'/>
                    <input type='password' name='password' id='password' placeholder='password'/>
                    <input type='submit' name='submit'/>
                   </form>
                   '''

    name = request.form['username']

    user = User()
    user.id = name
    flask_login.login_user(user)
    return redirect(url_for('main'))

@app.route('/logout')
def logout():
    flask_login.logout_user()
    return redirect(url_for('main'))

#@app.route('/project/', methods=["post"])
def create_project():
    j = request.get_json()
    project_id = j["project_id"]
    address = j["address"]
    letters = string.ascii_lowercase
    project_url = ''.join(random.choice(letters) for i in range(20))
    db_handler.create_project(project_id, address, project_url)
    return jsonify(success=True)

#@app.route('/project/id/<project_id>/')
def find_project(project_id):
    url = db_handler.find_project_url(project_id)
    return redirect('/project/'+url)

#@app.route('/project/<project_url>', methods=["get"])
def fetch_project(project_url):
    p = db_handler.fetch_project(project_url)
    return jsonify(p)

#@app.route('/project/<project_url>/post', methods=["post"])
def create_post(project_url):
    j = request.get_json()
    links = j["links"]
    images = j["images"]
    project_id = j["project_id"]
    text = j["text"]
    timestamp = int(datetime.now().timestamp())
    user_id = j["user_id"]
    db_handler.create_post(links, images, project_id, text, timestamp, user_id)
    return jsonify(success=True)

#@app.route('/create_user/', methods=["post"])
def create_user():
    j = request.get_json()
    name = j["name"]
    db_handler.create_user(name)
    return jsonify(success=True)

#@app.route('/init/')
def init():
    db_handler.create_tables()

if __name__ == '__main__':
     app.run(host='0.0.0.0', port=5000)
