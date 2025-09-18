import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface Order {
  _id: string;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  amount: number;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: 'online' | 'cod';
  paymentId?: string;
}

export default function TrackOrder() {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Check if we have an order ID in the URL
  useEffect(() => {
    const { id: orderId, email: emailParam } = router.query;
    if (orderId && emailParam) {
      setEmail(emailParam as string);
      fetchOrder(orderId as string, emailParam as string);
    }
  }, [router.query]);

  const fetchOrder = async (orderId: string, userEmail: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/orders/${orderId}?email=${encodeURIComponent(userEmail)}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('No order found with this ID and email combination.');
        } else {
          throw new Error('Failed to fetch order details.');
        }
      }
      
      const data = await response.json();
      setOrder(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching your order.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !emailInput) return;
    
    setSubmitting(true);
    fetchOrder(id as string, emailInput);
    setEmail(emailInput);
    setSubmitting(false);
  };

  const getStatusInfo = (status: string) => {
    const statusInfo = {
      pending: {
        title: 'Order Pending',
        description: 'Your order has been received and is being processed.',
        icon: (
          <svg className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        steps: [
          { id: 'order-placed', name: 'Order Placed', status: 'complete' },
          { id: 'processing', name: 'Processing', status: 'current' },
          { id: 'shipped', name: 'Shipped', status: 'upcoming' },
          { id: 'delivered', name: 'Delivered', status: 'upcoming' },
        ],
      },
      paid: {
        title: 'Payment Received',
        description: 'Your payment has been successfully processed.',
        icon: (
          <svg className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        steps: [
          { id: 'order-placed', name: 'Order Placed', status: 'complete' },
          { id: 'processing', name: 'Processing', status: 'complete' },
          { id: 'shipped', name: 'Shipped', status: 'current' },
          { id: 'delivered', name: 'Delivered', status: 'upcoming' },
        ],
      },
      shipped: {
        title: 'Order Shipped',
        description: 'Your order is on its way to you!',
        icon: (
          <svg className="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
          </svg>
        ),
        steps: [
          { id: 'order-placed', name: 'Order Placed', status: 'complete' },
          { id: 'processing', name: 'Processing', status: 'complete' },
          { id: 'shipped', name: 'Shipped', status: 'current' },
          { id: 'delivered', name: 'Delivered', status: 'upcoming' },
        ],
      },
      delivered: {
        title: 'Order Delivered',
        description: 'Your order has been successfully delivered!',
        icon: (
          <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ),
        steps: [
          { id: 'order-placed', name: 'Order Placed', status: 'complete' },
          { id: 'processing', name: 'Processing', status: 'complete' },
          { id: 'shipped', name: 'Shipped', status: 'complete' },
          { id: 'delivered', name: 'Delivered', status: 'complete' },
        ],
      },
      cancelled: {
        title: 'Order Cancelled',
        description: 'This order has been cancelled.',
        icon: (
          <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ),
        steps: [
          { id: 'order-placed', name: 'Order Placed', status: 'complete' },
          { id: 'processing', name: 'Processing', status: 'complete' },
          { id: 'cancelled', name: 'Cancelled', status: 'current' },
        ],
      },
    };

    return statusInfo[status as keyof typeof statusInfo] || statusInfo.pending;
  };

  // Show email form if we don't have an email yet
  if (!email && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Track Your Order</h1>
            <p className="text-gray-600 mb-8">Enter your order ID and email to track your order status</p>
          </div>
          
          <div className="bg-white py-8 px-6 shadow rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="orderId" className="block text-sm font-medium text-gray-700">
                  Order ID
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="orderId"
                    value={id || ''}
                    disabled
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-100"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    id="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">{error}</h3>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={submitting || !emailInput}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${(submitting || !emailInput) ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {submitting ? 'Loading...' : 'Track Order'}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-6 text-center text-sm">
            <Link href="/" className="font-medium text-indigo-600 hover:text-indigo-500">
              &larr; Back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="mt-3 text-lg font-medium text-gray-900">Order Not Found</h2>
          <p className="mt-1 text-gray-600">{error}</p>
          <div className="mt-6">
            <button
              onClick={() => {
                setError('');
                setEmail('');
                setEmailInput('');
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Try Again
            </button>
          </div>
          <div className="mt-6">
            <Link href="/" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              &larr; Back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Show order details
  const statusInfo = getStatusInfo(order.status);
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Order #{order._id.substring(0, 8)}</h1>
          <p className="text-gray-600">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>

        {/* Order Status Card */}
        <div className="bg-white shadow overflow-hidden rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 bg-indigo-50">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {statusInfo.icon}
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-bold text-gray-900">{statusInfo.title}</h2>
                <p className="mt-1 text-sm text-gray-600">{statusInfo.description}</p>
              </div>
            </div>
          </div>
          
          {/* Order Status Steps */}
          <div className="px-4 py-5 sm:p-6">
            <div className="w-full">
              <div className="overflow-hidden">
                <nav aria-label="Progress">
                  <ol className="flex items-center">
                    {statusInfo.steps.map((step, stepIdx) => (
                      <li 
                        key={step.name} 
                        className={`relative ${stepIdx !== statusInfo.steps.length - 1 ? 'flex-1' : 'flex-none'}`}
                      >
                        {step.status === 'complete' ? (
                          <>
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                              <div className="h-0.5 w-full bg-indigo-600" />
                            </div>
                            <div className="relative w-8 h-8 flex items-center justify-center bg-indigo-600 rounded-full">
                              <svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </>
                        ) : step.status === 'current' ? (
                          <>
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                              <div className="h-0.5 w-full bg-gray-200" />
                            </div>
                            <div className="relative w-8 h-8 flex items-center justify-center bg-white border-2 border-indigo-600 rounded-full" aria-current="step">
                              <span className="h-2.5 w-2.5 bg-indigo-600 rounded-full" aria-hidden="true" />
                              <span className="sr-only">{step.name}</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                              <div className="h-0.5 w-full bg-gray-200" />
                            </div>
                            <div className="relative w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-300 rounded-full group-hover:border-gray-400">
                              <span className="h-2.5 w-2.5 bg-transparent rounded-full group-hover:bg-gray-300" aria-hidden="true" />
                              <span className="sr-only">{step.name}</span>
                            </div>
                          </>
                        )}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-24 text-xs text-center text-gray-500">
                          {step.name}
                        </div>
                      </li>
                    ))}
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white shadow overflow-hidden rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Order Number</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  #{order._id.substring(0, 8)}
                </dd>
              </div>
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Date placed</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </dd>
              </div>
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Payment Method</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                </dd>
              </div>
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Order Status</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'paid' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'shipped' ? 'bg-indigo-100 text-indigo-800' :
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Shipping Information */}
        <div className="bg-white shadow overflow-hidden rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">Shipping Information</h2>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Shipping address</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  <div>{order.fullName}</div>
                  <div>{order.addressLine1}</div>
                  {order.addressLine2 && <div>{order.addressLine2}</div>}
                  <div>
                    {order.city}, {order.state} {order.pincode}
                  </div>
                  <div className="mt-1">
                    <span className="text-gray-500">Phone:</span> {order.phone}
                  </div>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">Order Items</h2>
          </div>
          <div className="border-t border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {item.image && (
                            <div className="flex-shrink-0 h-10 w-10">
                              <img className="h-10 w-10 rounded-md" src={item.image} alt={item.name} />
                            </div>
                          )}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ₹{item.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={3} className="text-right px-6 py-4 text-sm font-medium text-gray-500">
                      Subtotal
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₹{order.amount.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="text-right px-6 py-4 text-sm font-medium text-gray-500">
                      Shipping
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.amount > 499 || order.amount === 0 ? 'FREE' : '₹50.00'}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="text-right px-6 py-4 text-lg font-bold text-gray-900">
                      Total
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-gray-900">
                      ₹{order.amount.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Continue Shopping
          </Link>
          <button
            onClick={() => window.print()}
            className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
            </svg>
            Print
          </button>
        </div>
      </div>
    </div>
  );
}
