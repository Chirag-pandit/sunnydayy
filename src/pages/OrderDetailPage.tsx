import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  amount: number;
  currency: string;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled" | "created";
  paymentMethod: "online" | "cod";
  fullName: string;
  email: string;
  phone: string;
  address?: string; // For older orders
  addressLine1?: string; // For newer orders
  addressLine2?: string;
  city: string;
  state: string;
  zipCode?: string; // For older orders
  pincode?: string; // For newer orders
  country: string;
  createdAt: string;
  updatedAt: string;
}

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { order?: Order } };
  const { user: firebaseUser, loading } = useAuth();

  const initialOrder = useMemo(() => location.state?.order, [location.state]);

  const [order, setOrder] = useState<Order | null>(initialOrder ?? null);
  const [fetching, setFetching] = useState<boolean>(!initialOrder);
  const [error, setError] = useState<string>("");
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (order || !id) return;
    if (!firebaseUser?.uid) return;

    const fetchOrderDetails = async () => {
      try {
        setFetching(true);
        // First, try to find the order in the user's general order list
        const userOrdersRes = await fetch(`${API_BASE}/orders/${firebaseUser.uid}`);
        if (userOrdersRes.ok) {
          const data = await userOrdersRes.json();
          const list: Order[] = Array.isArray(data)
            ? data
            : Array.isArray((data as any).orders)
            ? (data as any).orders
            : Array.isArray((data as any).data)
            ? (data as any).data
            : [];
          const foundFromUser = list.find((o: Order) => o._id === id);
          if (foundFromUser) {
            setOrder(foundFromUser);
            return; // Exit if found
          }
        }

        // Next, try a public/single order endpoint if available
        const singlePublic = await fetch(`${API_BASE}/orders/id/${id}`).catch(() => null);
        if (singlePublic && singlePublic.ok) {
          const o = await singlePublic.json();
          if (o && o._id && (o.userId === firebaseUser.uid || o.email === firebaseUser.email)) {
            setOrder(o);
            return;
          }
        }

        // Fallback: admin endpoint
        const singleOrderRes = await fetch(`${API_BASE}/admin/orders/${id}`);
        if (singleOrderRes.ok) {
          const singleOrder = await singleOrderRes.json();
          if (singleOrder && singleOrder._id) {
            if (singleOrder.userId === firebaseUser.uid || singleOrder.email === firebaseUser.email) {
              setOrder(singleOrder);
              return; // Exit if found
            }
          }
        }

        throw new Error("Order not found or you don't have permission to view it.");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load order details");
      } finally {
        setFetching(false);
      }
    };

    fetchOrderDetails();

  }, [order, id, firebaseUser?.uid, firebaseUser?.email]);

  const getStatusBadge = (status: Order["status"]) => {
    const clsMap: Record<Order["status"], string> = {
      pending: "bg-gray-500/20 text-gray-200",
      paid: "bg-yellow-500/20 text-yellow-300",
      shipped: "bg-blue-500/20 text-blue-300",
      delivered: "bg-green-500/20 text-green-300",
      cancelled: "bg-red-500/20 text-red-300",
      created: "bg-gray-500/20 text-gray-200",
    };
    const text = status.charAt(0).toUpperCase() + status.slice(1);
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${clsMap[status]}`}>{text}</span>;
  };

  if (loading || fetching) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl">Loading order...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => navigate("/profile")}
            className="bg-white text-black px-6 py-3 rounded-lg font-bold hover:bg-gray-200 transition-all"
          >
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-gray-300 mb-4">Order not found.</p>
          <button
            onClick={() => navigate("/profile")}
            className="bg-white text-black px-6 py-3 rounded-lg font-bold hover:bg-gray-200 transition-all"
          >
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  const createdDate = new Date(order.createdAt).toLocaleString();
  const canCancel = order.status === 'pending' || order.status === 'paid';

  const handleCancelOrder = async () => {
    if (!order?._id) return;
    if (!canCancel) return;
    const ok = window.confirm('Are you sure you want to cancel this order?');
    if (!ok) return;
    try {
      setCancelling(true);
      const res = await fetch(`${API_BASE}/admin/orders/${order._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || 'Failed to cancel order');
      }
      setOrder({ ...order, status: 'cancelled' });
      alert('Your order has been cancelled.');
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate("/profile")}
            className="text-gray-300 hover:text-white"
          >
            ← Back to Profile
          </button>
          <div className="flex items-center gap-3">
            {getStatusBadge(order.status)}
            <button
              onClick={handleCancelOrder}
              disabled={!canCancel || cancelling}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors border ${
                !canCancel || cancelling
                  ? 'bg-zinc-800 text-zinc-500 border-zinc-700 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 text-white border-red-600'
              }`}
            >
              {cancelling ? 'Cancelling...' : 'Cancel Order'}
            </button>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-2xl p-6 md:p-8 shadow-xl mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Order #{order._id.slice(-8)}</h1>
          <p className="text-gray-400">Placed on {createdDate}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-zinc-900 rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-4">Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.productId} className="flex items-center gap-4 bg-zinc-800 rounded-xl p-4">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-md object-cover" />
                  )}
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-gray-400 text-sm">{item.productId}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-300 text-sm">Qty: {item.quantity}</div>
                    <div className="font-semibold">₹{(item.price * item.quantity).toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900 rounded-2xl p-6 space-y-6">
            <div>
              <h3 className="text-lg font-bold mb-2">Order Summary</h3>
              <div className="flex items-center justify-between text-gray-300">
                <span>Subtotal</span>
                <span>₹{order.amount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-gray-400 text-sm mt-1">
                <span>Shipping</span>
                <span>{order.amount > 499 || order.amount === 0 ? "FREE" : "₹50"}</span>
              </div>
              <div className="border-t border-zinc-700 mt-3 pt-3 flex items-center justify-between font-bold">
                <span>Total</span>
                <span>₹{order.amount.toLocaleString()}</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2">Shipping Information</h3>
              <div className="text-gray-300">
                <div>{order.fullName}</div>
                <div className="text-gray-400 text-sm">{order.email} • {order.phone}</div>
                <div className="mt-2">
                  <div>{order.address || `${order.addressLine1 || ''}${order.addressLine2 ? `, ${order.addressLine2}` : ''}`}</div>
                  <div>{order.city}, {order.state} {order.pincode || order.zipCode}</div>
                  <div>{order.country}</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2">Payment</h3>
              <div className="text-gray-300">
                {order.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
