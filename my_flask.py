from flask import Flask, render_template, jsonify
#from flask_pymongo import PyMongo
from pymongo import MongoClient
from pprint import pprint

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

# Define endpoint to fetch data from MongoDB and return as JSON

@app.route('/GAS')
def getGAS1():
    db = mongo["GAS"]
    data = db["Disel"]
    documents = list(data.find({}, {'_id': 0}))  # Excludes the _id field
    return jsonify(documents)

@app.route('/GAS2')
def getGAS2():
    db = mongo["GAS"]
    data = db["Household_heat"]
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
    data = db["Regular_gas"]
    documents = list(data.find({}, {'_id': 0}))  # Excludes the _id field
    return jsonify(documents)

if __name__ == '__main__':
    app.run(debug=True)