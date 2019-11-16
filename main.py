"""Example Flask project template."""

from flask import Flask, request, render_template

app = Flask(__name__)

# http://0.0.0.0:80/api/v1.1?deg=13.0
@app.route('/api/<path>', methods=["post", "get"])
def main(path):
    """Handle main path."""
    if path == "v1.1":
        deg = request.args.get('deg', default=0.0, type=float)
        print(deg)
        #return str(deg)
        return render_template("index.html")
    return "Try /api/v1.1 instead."

@app.route("/")
def hello():
    return "Hello Docker World!"

if __name__ == '__main__':
     app.run(host='0.0.0.0', port=80)
