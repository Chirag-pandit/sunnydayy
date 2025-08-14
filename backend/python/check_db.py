from app import app, db, User, Product, CartItem, Order, OrderItem, Address, PaymentMethod

def check_database():
    with app.app_context():
        print("=== DATABASE CONTENTS ===")
        
        # Check Users
        users = User.query.all()
        print(f"\nUsers ({len(users)}):")
        for user in users:
            print(f"- ID: {user.id}, Email: {user.email}, Name: {user.name}")
        
        # Check Products
        products = Product.query.all()
        print(f"\nProducts ({len(products)}):")
        for product in products:
            print(f"- ID: {product.id}, Name: {product.name}, Price: ${product.price}")
        
        # Check Cart Items
        cart_items = CartItem.query.all()
        print(f"\nCart Items ({len(cart_items)}):")
        for item in cart_items:
            print(f"- User ID: {item.user_id}, Product ID: {item.product_id}, Quantity: {item.quantity}")
        
        # Check Orders
        orders = Order.query.all()
        print(f"\nOrders ({len(orders)}):")
        for order in orders:
            print(f"- ID: {order.id}, User ID: {order.user_id}, Total: ${order.total_amount}, Status: {order.status}")
        
        # Check Addresses
        addresses = Address.query.all()
        print(f"\nAddresses ({len(addresses)}):")
        for addr in addresses:
            print(f"- User ID: {addr.user_id}, Street: {addr.street}, City: {addr.city}")

if __name__ == "__main__":
    check_database()
