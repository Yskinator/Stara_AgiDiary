"""Example Flask project template."""

from flask import Flask, request, render_template

app = Flask(__name__)

# http://0.0.0.0:80/api/v1.1?deg=13.0
@app.route('/')
def main():
    """Handle main path."""
    return render_template("index.html")

@app.route('/3D/')
def threedee():
    return render_template("3D.html")

if __name__ == '__main__':
     app.run(host='0.0.0.0', port=5000)
