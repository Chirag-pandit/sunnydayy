"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  User,
  Package,
  Edit3,
  Calendar,
  LogOut,
  Check,
  AlertCircle,
  Award,
  Save,
  X,
  TrendingUp,
  ChevronRight,
  Download,
  MapPin,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { api, getUserId } from '../api/client';
import { useAuth } from '../hooks/useAuth';


interface Order {
  _id: string;
  userId: string;
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled' | 'created';
  paymentMethod: 'online' | 'cod';
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
  createdAt: string;
  updatedAt: string;
}

interface UserProfile {
  firstName: string
  lastName: string
  email: string
  phone: string
  avatar: string
  dateOfBirth: string
  gender: string
  bio: string
}

interface Address {
  id: string
  type: "home" | "work" | "other"
  name: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  isDefault: boolean
}

interface PaymentMethod {
  id: string
  type: "card" | "upi" | "wallet"
  name: string
  last4?: string
  expiryDate?: string
  isDefault: boolean
}

interface NotificationSettings {
  orderUpdates: boolean
  newProducts: boolean
  specialOffers: boolean
  marketingEmails: boolean
  smsNotifications: boolean
  pushNotifications: boolean
}

interface PrivacySettings {
  profileVisibility: "public" | "private" | "friends"
  showEmail: boolean
  showPhone: boolean
  dataCollection: boolean
  analytics: boolean
}

interface AppSettings {
  theme: "light" | "dark" | "auto"
  language: string
  currency: string
  timezone: string
  autoSave: boolean
  twoFactorAuth: boolean
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview")
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")
  
  // Firebase user state
  const { user: firebaseUser, loading } = useAuth();

  

