"""Example Flask project template."""

from flask import Flask, request

app = Flask(__name__)

# http://127.0.0.1:5000/api/v1.1?deg=13.0
@app.route('/api/<path>', methods=["post", "get"])
def main(path):
    """Handle main path."""
    if path == "v1.1":
        deg = request.args.get('deg', default=0.0, type=float)
        print(deg)
        return str(deg)
    return "Try /api/v1.1 instead."

if __name__ == '__main__':
    app.run()
