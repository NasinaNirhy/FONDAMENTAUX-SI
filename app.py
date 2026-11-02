from flask import Flask, render_template, request, jsonify
import time

app = Flask(__name__)

# Base de données fictive en mémoire
menu_items = [
    { 'id': 1, 'name': 'Burger Gourmet Frites', 'category': 'plats', 'price': 15.5, 'image': '🍔' },
    { 'id': 2, 'name': 'Pizza Margherita Artisanale', 'category': 'plats', 'price': 13.0, 'image': '🍕' },
    { 'id': 3, 'name': 'Salade César Poulet', 'category': 'entrées', 'price': 9.5, 'image': '🥗' },
    { 'id': 4, 'name': 'Tiramisu Maison', 'category': 'desserts', 'price': 6.5, 'image': '🍰' },
    { 'id': 5, 'name': 'Limonade Fraîche', 'category': 'boissons', 'price': 4.0, 'image': '🥤' }
]

orders = []

@app.route('/')
def index():
    # Flask sert le fichier HTML principal depuis le dossier "templates"
    return render_template('index.html')

@app.route('/api/menu', methods=['GET'])
def get_menu():
    return jsonify(menu_items)

@app.route('/api/orders', methods=['POST'])
def create_order():
    data = request.get_json()
    customer = data.get('customer')
    cart = data.get('cart')
    total = data.get('total')

    if not customer or not cart:
        return jsonify({'error': 'Données invalides'}), 400

    new_order = {
        'id': f"CMD-{int(time.time())}",
        'customer': customer,
        'cart': cart,
        'total': total
    }
    
    orders.append(new_order)
    print(f"[COMMANDE REÇUE] {new_order['id']} de {customer.get('name')}")

    return jsonify({
        'message': 'Commande enregistrée avec succès',
        'orderId': new_order['id']
    }), 201

if __name__ == '__main__':
    app.run(debug=True, port=5000)