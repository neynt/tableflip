from api import app
from flask import abort, jsonify

api_endpoint = '/tableflip/api/v1.0/'

users = [
        {
            'id': 1,
            'title': u'Buy groceries',
            'description': u'Milk, Cheese, Pizza, Fruit, Tylenol',
            'done': False
            },
        {
            'id': 2,
            'title': u'Learn Python',
            'description': u'Need to find a good Python tutorial on the web',
            'done': False
            }
        ]

@app.route(api_endpoint + 'users', methods=['GET'])
def get_tasks():
    return jsonify({'users': users})

@app.route(api_endpoint + 'users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = [user for user in users if user['id'] == user_id]
    if len(user) == 0:
        abort(404)
    return jsonify({'user_id': user[0]})

@app.route('/')
def hello_world():
    return 'Hello, World!'
