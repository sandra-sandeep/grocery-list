from flask import Flask, request

app = Flask(__name__)

recurring_list = []


@app.route("/members")
def members():
    return {"members": ["Member1", "Member2", "Member3"]}

@app.route("/api/add_recurring_item", methods=['POST'])
def add_recurring_item():
    recurring_list.append(request.get_json())
    return '', 204

@app.route("/api/remove_recurring_item", methods=['DELETE'])
def remove_recurring_item():
    item = request.get_json()
    recurring_list = [s for s in recurring_list if s != item]
    return '', 204

@app.route("/api/get_recurring_list", methods=['GET'])
def get_recurring_list():
    return recurring_list


if __name__ == "__main__":
    app.run(debug=True)