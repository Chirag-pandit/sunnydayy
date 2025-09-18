import { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";

interface OrderSummaryProps {
  subtotal: number;
  itemCount: number;
  onApplyCoupon: (code: string) => void;
  onRemoveCoupon: () => void;
  discount: number;
  couponApplied: boolean;
  shipping: number;
  gstAmount: number;
  total: number;
}

const OrderSummary = ({
  subtotal,
  itemCount,
  onApplyCoupon,
  onRemoveCoupon,
  discount,
  couponApplied,
  shipping,
  gstAmount,
  total,
}: OrderSummaryProps) => {
  const [couponCode, setCouponCode] = useState("");

  const handleApplyCoupon = () => {
    onApplyCoupon(couponCode);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>
        
        {couponApplied && (
          <div className="flex justify-between text-green-600">
            <div className="flex items-center">
              <span>Discount</span>
              <button 
                onClick={onRemoveCoupon}
                className="ml-2 text-xs text-gray-400 hover:text-red-500 transition-colors"
                aria-label="Remove coupon"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}
        
        <div className="flex justify-between">
          <span>Shipping</span>
          <span className="font-medium">
            {shipping === 0 ? 'Free' : formatPrice(shipping)}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>GST (18%)</span>
          <span className="font-medium">{formatPrice(gstAmount)}</span>
        </div>
        
        <div className="border-t border-gray-200 my-4"></div>
        
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
      
      {!couponApplied && (
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">Have a coupon code?</p>
          <div className="flex">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Enter coupon code"
              className="flex-1 border rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={handleApplyCoupon}
              className="bg-gray-800 text-white px-4 py-2 rounded-r-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 transition-colors text-sm"
            >
              Apply
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">Try "SUNNY10" for 10% off</p>
        </div>
      )}
      
      <Link to="/checkout">
        <button
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Proceed to Checkout
        </button>
      </Link>
    </div>
  );
};

export default OrderSummary;
