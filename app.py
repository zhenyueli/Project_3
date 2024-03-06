from flask import Flask, render_template, jsonify
from pymongo import MongoClient

app = Flask(__name__)

# Set your MongoDB URI here directly or retrieve it from environment variables
# Replace 'your_username', 'your_password', and 'your_database' with your actual credentials
mongo_uri = 'mongodb+srv://cancer:E8KvBWc3hTacvWPZ@cluster0.tui45c4.mongodb.net/'

# app.config["MONGO_URI"] = mongo_uri
mongo = MongoClient(mongo_uri)
# print(mongo.list_database_names())

# Define endpoint to render the HTML template
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/index2.html')
def index2():
    return render_template('index2.html')

@app.route('/index3.html')
def index3():
    return render_template('index3.html')

@app.route('/index4.html')
def index4():
    return render_template('index4.html')

# Define endpoint to fetch data from MongoDB and return as JSON

@app.route('/GAS')
def getGAS1():
    db = mongo["GAS"]
    data = db["Diesel"]
    documents = list(data.find({}, {'_id': 0}))  # Excludes the _id field
    return jsonify(documents)

@app.route('/GAS2')
def getGAS2():
    db = mongo["GAS"]
    data = db["Regular_gas"]
    documents = list(data.find({}, {'_id': 0}))  # Excludes the _id field
    return jsonify(documents)

@app.route('/GAS3')
def getGAS3():
    db = mongo["GAS"]
    data = db["Premium_gas"]
    documents = list(data.find({}, {'_id': 0}))  # Excludes the _id field
    return jsonify(documents)

@app.route('/GAS4')
def getGAS4():
    db = mongo["GAS"]
    data = db["Household_heat"]
    documents = list(data.find({}, {'_id': 0}))  # Excludes the _id field
    return jsonify(documents)


if __name__ == '__main__':
    app.run(debug=True)