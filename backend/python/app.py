from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'c2786d9353ce35734e466290890e3c79189bd89de777d8ff52872f551d91f6d1'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///sunnyday.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

CORS(app)
db = SQLAlchemy(app)

# Database Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    firebase_uid = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    profile_picture = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Float, nullable=False)
    image = db.Column(db.String(500))
    category = db.Column(db.String(50))
    stock = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class CartItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(100), nullable=False)
    product_id = db.Column(db.Integer, nullable=False)
    quantity = db.Column(db.Integer, default=1)
    product_name = db.Column(db.String(100))
    product_price = db.Column(db.Float)
    product_image = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(100), nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default='pending')
    shipping_address = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class OrderItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'), nullable=False)
    product_id = db.Column(db.Integer, nullable=False)
    product_name = db.Column(db.String(100))
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)

class Address(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(100), nullable=False)
    street = db.Column(db.String(200), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(100), nullable=False)
    zip_code = db.Column(db.String(20), nullable=False)
    country = db.Column(db.String(100), nullable=False)
    is_default = db.Column(db.Boolean, default=False)

# API Routes
@app.route('/api/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    return jsonify([{
        'id': p.id,
        'name': p.name,
        'description': p.description,
        'price': p.price,
        'image': p.image,
        'category': p.category,
        'stock': p.stock
    } for p in products])

@app.route('/api/products/category/<category>', methods=['GET'])
def get_products_by_category(category):
    products = Product.query.filter_by(category=category).all()
    return jsonify([{
        'id': p.id,
        'name': p.name,
        'description': p.description,
        'price': p.price,
        'image': p.image,
        'category': p.category,
        'stock': p.stock
    } for p in products])

@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = Product.query.get_or_404(product_id)
    return jsonify({
        'id': product.id,
        'name': product.name,
        'description': product.description,
        'price': product.price,
        'image': product.image,
        'category': product.category,
        'stock': product.stock
    })

