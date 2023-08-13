from flask import Flask,jsonify,redirect, url_for, request, render_template
from werkzeug.utils import secure_filename
from gevent.pywsgi import WSGIServer
from flask_cors import CORS
from datetime import datetime
import requests
import json
import csv
import numpy as np


app = Flask(__name__)
CORS(app)

# In-memory data storage (for simplicity)
books = []
members = []
transactions = []

@app.route('/search', methods=['GET'])
def search():
    query = request.args.get('query', '').lower()

    search_results = []
    for book in books:
        title = book.get('title', '').lower()
        authors = book.get('authors', '').lower()
        if query in title or query in authors:
            search_results.append(book)

    return jsonify(search_results)


book_id_counter = 1  # Initialize a counter for generating book IDs
member_id_counter = 1  # Initialize a counter for generating member IDs

# Routes for CRUD operations on books and members
@app.route('/books', methods=['GET', 'POST'])
def manage_books():
    global book_id_counter  # Access the global book_id_counter
    if request.method == 'GET':
        return jsonify(books)
    elif request.method == 'POST':
        data = request.get_json()
        data['bookID'] = book_id_counter # Assign a new book ID
        books.append(data)
        book_id_counter += 1  # Increment the book ID counter
        return jsonify({'message': 'Book added successfully'})

# Add PUT route for updating rent of a book
@app.route('/books/<int:book_id>', methods=['PUT'])
def update_rent(book_id):
    data = request.get_json()
    new_rent = int(data.get('rent'))
    
    book = next((b for b in books if int(b['bookID']) == int(book_id)), None)
    
    if book:
        book['rent'] = new_rent
        return jsonify({'message': 'Rent updated successfully'})
    else:
        return jsonify({'message': 'Book not found'})

# Add DELETE route for deleting a book
@app.route('/books/<int:book_id>', methods=['DELETE'])
def delete_book(book_id):
    book_to_delete = next((b for b in books if int(b['bookID']) == int(book_id)), None)
    
    if book_to_delete:
        books.remove(book_to_delete)
        return jsonify({'message': 'Book deleted successfully'})
    else:
        return jsonify({'message': 'Book not found'})

@app.route('/members', methods=['GET', 'POST'])
def manage_members():
    global member_id_counter  # Access the global member_id_counter
    if request.method == 'GET':
        return jsonify(members)
    elif request.method == 'POST':
        data = request.get_json()
        data['id'] = member_id_counter  # Assign a new member ID
        data['debt'] = 0
        members.append(data)
        member_id_counter += 1  # Increment the member ID counter
        return jsonify({'message': 'Member added successfully'})
    # Add PUT (update) route for members
    elif request.method == 'PUT':
        data = request.get_json()
        member_id = data.get('id')
        print(member_id)
        updated_member = next((m for m in members if int(m['id']) == int(member_id)), None)
        if updated_member:
            updated_member['name'] = data.get('name', updated_member['name'])
            # Update any other fields as needed
            return jsonify({'message': 'Member updated successfully'})
        else:
            return jsonify({'message': 'Member not found'})

    # Add DELETE route for members
    elif request.method == 'DELETE':
        data = request.get_json()
        member_id = data.get('id')
        member_to_delete = next((m for m in members if int(m['id']) == int(member_id)), None)
        if member_to_delete:
            members.remove(member_to_delete)
            return jsonify({'message': 'Member deleted successfully'})
        else:
            return jsonify({'message': 'Member not found'})

@app.route('/members/<int:member_id>', methods=['PUT', 'DELETE'])
def manage_individual_member(member_id):
    if request.method == 'PUT':
        data = request.get_json()
        updated_member = next((m for m in members if int(m['id']) == int(member_id)), None)
        if updated_member:
            updated_member['name'] = data.get('name', updated_member['name'])
            # Update any other fields as needed
            return jsonify({'message': 'Member updated successfully'})
        else:
            return jsonify({'message': 'Member not found'})

    elif request.method == 'DELETE':
        member_to_delete = next((m for m in members if int(m['id']) == int(member_id)), None)
        if member_to_delete:
            members.remove(member_to_delete)
            return jsonify({'message': 'Member deleted successfully'})
        else:
            return jsonify({'message': 'Member not found'})

transaction_id_counter = 1
@app.route('/issue-book', methods=['POST'])
def issue_book():
    global transaction_id_counter
    data = request.get_json()
    member_id = data.get('member_id')
    book_id = data.get('book_id')
    transaction_id = transaction_id_counter
    transaction_id_counter+=1
    
    member = next((m for m in members if int(m['id']) == int(member_id)), None)
    book = next((b for b in books if int(b['bookID']) == int(book_id)), None)
    if member and book and member['debt']>=500:
        return jsonify({'message':'Outstanding debt can not be more than Rs.500! Please return books first'})
    
    if member and book:
        transaction = {
            'transaction_id': transaction_id,
            'member_id': member['id'],
            'book_id': book['bookID'],
            'member_name': member['name'],
            'book_title': book['title'],
            'amount': book['rent'],  # You should set the actual rent here
            'timestamp': str(datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
        }
        member['debt'] = member['debt'] + book['rent']
        transactions.append(transaction)
        return jsonify({'message': 'Book issued successfully'})
    else:
        return jsonify({'message': 'Member or book not found'})

# API route for returning a book
@app.route('/return-book', methods=['POST'])
def return_book():
    data = request.get_json()
    member_id = data.get('member_id')
    book_id = data.get('book_id')
    member = next((m for m in members if int(m['id']) == int(member_id)), None)
    book = next((b for b in books if int(b['bookID']) == int(book_id)), None)
    member['debt'] = member['debt'] - book['rent']
    # Remove the book from transactions list based on member and book IDs
    transactions[:] = [t for t in transactions if not (int(t['member_id']) == int(member_id) and int(t['book_id']) == int(book_id))]
    return jsonify({'message': 'Book returned successfully'})


@app.route('/import-books', methods=['GET'])
def import_books():
    title = request.args.get('title', '')
    authors = request.args.get('authors', '')
    num_books_to_import = int(request.args.get('num_books', 5))
    api_endpoint = "https://frappe.io/api/method/frappe-library?page=1"
    if title!='':
        api_endpoint += f'&title={title}'
    if authors!='':
        api_endpoint += f'&authors={authors}'
    try:
        response = requests.get(api_endpoint)
        response.raise_for_status()
        books_to_import = response.json()["message"][:num_books_to_import]
        for book_data in books_to_import:
            print(book_data)
            book_exists = any(
                b['title'] == book_data['title'] or b['isbn'] == book_data['isbn']
                for b in books
            )
            if not book_exists:
                book_data['rent'] = 100
                books.append(book_data)
        
        return jsonify({'message': f'Imported {num_books_to_import} books','books': books_to_import})
    except Exception as e:
        return jsonify({'message': f'Failed to import books: {str(e)}'})

    
@app.route('/books-issued/<int:member_id>', methods=['GET'])
def books_issued_to_member(member_id):
    issued_books = []  # List to store issued books for the member
    for transaction in transactions:
        if transaction['member_id'] == member_id:
            book = next((book for book in books if book['bookID'] == transaction['book_id']), None)
            if book:
                issued_books.append(book)

    return jsonify(issued_books)

@app.route('/get-latest-transactions')
def get_latest_transactions():
    latest_transactions = transactions[-10:]  # Get the latest 10 transactions
    latest_transactions.reverse()
    return jsonify({'transactions': latest_transactions})


# ... (rest of the code)

if __name__ == '__main__':
    app.run(debug=True)
