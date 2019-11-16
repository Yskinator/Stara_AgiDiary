"""Example Flask project template."""

from flask import Flask, request, render_template, url_for, redirect
import flask_login
from login import login_app

app = Flask(__name__)
app.secret_key = 'verysecret'

login_manager = flask_login.LoginManager()
login_manager.init_app(app)

users = {'admin': {'password': 'admin'}}

class User(flask_login.UserMixin):
    pass

# http://0.0.0.0:80/api/v1.1?deg=13.0
@app.route('/')
def main():
    """Handle main path."""
    return render_template("index.html")

@app.route('/3D/')
def threedee():
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
    return redirect(url_for('main')

@app.route('/logout')
def logout():
    flask_login.logout_user()
    return redirect(url_for('main')

if __name__ == '__main__':
     app.run(host='0.0.0.0', port=5000)