  // User Profile State - now initialized with Firebase user data
  const [userProfile, setUserProfile] = useState<UserProfile>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "+91 98765 43210",
    avatar: "/api/placeholder/128/128",
    dateOfBirth: "1995-06-15",
    gender: "male",
    bio: "Professional MMA fighter and fitness enthusiast. Training hard every day to achieve greatness.",
  })

  // Addresses State
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "addr-1",
      type: "home",
      name: "Home Address",
      street: "123 Fighter Street, Apt 4B",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400001",
      country: "India",
      isDefault: true,
    },
    {
      id: "addr-2",
      type: "work",
      name: "Gym Address",
      street: "456 Training Avenue",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400002",
      country: "India",
      isDefault: false,
    },
  ])

  // Payment Methods State
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "pm-1",
      type: "card",
      name: "Visa ending in 4242",
      last4: "4242",
      expiryDate: "12/26",
      isDefault: true,
    },
    {
      id: "pm-2",
      type: "upi",
      name: "alex@paytm",
      isDefault: false,
    },
  ])

  // Orders State - using real data from API
  const [orders, setOrders] = useState<Order[]>([]);

  // User addresses state (fetched from API)
  const [userAddresses, setUserAddresses] = useState([]);

  // Passwords state
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

  // Fetch user data from backend
  const fetchUserData = async () => {
    // We can proceed even while auth stabilizes; api client sends current userId
    try {
      // Ensure backend has a user record (no-op placeholder in current API)
      await api(`/users`, {
        method: 'POST',
        body: JSON.stringify({
          firebase_uid: firebaseUser?.uid,
          email: firebaseUser?.email,
          display_name: firebaseUser?.displayName,
          photo_url: firebaseUser?.photoURL,
          date_of_birth: userProfile.dateOfBirth,
          gender: userProfile.gender,
          bio: userProfile.bio,
        })
      });

      // Orders for current user (api helper appends userId header/query)
      let list = await api<any[]>(`/orders/${getUserId()}`);
      if (!Array.isArray(list)) {
        // defensive: normalize structure if API wraps result
        const maybe = (list as any);
        list = Array.isArray(maybe.orders) ? maybe.orders : Array.isArray(maybe.data) ? maybe.data : [];
      }

      // Fallback: try admin orders and filter by current user/email if empty
      if (!list || list.length === 0) {
        try {
          const adminList = await api<any[]>(`/admin/orders`);
          const uid = firebaseUser?.uid || getUserId();
          const email = firebaseUser?.email;
          const filtered = (Array.isArray(adminList) ? adminList : ((adminList as any).orders || (adminList as any).data || [])).filter((o: any) => (
            (o.userId && o.userId === uid) || (email && o.email === email)
          ));
          list = filtered;
        } catch {}
      }
      setOrders((list || []) as unknown as Order[]);

      // Addresses
      const addr = await api<{ addresses: any[] }>(`/addresses`);
      setUserAddresses(addr.addresses || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  

  // Profile Edit Handlers
  const handleProfileChange = (field: keyof UserProfile, value: string) => {
    setUserProfile((prev) => ({ ...prev, [field]: value }))
  }


  // Save Functions
  const handleSaveProfile = async () => {
    if (!firebaseUser?.uid) return;
    
    setSaveStatus("saving")

    try {
      const response = await fetch(`${API_BASE}/users/${firebaseUser.uid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: userProfile.firstName,
          last_name: userProfile.lastName,
          email: userProfile.email,
          phone: userProfile.phone,
          date_of_birth: userProfile.dateOfBirth,
          gender: userProfile.gender,
          bio: userProfile.bio
        }),
      });

      if (response.ok) {
        console.log("Profile saved successfully:", userProfile)
        setSaveStatus("saved")
        setIsEditing(false)
        setTimeout(() => setSaveStatus("idle"), 3000)
      } else {
        throw new Error('Failed to save profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      setSaveStatus("error")
      setTimeout(() => setSaveStatus("idle"), 3000)
    }
  }

  const handleSavePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      alert("New passwords don't match!")
      return
    }

    if (passwords.new.length < 8) {
      alert("Password must be at least 8 characters long!")
      return
    }

    setSaveStatus("saving")

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      console.log("Password updated")
      setPasswords({ current: "", new: "", confirm: "" })
      setSaveStatus("saved")
      setTimeout(() => setSaveStatus("idle"), 3000)
    } catch {
      setSaveStatus("error")
      setTimeout(() => setSaveStatus("idle"), 3000)
    }
  }

  const handleSaveSettings = async (type: string) => {
    setSaveStatus("saving")

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log(`${type} settings updated`)
      setSaveStatus("saved")
      setTimeout(() => setSaveStatus("idle"), 3000)
    } catch {
      setSaveStatus("error")
      setTimeout(() => setSaveStatus("idle"), 3000)
    }
  }

  // Address Functions
  const addAddress = () => {
    const newAddress: Address = {
      id: `addr-${Date.now()}`,
      type: "other",
      name: "New Address",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "India",
      isDefault: false,
    }
    setAddresses((prev) => [...prev, newAddress])
  }

  const removeAddress = (id: string) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id))
  }

  const setDefaultAddress = (id: string) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      })),
    )
  }

  const handleAddressChange = (id: string, field: keyof Address, value: string) => {
    setAddresses((prev) =>
      prev.map((addr) =>
        addr.id === id ? { ...addr, [field]: value } : addr
      )
    )
  }

  // Payment Method Functions
  const addPaymentMethod = () => {
    const newMethod: PaymentMethod = {
      id: `pm-${Date.now()}`,
      type: "card",
      name: "New Payment Method",
      isDefault: false,
    }
    setPaymentMethods((prev) => [...prev, newMethod])
  }

  const removePaymentMethod = (id: string) => {
    setPaymentMethods((prev) => prev.filter((pm) => pm.id !== id))
  }

  const setDefaultPaymentMethod = (id: string) => {
    setPaymentMethods((prev) =>
      prev.map((pm) => ({
        ...pm,
        isDefault: pm.id === id,
      })),
    )
  }

  // Order Actions
  const viewOrderDetails = (order: Order) => {
    navigate(`/order/${order._id}`, { state: { order } })
  }

  // Account Actions
  const downloadData = () => {
    console.log("Downloading user data...")
    alert("Your data download will begin shortly!")
  }

  const deleteAccount = () => {
    const confirmed = confirm("Are you sure you want to delete your account? This action cannot be undone.")
    if (confirmed) {
      console.log("Account deletion requested")
      alert("Account deletion request submitted. You will receive a confirmation email.")
    }
  }

  // Updated logout function with Firebase
  const logout = async () => {
    try {
      // Assuming signOut is available from firebase.auth or imported elsewhere
      // For now, we'll just navigate to login
      navigate("/login")
    } catch (error) {
      console.error("Error logging out:", error)
      alert("Error logging out. Please try again.")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "text-green-400"
      case "shipped":
        return "text-blue-400"
      case "paid":
        return "text-yellow-400"
      case "pending":
      case "created":
        return "text-gray-400"
      case "cancelled":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  const getStatusBg = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-400/10"
      case "shipped":
        return "bg-blue-400/10"
      case "paid":
        return "bg-yellow-400/10"
      case "pending":
      case "created":
        return "bg-gray-400/10"
      case "cancelled":
        return "bg-red-400/10"
      default:
        return "bg-gray-400/10"
    }
  }

  const tabItems = [
    { id: "overview", label: "Overview", icon: User },
    { id: "orders", label: "Orders", icon: Package },
    { id: "edit", label: "Edit Profile", icon: Edit3 },
  ]

  const SaveStatusIndicator = () => {
    if (saveStatus === "idle") return null

    return (
      <div
        className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg flex items-center gap-2 ${
          saveStatus === "saving" ? "bg-blue-500" : saveStatus === "saved" ? "bg-green-500" : "bg-red-500"
        } text-white font-medium shadow-lg`}
      >
        {saveStatus === "saving" && (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Saving...
          </>
        )}
        {saveStatus === "saved" && (
          <>
            <Check size={16} />
            Saved successfully!
          </>
        )}
        {saveStatus === "error" && (
          <>
            <AlertCircle size={16} />
            Error saving changes
          </>
        )}
      </div>
    )
  }

  // Firebase authentication effect
  useEffect(() => {
    if (firebaseUser?.uid) {
      fetchUserData();
    }
  }, [firebaseUser?.uid]);

  // Initialize profile fields from Firebase user
  useEffect(() => {
    if (!firebaseUser) return;
    const displayName = firebaseUser.displayName || "";
    const [first, ...rest] = displayName.split(" ");
    setUserProfile((prev) => ({
      ...prev,
      firstName: first || prev.firstName,
      lastName: rest.join(" ") || prev.lastName,
      email: firebaseUser.email || prev.email,
      avatar: firebaseUser.photoURL || prev.avatar,
    }));
  }, [firebaseUser]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl">Loading profile...</p>
          <p className="text-gray-400 mt-2">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Note: The Profile route is already protected in App.tsx, so no need to handle unauthenticated redirect here.

  return (
    <div
      className="min-h-screen bg-black text-white p-4 md:p-8"
      style={{
        background: "linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)",
      }}
    >
      <SaveStatusIndicator />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-zinc-900 to-zinc-800 p-8 shadow-2xl">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)",
            }}
          />

          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {isEditing ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={userProfile.firstName}
                      onChange={(e) => handleProfileChange("firstName", e.target.value)}
                      className="text-2xl md:text-3xl font-black bg-transparent border-b-2 border-white text-white focus:outline-none"
                      placeholder="First Name"
                    />
                    <input
                      type="text"
                      value={userProfile.lastName}
                      onChange={(e) => handleProfileChange("lastName", e.target.value)}
                      className="text-2xl md:text-3xl font-black bg-transparent border-b-2 border-white text-white focus:outline-none"
                      placeholder="Last Name"
                    />
                  </div>
                ) : (
                  <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {userProfile.firstName} {userProfile.lastName}
                  </h1>
                )}
                <Award className="text-yellow-400" size={24} />
              </div>
              <p className="text-gray-400 text-lg mb-4">
                {(firebaseUser?.providerData?.[0]?.providerId === 'google.com' ? 'Google Account' : 'Email Account')} • Member Since {firebaseUser?.metadata?.creationTime ? new Date(firebaseUser.metadata.creationTime).getFullYear() : 'N/A'}
              </p>

              <div className="flex flex-wrap gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{orders.length}</div>
                  <div className="text-sm text-gray-400">Orders</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    ₹{orders.reduce((sum, order) => sum + order.amount, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">Total Spent</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{userAddresses.length}</div>
                  <div className="text-sm text-gray-400">Addresses</div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSaveProfile}
                    disabled={saveStatus === "saving"}
                    className="bg-green-500 text-white px-6 py-3 rounded-full font-bold hover:bg-green-600 transition-all duration-200 flex items-center gap-2 hover:scale-105 disabled:opacity-50"
                  >
                    <Save size={16} />
                    {saveStatus === "saving" ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-500 text-white px-6 py-3 rounded-full font-bold hover:bg-gray-600 transition-all duration-200 flex items-center gap-2 hover:scale-105"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-gray-200 transition-all duration-200 flex items-center gap-2 hover:scale-105"
                >
                  <Edit3 size={16} />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900 rounded-2xl p-6 sticky top-4">
              <h3 className="text-lg font-bold mb-6 text-white">Account</h3>
              <nav className="space-y-2">
                {tabItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        activeTab === item.id
                          ? "bg-white text-black shadow-lg"
                          : "text-gray-400 hover:text-white hover:bg-zinc-800"
                      }`}
                      style={{
                        transform: activeTab === item.id ? "translateX(4px)" : "translateX(0)",
                      }}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                      <ChevronRight
                        size={16}
                        className={`ml-auto transition-transform duration-200 ${
                          activeTab === item.id ? "rotate-90" : ""
                        }`}
                      />
                    </button>
                  )
                })}
              </nav>

              {/* Quick Actions */}
              <div className="mt-8 pt-6 border-t border-zinc-700">
                <h4 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wide">Quick Actions</h4>
                <div className="space-y-2">
                  <button
                    onClick={downloadData}
                    className="w-full flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-all duration-200"
                  >
                    <Download size={16} />
                    <span className="text-sm">Download Data</span>
                  </button>
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-all duration-200"
                  >
                    <LogOut size={16} />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div
              className="bg-zinc-900 rounded-2xl p-6 md:p-8"
              style={{
                animation: "slideInUp 0.5s ease-out",
              }}
            >
              {activeTab === "overview" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-6 text-white">Account Overview</h2>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div
                        className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer"
                        style={{ boxShadow: "0 0 20px rgba(34, 197, 94, 0.1)" }}
                        onClick={() => setActiveTab("orders")}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <TrendingUp className="text-green-400" size={24} />
                          <span className="text-green-400 text-sm font-medium">+12%</span>
                        </div>
                        <div className="text-2xl font-bold text-white mb-1">
                          ₹{orders.reduce((sum, order) => sum + order.amount, 0).toLocaleString()}
                        </div>
                        <div className="text-gray-400 text-sm">Total Spent</div>
                      </div>

                      <div
                        className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer"
                        onClick={() => setActiveTab("orders")}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <Package className="text-blue-400" size={24} />
                          <span className="text-blue-400 text-sm font-medium">Active</span>
                        </div>
                        <div className="text-2xl font-bold text-white mb-1">
                          {orders.filter((order) => order.status !== "delivered").length}
                        </div>
                        <div className="text-gray-400 text-sm">Pending Orders</div>
                      </div>

                      <div
                        className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer"
                        aria-label="addresses-card"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <MapPin className="text-purple-400" size={24} />
                          <span className="text-purple-400 text-sm font-medium">Saved</span>
                        </div>
                        <div className="text-2xl font-bold text-white mb-1">{userAddresses.length}</div>
                        <div className="text-gray-400 text-sm">Addresses</div>
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-zinc-800 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white">Recent Activity</h3>
                        <button
                          onClick={() => setActiveTab("orders")}
                          className="text-gray-400 hover:text-white text-sm font-medium flex items-center gap-1"
                        >
                          View All <ChevronRight size={14} />
                        </button>
                      </div>
                      {orders.length === 0 ? (
                        <div className="text-gray-400 text-sm">No orders yet.</div>
                      ) : (
                        <div className="space-y-4">
                          {orders.slice(0, 3).map((order, index) => (
                            <div
                              key={order._id}
                              className="flex items-center justify-between p-4 bg-zinc-700 rounded-lg hover:bg-zinc-600 transition-all duration-200 cursor-pointer"
                              style={{
                                animationDelay: `${index * 0.1}s`,
                                animation: "slideInRight 0.5s ease-out forwards",
                                opacity: 0,
                              }}
                              onClick={() => viewOrderDetails(order)}
                            >
                              <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-md bg-gray-200 flex items-center justify-center">
                                  <Package className="w-6 h-6 text-gray-500" />
                                </div>
                                <div>
                                  <h3 className="font-medium">Order #{order._id.slice(-6)}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(order.createdAt).toLocaleDateString()} • {order.items.length} items
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-4">
                                <span className="font-medium">₹{order.amount.toLocaleString()}</span>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === "delivered" ? "bg-green-100 text-green-800" : order.status === "paid" ? "bg-yellow-100 text-yellow-800" : order.status === "shipped" ? "bg-blue-100 text-blue-800" : order.status === "pending" ? "bg-gray-100 text-gray-800" : "bg-red-100 text-red-800"}`}
                                >
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                                <button
                                  className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-100 transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    viewOrderDetails(order);
                                  }}
                                >
                                  View
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "orders" && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-white">Order History</h2>
                  {orders.length === 0 ? (
                    <div className="text-gray-400">No orders yet.</div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order, index) => (
                        <div
                          key={order._id}
                          className="flex items-center justify-between p-4 border rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-all duration-300 cursor-pointer group"
                          style={{
                            animationDelay: `${index * 0.1}s`,
                            animation: "slideInRight 0.5s ease-out forwards",
                            opacity: 0,
                          }}
                          onClick={() => viewOrderDetails(order)}
                        >
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <div className="font-bold text-white group-hover:text-gray-200 transition-colors">
                              Order #{order._id}
                            </div>
                            <div className="text-gray-400 text-sm flex items-center gap-2">
                              <Calendar size={14} />
                              {new Date(order.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <span
                            className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)} ${getStatusBg(order.status)}`}
                          >
                            {order.status}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <img
                              src={order.items[0]?.image || "/placeholder.svg"}
                              alt="Order"
                              className="w-16 h-16 rounded-lg object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                            <div>
                              <div className="text-white font-medium">{order.items.length} items</div>
                              <div className="text-2xl font-bold text-white">₹{order.amount.toLocaleString()}</div>
                            </div>
                          </div>
                          <ChevronRight className="text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-200" />
                        </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "edit" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-6 text-white">Edit Profile</h2>
                    
                    {/* Personal Information */}
                    <div className="bg-zinc-800 rounded-xl p-6 mb-8">
                      <h3 className="text-lg font-bold mb-4 text-white">Personal Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                          <input
                            type="text"
                            value={userProfile.firstName}
                            onChange={(e) => handleProfileChange("firstName", e.target.value)}
                            className="w-full px-4 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="First Name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                          <input
                            type="text"
                            value={userProfile.lastName}
                            onChange={(e) => handleProfileChange("lastName", e.target.value)}
                            className="w-full px-4 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Last Name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                          <input
                            type="email"
                            value={userProfile.email}
                            onChange={(e) => handleProfileChange("email", e.target.value)}
                            className="w-full px-4 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Email"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                          <input
                            type="tel"
                            value={userProfile.phone}
                            onChange={(e) => handleProfileChange("phone", e.target.value)}
                            className="w-full px-4 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Phone"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Addresses */}
                    <div className="bg-zinc-800 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white">Saved Addresses</h3>
                        <button
                          onClick={addAddress}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                        >
                          Add Address
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        {addresses.map((address) => (
                          <div key={address.id} className="bg-zinc-700 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-300">{address.type.charAt(0).toUpperCase() + address.type.slice(1)}</span>
                                {address.isDefault && (
                                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">Default</span>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setDefaultAddress(address.id)}
                                  className="text-blue-400 hover:text-blue-300 text-sm"
                                >
                                  Set Default
                                </button>
                                <button
                                  onClick={() => removeAddress(address.id)}
                                  className="text-red-400 hover:text-red-300 text-sm"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs text-gray-400 mb-1">Name</label>
                                <input
                                  type="text"
                                  value={address.name}
                                  onChange={(e) => handleAddressChange(address.id, 'name', e.target.value)}
                                  className="w-full px-3 py-1 bg-zinc-600 border border-zinc-500 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-400 mb-1">Type</label>
                                <select
                                  value={address.type}
                                  onChange={(e) => handleAddressChange(address.id, 'type', e.target.value as 'home' | 'work' | 'other')}
                                  className="w-full px-3 py-1 bg-zinc-600 border border-zinc-500 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                  <option value="home">Home</option>
                                  <option value="work">Work</option>
                                  <option value="other">Other</option>
                                </select>
                              </div>
                              <div className="md:col-span-2">
                                <label className="block text-xs text-gray-400 mb-1">Street</label>
                                <input
                                  type="text"
                                  value={address.street}
                                  onChange={(e) => handleAddressChange(address.id, 'street', e.target.value)}
                                  className="w-full px-3 py-1 bg-zinc-600 border border-zinc-500 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-400 mb-1">City</label>
                                <input
                                  type="text"
                                  value={address.city}
                                  onChange={(e) => handleAddressChange(address.id, 'city', e.target.value)}
                                  className="w-full px-3 py-1 bg-zinc-600 border border-zinc-500 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-400 mb-1">State</label>
                                <input
                                  type="text"
                                  value={address.state}
                                  onChange={(e) => handleAddressChange(address.id, 'state', e.target.value)}
                                  className="w-full px-3 py-1 bg-zinc-600 border border-zinc-500 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-400 mb-1">Zip Code</label>
                                <input
                                  type="text"
                                  value={address.zipCode}
                                  onChange={(e) => handleAddressChange(address.id, 'zipCode', e.target.value)}
                                  className="w-full px-3 py-1 bg-zinc-600 border border-zinc-500 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-400 mb-1">Country</label>
                                <input
                                  type="text"
                                  value={address.country}
                                  onChange={(e) => handleAddressChange(address.id, 'country', e.target.value)}
                                  className="w-full px-3 py-1 bg-zinc-600 border border-zinc-500 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end">
                      <button
                        onClick={handleSaveProfile}
                        disabled={saveStatus === "saving"}
                        className="bg-green-500 text-white px-6 py-3 rounded-full font-bold hover:bg-green-600 transition-all duration-200 flex items-center gap-2 hover:scale-105 disabled:opacity-50"
                      >
                        <Save size={16} />
                        {saveStatus === "saving" ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 30px rgba(255,255,255,0.2); }
          50% { box-shadow: 0 0 40px rgba(255,255,255,0.4); }
        }
        
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}

export default Profile