@app.route('/api/users', methods=['POST'])
def create_user():
    data = request.json
    existing_user = User.query.filter_by(firebase_uid=data['firebase_uid']).first()
    
    if existing_user:
        # Update existing user
        existing_user.email = data['email']
        existing_user.name = data['name']
        existing_user.profile_picture = data.get('profile_picture', '')
        db.session.commit()
        return jsonify({'message': 'User updated', 'user_id': existing_user.id}), 200
    
    # Create new user
    new_user = User(
        firebase_uid=data['firebase_uid'],
        email=data['email'],
        name=data['name'],
        profile_picture=data.get('profile_picture', '')
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User created', 'user_id': new_user.id}), 201

@app.route('/api/users/<firebase_uid>/orders', methods=['GET'])
def get_user_orders(firebase_uid):
    orders = Order.query.filter_by(user_id=firebase_uid).order_by(Order.created_at.desc()).all()
    return jsonify({
        'orders': [{
            'id': order.id,
            'total_amount': order.total_amount,
            'status': order.status,
            'created_at': order.created_at.isoformat(),
            'shipping_address': order.shipping_address
        } for order in orders]
    })

@app.route('/api/users/<firebase_uid>/addresses', methods=['GET'])
def get_user_addresses(firebase_uid):
    addresses = Address.query.filter_by(user_id=firebase_uid).all()
    return jsonify({
        'addresses': [{
            'id': addr.id,
            'street': addr.street,
            'city': addr.city,
            'state': addr.state,
            'zip_code': addr.zip_code,
            'country': addr.country,
            'is_default': addr.is_default
        } for addr in addresses]
    })

@app.route('/api/cart/<firebase_uid>', methods=['GET'])
def get_user_cart(firebase_uid):
    cart_items = CartItem.query.filter_by(user_id=firebase_uid).all()
    return jsonify({
        'items': [{
            'id': item.id,
            'product_id': item.product_id,
            'quantity': item.quantity,
            'product_name': item.product_name,
            'product_price': item.product_price,
            'product_image': item.product_image
        } for item in cart_items]
    })

@app.route('/api/cart/add', methods=['POST'])
def add_to_cart():
    data = request.json
    existing_item = CartItem.query.filter_by(
        user_id=data['user_id'], 
        product_id=data['product_id']
    ).first()
    
    if existing_item:
        existing_item.quantity += data['quantity']
        db.session.commit()
        return jsonify({'message': 'Cart updated'}), 200
    
    new_item = CartItem(
        user_id=data['user_id'],
        product_id=data['product_id'],
        quantity=data['quantity'],
        product_name=data['product_name'],
        product_price=data['product_price'],
        product_image=data['product_image']
    )
    db.session.add(new_item)
    db.session.commit()
    return jsonify({'message': 'Item added to cart'}), 201

@app.route('/api/cart/update/<int:item_id>', methods=['PUT'])
def update_cart_item(item_id):
    data = request.json
    item = CartItem.query.get_or_404(item_id)
    item.quantity = data['quantity']
    db.session.commit()
    return jsonify({'message': 'Cart item updated'}), 200

@app.route('/api/cart/remove/<int:item_id>', methods=['DELETE'])
def remove_cart_item(item_id):
    item = CartItem.query.get_or_404(item_id)
    db.session.delete(item)
    db.session.commit()
    return jsonify({'message': 'Item removed from cart'}), 200

@app.route('/api/cart/clear/<firebase_uid>', methods=['DELETE'])
def clear_cart(firebase_uid):
    CartItem.query.filter_by(user_id=firebase_uid).delete()
    db.session.commit()
    return jsonify({'message': 'Cart cleared'}), 200

@app.route('/api/orders', methods=['POST'])
def create_order():
    data = request.json
    
    # Create order
    new_order = Order(
        user_id=data['user_id'],
        total_amount=data['total_amount'],
        status=data['status'],
        shipping_address=str(data['shipping_address'])
    )
    db.session.add(new_order)
    db.session.flush()  # Get the order ID
    
    # Create order items
    for item in data['items']:
        order_item = OrderItem(
            order_id=new_order.id,
            product_id=item['product_id'],
            product_name=item['product_name'],
            quantity=item['quantity'],
            price=item['price']
        )
        db.session.add(order_item)
    
    db.session.commit()
    return jsonify({'message': 'Order created', 'order_id': new_order.id}), 201

@app.route('/api/analytics/users', methods=['GET'])
def get_total_users():
    count = User.query.count()
    return jsonify({'total_users': count})

@app.route('/api/analytics/orders', methods=['GET'])
def get_total_orders():
    count = Order.query.count()
    return jsonify({'total_revenue': count})

@app.route('/api/analytics/revenue', methods=['GET'])
def get_total_revenue():
    orders = Order.query.filter_by(status='completed').all()
    total_revenue = sum(order.total_amount for order in orders)
    return jsonify({'total_revenue': total_revenue})

@app.route('/api/analytics/popular-products', methods=['GET'])
def get_popular_products():
    return jsonify({'message': 'Popular products analytics not implemented yet'})

if __name__ == '__main__':
    with app.app_context():
        # Drop all tables and recreate them
        db.drop_all()
        db.create_all()
        
        # Add sample products with correct image paths
        sample_products = [
            Product(name="Sunny Day T-Shirt", description="Comfortable cotton t-shirt", price=25.99, image="/images/products/tshirt.jpg", category="clothing", stock=50),
            Product(name="Beach Hat", description="Stylish beach hat", price=19.99, image="/images/products/hat.jpg", category="accessories", stock=30),
            Product(name="Sunglasses", description="UV protection sunglasses", price=45.99, image="/images/products/sunglasses.jpg", category="accessories", stock=25),
            Product(name="Beach Towel", description="Soft beach towel", price=29.99, image="/images/products/towel.jpg", category="home", stock=40),
            Product(name="Flip Flops", description="Comfortable flip flops", price=34.99, image="/images/products/flipflops.jpg", category="footwear", stock=35)
        ]
        
        for product in sample_products:
            db.session.add(product)
        
        db.session.commit()
        print("Database created and sample products added!")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
