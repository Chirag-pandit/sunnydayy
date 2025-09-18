import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../hooks/useAuth';
import { calculateCartTotal, calculateGst, calculateShipping } from '../utils/cartUtils';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface Address {
  id: string;
  type: "home" | "work" | "other";
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const CheckoutPage: React.FC = () => {
  const { cartItems, clearCart } = useCart();
  const { user: firebaseUser } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [useNewAddress, setUseNewAddress] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'cod',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const subtotal = calculateCartTotal(cartItems);
  const shipping = calculateShipping(subtotal);
  const gstAmount = calculateGst(subtotal);
  const total = Math.round((subtotal + shipping + gstAmount) * 100) / 100; // Round to 2 decimal places

  // Load saved addresses
  useEffect(() => {
    const loadAddresses = () => {
      // Try to get addresses from localStorage first
      const savedAddresses = localStorage.getItem('userAddresses');
      if (savedAddresses) {
        try {
          const parsedAddresses = JSON.parse(savedAddresses);
          setAddresses(parsedAddresses);
          
          // Set default address as selected
          const defaultAddress = parsedAddresses.find((addr: Address) => addr.isDefault);
          if (defaultAddress) {
            setSelectedAddressId(defaultAddress.id);
            setUseNewAddress(false);
            populateFormFromAddress(defaultAddress);
          }
        } catch (error) {
          console.error('Error parsing saved addresses:', error);
        }
      }
    };

    loadAddresses();
  }, []);

  const populateFormFromAddress = (address: Address) => {
    setFormData(prev => ({
      ...prev,
      fullName: address.name,
      address: address.street,
      city: address.city,
      state: address.state,
      pincode: address.zipCode
    }));
  };

  const handleAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId);
    setUseNewAddress(false);
    const selectedAddress = addresses.find(addr => addr.id === addressId);
    if (selectedAddress) {
      populateFormFromAddress(selectedAddress);
    }
  };

  const handleUseNewAddress = () => {
    setUseNewAddress(true);
    setSelectedAddressId('');
    // Clear form fields
    setFormData(prev => ({
      ...prev,
      fullName: '',
      address: '',
      city: '',
      state: '',
      pincode: ''
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRazorpayPayment = (orderData: any): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      console.log('Razorpay Key:', razorpayKey);
      
      if (!razorpayKey) {
        reject(new Error('Razorpay key not configured'));
        return;
      }

      // For test mode, we'll skip the order_id requirement
      const options = {
        key: razorpayKey,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'SunnyDay Store',
        description: 'Order Payment',
        // Remove order_id for test mode to make it simpler
        handler: function (response: any) {
          console.log('Payment success response:', response);
          console.log('Payment ID:', response.razorpay_payment_id);
          console.log('Order ID:', response.razorpay_order_id);
          console.log('Signature:', response.razorpay_signature);
          resolve(true);
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: '#3399cc'
        },
        modal: {
          ondismiss: function() {
            console.log('Payment modal dismissed');
            reject(new Error('Payment was cancelled by user'));
          }
        }
      };

      try {
        if (!window.Razorpay) {
          throw new Error('Razorpay not loaded');
        }
        
        console.log('Creating Razorpay instance with options:', options);
        const rzp = new window.Razorpay(options);
        
        rzp.on('payment.failed', function (response: any) {
          console.error('Payment failed response:', response);
          console.error('Error code:', response.error.code);
          console.error('Error description:', response.error.description);
          console.error('Error source:', response.error.source);
          console.error('Error step:', response.error.step);
          console.error('Error reason:', response.error.reason);
          reject(new Error(response.error?.description || 'Payment failed. Please try again.'));
        });
        
        rzp.open();
        
      } catch (error) {
        console.error('Error initializing Razorpay:', error);
        reject(error);
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      console.log('Starting order submission...');
      
      // Validate form data
      if (!formData.fullName || !formData.email || !formData.phone || !formData.address || 
          !formData.city || !formData.state || !formData.pincode) {
        throw new Error('Please fill in all required fields');
      }
      
      // For Razorpay test mode, create a simple test order
      const testAmount = Math.max(100, Math.round(total * 100)); // Minimum 100 paise for test
      const orderData = {
        amount: testAmount,
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        id: `order_${Date.now()}`,
        notes: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        }
      };
      
      console.log('Order data:', orderData);
      console.log('Total amount:', total);
      console.log('Test amount in paise:', testAmount);

      if (formData.paymentMethod === 'online') {
        console.log('Processing online payment...');
        
        try {
          // Load Razorpay script if not already loaded
          if (!window.Razorpay) {
            console.log('Loading Razorpay script...');
            await new Promise<void>((resolve, reject) => {
              const script = document.createElement('script');
              script.src = 'https://checkout.razorpay.com/v1/checkout.js';
              script.async = true;
              
              script.onload = () => {
                console.log('Razorpay script loaded');
                resolve();
              };
              
              script.onerror = () => {
                console.error('Failed to load Razorpay script');
                reject(new Error('Failed to load payment processor'));
              };
              
              document.body.appendChild(script);
            });
          }

          console.log('Initializing payment...');
          console.log('Payment amount:', orderData.amount);
          console.log('Payment currency:', orderData.currency);
          console.log('Payment order_id:', orderData.id);
          
          const paymentSuccess = await handleRazorpayPayment(orderData);

          if (paymentSuccess) {
            console.log('Payment successful, clearing cart...');
            clearCart();
            navigate('/order/success');
          }
          
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Payment failed';
          console.error('Payment error:', error);
          throw new Error(errorMessage);
        }
        
      } else {
        // For Cash on Delivery
        console.log('Processing COD order...');
        // In a real app, you would save the order to your database here
        console.log('Order data:', orderData);
        
        // Clear cart and redirect to success page
        clearCart();
        navigate('/order/success');
      }
    } catch (err) {
      setError('Failed to process order. Please try again.');
      console.error('Order submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="mb-6">Add some items to your cart before checking out</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-1" />
            <span>Back to Cart</span>
          </button>
          <h1 className="text-2xl font-bold ml-4">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>
              
              {/* Saved Addresses Section */}
              {addresses.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-4">Saved Addresses</h3>
                  <div className="space-y-3 mb-4">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        onClick={() => handleAddressSelect(address.id)}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedAddressId === address.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium text-gray-900">{address.name}</span>
                              <span className="text-sm text-gray-500">({address.type})</span>
                              {address.isDefault && (
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                  Default
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-600">
                              <p>{address.street}</p>
                              <p>{address.city}, {address.state} {address.zipCode}</p>
                              <p>{address.country}</p>
                            </div>
                          </div>
                          <div className="ml-4">
                            <input
                              type="radio"
                              name="selectedAddress"
                              checked={selectedAddressId === address.id}
                              onChange={() => handleAddressSelect(address.id)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleUseNewAddress}
                      className={`px-4 py-2 rounded-md font-medium transition-colors ${
                        useNewAddress
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Use New Address
                    </button>
                    <p className="text-sm text-gray-500">
                      Or select a saved address above
                    </p>
                  </div>
                </div>
              )}
              
              {/* New Address Form - Show when useNewAddress is true or no saved addresses */}
              {(useNewAddress || addresses.length === 0) && (
                <div>
                  <h3 className="text-lg font-medium mb-4">
                    {addresses.length > 0 ? 'Enter New Address' : 'Shipping Address'}
                  </h3>
                  
                  {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                      {error}
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Pincode *
                        </label>
                        <input
                          type="text"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address *
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData(prev => ({
                            ...prev,
                            address: e.target.value
                          }))
                        }
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          State *
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-medium mb-4">Payment Method</h3>
                      <div className="space-y-3">
                        <label className="flex items-center p-4 border rounded-md cursor-pointer hover:border-blue-500">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="cod"
                            checked={formData.paymentMethod === 'cod'}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="ml-3">
                            <p className="font-medium">Cash on Delivery (COD)</p>
                            <p className="text-sm text-gray-500">Pay when you receive your order</p>
                          </div>
                        </label>
                        <label className="flex items-center p-4 border rounded-md cursor-pointer hover:border-blue-500">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="online"
                            checked={formData.paymentMethod === 'online'}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="ml-3">
                            <p className="font-medium">Pay Online</p>
                            <p className="text-sm text-gray-500">Credit/Debit card, UPI, Netbanking</p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span>GST (18%)</span>
                  <span className="font-medium">₹{gstAmount.toFixed(2)}</span>
                </div>
                
                <div className="border-t border-gray-200 my-4"></div>
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
              
              <button
                type="submit"
                onClick={(e) => handleSubmit(e)}
                disabled={isSubmitting}
                className={`w-full py-3 px-4 rounded-md font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
                  isSubmitting 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isSubmitting ? 'Placing Order...' : 'Place Order'}
              </button>
              
              <p className="text-xs text-gray-500 mt-2 text-center">
                By placing your order, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
