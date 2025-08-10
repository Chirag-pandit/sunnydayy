"use client"

import type React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import {
  User,
  Settings,
  Package,
  Bell,
  Edit3,
  ChevronRight,
  Camera,
  Award,
  TrendingUp,
  Calendar,
  Eye,
  EyeOff,
  Save,
  X,
  Check,
  AlertCircle,
  MapPin,
  CreditCard,
  Shield,
  Globe,
  Moon,
  Sun,
  Smartphone,
  Mail,
  Lock,
  Trash2,
  Download,
  LogOut,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { auth } from "../lib/firebase"
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth"
import { useAuth } from '../hooks/useAuth';


interface Order {
  id: string
  date: string
  status: "delivered" | "processing" | "shipped"
  total: number
  items: number
  image: string
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
  const { user: firebaseUser, loading, authError } = useAuth();

  const fileInputRef = useRef<HTMLInputElement>(null)

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

  // Password State
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
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

  // Notification Settings State
  const [notifications, setNotifications] = useState<NotificationSettings>({
    orderUpdates: true,
    newProducts: true,
    specialOffers: false,
    marketingEmails: false,
    smsNotifications: true,
    pushNotifications: true,
  })

  // Privacy Settings State
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    profileVisibility: "private",
    showEmail: false,
    showPhone: false,
    dataCollection: true,
    analytics: false,
  })

  // App Settings State
  const [appSettings, setAppSettings] = useState<AppSettings>({
    theme: "dark",
    language: "en",
    currency: "INR",
    timezone: "Asia/Kolkata",
    autoSave: true,
    twoFactorAuth: false,
  })

  // Orders State
  const [orders] = useState<Order[]>([
    {
      id: "ORD-001",
      date: "2024-12-15",
      status: "delivered",
      total: 2499,
      items: 3,
      image: "/api/placeholder/60/60",
    },
    {
      id: "ORD-002",
      date: "2024-12-10",
      status: "shipped",
      total: 1899,
      items: 2,
      image: "/api/placeholder/60/60",
    },
    {
      id: "ORD-003",
      date: "2024-12-05",
      status: "processing",
      total: 3299,
      items: 1,
      image: "/api/placeholder/60/60",
    },
  ])

  // Add new state for orders and addresses
  const [userOrders, setUserOrders] = useState([]);
  const [userAddresses, setUserAddresses] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const API_BASE = 'http://localhost:5000/api';

  // Fetch user data from backend
  const fetchUserData = async () => {
    if (!firebaseUser?.uid) return;

    try {
      // Create/update user in backend
      const userResponse = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firebase_uid: firebaseUser.uid,
          email: firebaseUser.email,
          display_name: firebaseUser.displayName,
          photo_url: firebaseUser.photoURL,
          date_of_birth: userProfile.dateOfBirth,
          gender: userProfile.gender,
          bio: userProfile.bio
        }),
      });

      if (userResponse.ok) {
        // Fetch user orders
        const ordersResponse = await fetch(`${API_BASE}/orders/${firebaseUser.uid}`);
        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json();
          setUserOrders(ordersData.orders || []);
        }

        // Fetch user addresses
        const addressesResponse = await fetch(`${API_BASE}/addresses/${firebaseUser.uid}`);
        if (addressesResponse.ok) {
          const addressesData = await addressesResponse.json();
          setUserAddresses(addressesData.addresses || []);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Image Upload Handler
  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB")
        return
      }

      if (!file.type.startsWith("image/")) {
        alert("Please select an image file")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setUserProfile((prev) => ({ ...prev, avatar: result }))
        setSaveStatus("saved")
        setTimeout(() => setSaveStatus("idle"), 2000)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  // Profile Edit Handlers
  const handleProfileChange = (field: keyof UserProfile, value: string) => {
    setUserProfile((prev) => ({ ...prev, [field]: value }))
  }

  const handlePasswordChange = (field: keyof typeof passwords, value: string) => {
    setPasswords((prev) => ({ ...prev, [field]: value }))
  }

  const handleNotificationToggle = (setting: keyof NotificationSettings) => {
    setNotifications((prev) => ({ ...prev, [setting]: !prev[setting] }))
  }

  const handlePrivacyToggle = (setting: keyof PrivacySettings) => {
    if (setting === "profileVisibility") return
    setPrivacySettings((prev) => ({ ...prev, [setting]: !prev[setting] }))
  }

  const handleAppSettingToggle = (setting: keyof AppSettings) => {
    if (["theme", "language", "currency", "timezone"].includes(setting)) return
    setAppSettings((prev) => ({ ...prev, [setting]: !prev[setting] }))
  }

  // Save Functions
  const handleSaveProfile = async () => {
    setSaveStatus("saving")
    await new Promise((resolve) => setTimeout(resolve, 1500))

    try {
      console.log("Saving profile:", userProfile)
      setSaveStatus("saved")
      setIsEditing(false)
      setTimeout(() => setSaveStatus("idle"), 3000)
    } catch {
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
  const viewOrderDetails = (orderId: string) => {
    console.log("Viewing order:", orderId)
    alert(`Opening order details for ${orderId}`)
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
      case "processing":
        return "text-yellow-400"
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
      case "processing":
        return "bg-yellow-400/10"
      default:
        return "bg-gray-400/10"
    }
  }

  const tabItems = [
    { id: "overview", label: "Overview", icon: User },
    { id: "orders", label: "Orders", icon: Package },
    { id: "settings", label: "Settings", icon: Settings },
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

  // Show error state if authentication failed
  if (authError) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
          <p className="text-gray-400 mb-6">{authError}</p>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-white text-black px-6 py-3 rounded-lg font-bold hover:bg-gray-200 transition-all duration-200"
            >
              Go to Login
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-500 transition-all duration-200"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    )
  }

  // If no user, redirect to login
  if (!firebaseUser) {
    // Add a small delay to prevent immediate redirect
    useEffect(() => {
      const timer = setTimeout(() => {
        navigate("/login")
      }, 1000)
      return () => clearTimeout(timer)
    }, [navigate])
    
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl">Redirecting to login...</p>
        </div>
      </div>
    )
  }

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
            <div className="relative group">
              <div
                className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-r from-white to-gray-300 p-1 transition-all duration-500 group-hover:scale-105 group-hover:rotate-3"
                style={{
                  boxShadow: "0 0 30px rgba(255,255,255,0.2)",
                  animation: "pulse-glow 3s ease-in-out infinite",
                }}
              >
                <img
                  src={userProfile.avatar || "/placeholder.svg"}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-white text-black rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200 hover:bg-gray-200"
              >
                <Camera size={14} />
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </div>

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
                {firebaseUser.providerData[0]?.providerId === 'google.com' ? 'Google Account' : 'Email Account'} • Member Since {new Date(firebaseUser.metadata.creationTime).getFullYear()}
              </p>

              <div className="flex flex-wrap gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{orders.length}</div>
                  <div className="text-sm text-gray-400">Orders</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    ₹{orders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">Total Spent</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{addresses.length}</div>
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
                          ₹{orders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}
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
                        onClick={() => setActiveTab("settings")}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <MapPin className="text-purple-400" size={24} />
                          <span className="text-purple-400 text-sm font-medium">Saved</span>
                        </div>
                        <div className="text-2xl font-bold text-white mb-1">{addresses.length}</div>
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
                      <div className="space-y-4">
                        {orders.slice(0, 3).map((order, index) => (
                          <div
                            key={order.id}
                            className="flex items-center gap-4 p-4 bg-zinc-700 rounded-lg hover:bg-zinc-600 transition-all duration-200 cursor-pointer"
                            style={{
                              animationDelay: `${index * 0.1}s`,
                              animation: "fadeInLeft 0.5s ease-out forwards",
                              opacity: 0,
                            }}
                            onClick={() => viewOrderDetails(order.id)}
                          >
                            <img
                              src={order.image || "/placeholder.svg"}
                              alt="Order"
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <div className="font-medium text-white">Order #{order.id}</div>
                              <div className="text-sm text-gray-400">
                                {order.items} items • ₹{order.total.toLocaleString()}
                              </div>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)} ${getStatusBg(order.status)}`}
                            >
                              {order.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "orders" && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-white">Order History</h2>
                  <div className="space-y-4">
                    {orders.map((order, index) => (
                      <div
                        key={order.id}
                        className="bg-zinc-800 rounded-xl p-6 hover:bg-zinc-700 transition-all duration-300 cursor-pointer group"
                        style={{
                          animationDelay: `${index * 0.1}s`,
                          animation: "slideInRight 0.5s ease-out forwards",
                          opacity: 0,
                        }}
                        onClick={() => viewOrderDetails(order.id)}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <div className="font-bold text-white group-hover:text-gray-200 transition-colors">
                              Order #{order.id}
                            </div>
                            <div className="text-gray-400 text-sm flex items-center gap-2">
                              <Calendar size={14} />
                              {new Date(order.date).toLocaleDateString()}
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
                              src={order.image || "/placeholder.svg"}
                              alt="Order"
                              className="w-16 h-16 rounded-lg object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                            <div>
                              <div className="text-white font-medium">{order.items} items</div>
                              <div className="text-2xl font-bold text-white">₹{order.total.toLocaleString()}</div>
                            </div>
                          </div>
                          <ChevronRight className="text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-200" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "settings" && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-bold text-white">Account Settings</h2>

                  {/* Personal Information */}
                  <div className="bg-zinc-800 rounded-xl p-6">
                    <h3 className="text-lg font-bold mb-6 text-white flex items-center gap-2">
                      <User size={20} />
                      Personal Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-400 text-sm font-medium mb-2">First Name</label>
                        <input
                          type="text"
                          value={userProfile.firstName}
                          onChange={(e) => handleProfileChange("firstName", e.target.value)}
                          className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-3 text-white focus:border-white focus:outline-none transition-colors hover:border-gray-400"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-sm font-medium mb-2">Last Name</label>
                        <input
                          type="text"
                          value={userProfile.lastName}
                          onChange={(e) => handleProfileChange("lastName", e.target.value)}
                          className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-3 text-white focus:border-white focus:outline-none transition-colors hover:border-gray-400"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-sm font-medium mb-2">Email</label>
                        <input
                          type="email"
                          value={userProfile.email}
                          onChange={(e) => handleProfileChange("email", e.target.value)}
                          className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-3 text-white focus:border-white focus:outline-none transition-colors hover:border-gray-400"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-sm font-medium mb-2">Phone</label>
                        <input
                          type="tel"
                          value={userProfile.phone}
                          onChange={(e) => handleProfileChange("phone", e.target.value)}
                          className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-3 text-white focus:border-white focus:outline-none transition-colors hover:border-gray-400"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-sm font-medium mb-2">Date of Birth</label>
                        <input
                          type="date"
                          value={userProfile.dateOfBirth}
                          onChange={(e) => handleProfileChange("dateOfBirth", e.target.value)}
                          className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-3 text-white focus:border-white focus:outline-none transition-colors hover:border-gray-400"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-sm font-medium mb-2">Gender</label>
                        <select
                          value={userProfile.gender}
                          onChange={(e) => handleProfileChange("gender", e.target.value)}
                          className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-3 text-white focus:border-white focus:outline-none transition-colors hover:border-gray-400"
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                          <option value="prefer-not-to-say">Prefer not to say</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-gray-400 text-sm font-medium mb-2">Bio</label>
                        <textarea
                          value={userProfile.bio}
                          onChange={(e) => handleProfileChange("bio", e.target.value)}
                          rows={3}
                          className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-3 text-white focus:border-white focus:outline-none transition-colors hover:border-gray-400 resize-none"
                          placeholder="Tell us about yourself..."
                        />
                      </div>
                    </div>

                    <div className="flex justify-end mt-6">
                      <button
                        onClick={handleSaveProfile}
                        disabled={saveStatus === "saving"}
                        className="bg-white text-black px-6 py-3 rounded-lg font-bold hover:bg-gray-200 transition-all duration-200 hover:scale-105 disabled:opacity-50 flex items-center gap-2"
                      >
                        <Save size={16} />
                        {saveStatus === "saving" ? "Saving..." : "Save Profile"}
                      </button>
                    </div>
                  </div>

                  {/* Addresses */}
                  <div className="bg-zinc-800 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <MapPin size={20} />
                        Addresses
                      </h3>
                      <button
                        onClick={addAddress}
                        className="bg-white text-black px-4 py-2 rounded-lg font-bold hover:bg-gray-200 transition-all duration-200 hover:scale-105 text-sm"
                      >
                        Add Address
                      </button>
                    </div>

                    <div className="space-y-4">
                      {addresses.map((address) => (
                        <div key={address.id} className="bg-zinc-700 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-white">{address.name}</span>
                                {address.isDefault && (
                                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                    Default
                                  </span>
                                )}
                              </div>
                              <div className="text-gray-400 text-sm">
                                {address.street}, {address.city}, {address.state} {address.zipCode}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {!address.isDefault && (
                                <button
                                  onClick={() => setDefaultAddress(address.id)}
                                  className="text-gray-400 hover:text-white text-xs"
                                >
                                  Set Default
                                </button>
                              )}
                              <button
                                onClick={() => removeAddress(address.id)}
                                className="text-red-400 hover:text-red-300"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="bg-zinc-800 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <CreditCard size={20} />
                        Payment Methods
                      </h3>
                      <button
                        onClick={addPaymentMethod}
                        className="bg-white text-black px-4 py-2 rounded-lg font-bold hover:bg-gray-200 transition-all duration-200 hover:scale-105 text-sm"
                      >
                        Add Payment
                      </button>
                    </div>

                    <div className="space-y-4">
                      {paymentMethods.map((method) => (
                        <div key={method.id} className="bg-zinc-700 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-zinc-600 rounded-lg flex items-center justify-center">
                                <CreditCard size={20} className="text-gray-400" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-white">{method.name}</span>
                                  {method.isDefault && (
                                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                      Default
                                    </span>
                                  )}
                                </div>
                                {method.expiryDate && (
                                  <div className="text-gray-400 text-sm">Expires {method.expiryDate}</div>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {!method.isDefault && (
                                <button
                                  onClick={() => setDefaultPaymentMethod(method.id)}
                                  className="text-gray-400 hover:text-white text-xs"
                                >
                                  Set Default
                                </button>
                              )}
                              <button
                                onClick={() => removePaymentMethod(method.id)}
                                className="text-red-400 hover:text-red-300"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Security */}
                  <div className="bg-zinc-800 rounded-xl p-6">
                    <h3 className="text-lg font-bold mb-6 text-white flex items-center gap-2">
                      <Lock size={20} />
                      Security
                    </h3>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-gray-400 text-sm font-medium mb-2">Current Password</label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={passwords.current}
                            onChange={(e) => handlePasswordChange("current", e.target.value)}
                            placeholder="Enter current password"
                            className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-3 pr-12 text-white focus:border-white focus:outline-none transition-colors hover:border-gray-400"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                          >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-gray-400 text-sm font-medium mb-2">New Password</label>
                          <div className="relative">
                            <input
                              type={showNewPassword ? "text" : "password"}
                              value={passwords.new}
                              onChange={(e) => handlePasswordChange("new", e.target.value)}
                              placeholder="Enter new password"
                              className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-3 pr-12 text-white focus:border-white focus:outline-none transition-colors hover:border-gray-400"
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            >
                              {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-gray-400 text-sm font-medium mb-2">Confirm Password</label>
                          <div className="relative">
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              value={passwords.confirm}
                              onChange={(e) => handlePasswordChange("confirm", e.target.value)}
                              placeholder="Confirm new password"
                              className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-3 pr-12 text-white focus:border-white focus:outline-none transition-colors hover:border-gray-400"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            >
                              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-zinc-700 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Shield className="text-blue-400" size={20} />
                          <div>
                            <div className="font-medium text-white">Two-Factor Authentication</div>
                            <div className="text-sm text-gray-400">Add an extra layer of security</div>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={appSettings.twoFactorAuth}
                            onChange={() => handleAppSettingToggle("twoFactorAuth")}
                            className="sr-only peer"
                          />
                          <div className="relative w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white"></div>
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-end mt-6">
                      <button
                        onClick={handleSavePassword}
                        disabled={saveStatus === "saving" || !passwords.current || !passwords.new || !passwords.confirm}
                        className="bg-white text-black px-6 py-3 rounded-lg font-bold hover:bg-gray-200 transition-all duration-200 hover:scale-105 disabled:opacity-50 flex items-center gap-2"
                      >
                        <Save size={16} />
                        {saveStatus === "saving" ? "Updating..." : "Update Password"}
                      </button>
                    </div>
                  </div>

                  {/* Notifications */}
                  <div className="bg-zinc-800 rounded-xl p-6">
                    <h3 className="text-lg font-bold mb-6 text-white flex items-center gap-2">
                      <Bell size={20} />
                      Notifications
                    </h3>

                    <div className="space-y-4">
                      {Object.entries(notifications).map(([key, value]) => {
                        const labels = {
                          orderUpdates: "Order updates",
                          newProducts: "New product releases",
                          specialOffers: "Special offers",
                          marketingEmails: "Marketing emails",
                          smsNotifications: "SMS notifications",
                          pushNotifications: "Push notifications",
                        }

                        const icons = {
                          orderUpdates: Package,
                          newProducts: Bell,
                          specialOffers: TrendingUp,
                          marketingEmails: Mail,
                          smsNotifications: Smartphone,
                          pushNotifications: Bell,
                        }

                        const Icon = icons[key as keyof typeof icons]

                        return (
                          <div
                            key={key}
                            className="flex items-center justify-between p-4 bg-zinc-700 rounded-lg hover:bg-zinc-600 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <Icon className="text-gray-400" size={20} />
                              <span className="text-white font-medium">{labels[key as keyof typeof labels]}</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={value}
                                onChange={() => handleNotificationToggle(key as keyof NotificationSettings)}
                                className="sr-only peer"
                              />
                              <div className="relative w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white"></div>
                            </label>
                          </div>
                        )
                      })}
                    </div>

                    <div className="flex justify-end mt-6">
                      <button
                        onClick={() => handleSaveSettings("notification")}
                        disabled={saveStatus === "saving"}
                        className="bg-white text-black px-6 py-3 rounded-lg font-bold hover:bg-gray-200 transition-all duration-200 hover:scale-105 disabled:opacity-50 flex items-center gap-2"
                      >
                        <Save size={16} />
                        {saveStatus === "saving" ? "Saving..." : "Save Preferences"}
                      </button>
                    </div>
                  </div>

                  {/* Privacy Settings */}
                  <div className="bg-zinc-800 rounded-xl p-6">
                    <h3 className="text-lg font-bold mb-6 text-white flex items-center gap-2">
                      <Shield size={20} />
                      Privacy & Data
                    </h3>

                    <div className="space-y-4">
                      <div className="p-4 bg-zinc-700 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium">Profile Visibility</span>
                          <select
                            value={privacySettings.profileVisibility}
                            onChange={(e) =>
                              setPrivacySettings((prev) => ({
                                ...prev,
                                profileVisibility: e.target.value as "public" | "private" | "friends",
                              }))
                            }
                            className="bg-zinc-600 border border-zinc-500 rounded px-3 py-1 text-white text-sm"
                          >
                            <option value="public">Public</option>
                            <option value="friends">Friends Only</option>
                            <option value="private">Private</option>
                          </select>
                        </div>
                        <div className="text-sm text-gray-400">Control who can see your profile information</div>
                      </div>

                      {Object.entries(privacySettings)
                        .filter(([key]) => key !== "profileVisibility")
                        .map(([key, value]) => {
                          const labels = {
                            showEmail: "Show email address",
                            showPhone: "Show phone number",
                            dataCollection: "Allow data collection for analytics",
                            analytics: "Share usage analytics",
                          }

                          return (
                            <div
                              key={key}
                              className="flex items-center justify-between p-4 bg-zinc-700 rounded-lg hover:bg-zinc-600 transition-colors"
                            >
                              <span className="text-white font-medium">{labels[key as keyof typeof labels]}</span>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={value}
                                  onChange={() => handlePrivacyToggle(key as keyof PrivacySettings)}
                                  className="sr-only peer"
                                />
                                <div className="relative w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white"></div>
                              </label>
                            </div>
                          )
                        })}
                    </div>

                    <div className="flex justify-end mt-6">
                      <button
                        onClick={() => handleSaveSettings("privacy")}
                        disabled={saveStatus === "saving"}
                        className="bg-white text-black px-6 py-3 rounded-lg font-bold hover:bg-gray-200 transition-all duration-200 hover:scale-105 disabled:opacity-50 flex items-center gap-2"
                      >
                        <Save size={16} />
                        {saveStatus === "saving" ? "Saving..." : "Save Privacy Settings"}
                      </button>
                    </div>
                  </div>

                  {/* App Settings */}
                  <div className="bg-zinc-800 rounded-xl p-6">
                    <h3 className="text-lg font-bold mb-6 text-white flex items-center gap-2">
                      <Settings size={20} />
                      App Preferences
                    </h3>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-zinc-700 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white font-medium flex items-center gap-2">
                              {appSettings.theme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
                              Theme
                            </span>
                            <select
                              value={appSettings.theme}
                              onChange={(e) =>
                                setAppSettings((prev) => ({
                                  ...prev,
                                  theme: e.target.value as "light" | "dark" | "auto",
                                }))
                              }
                              className="bg-zinc-600 border border-zinc-500 rounded px-3 py-1 text-white text-sm"
                            >
                              <option value="light">Light</option>
                              <option value="dark">Dark</option>
                              <option value="auto">Auto</option>
                            </select>
                          </div>
                        </div>

                        <div className="p-4 bg-zinc-700 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white font-medium flex items-center gap-2">
                              <Globe size={16} />
                              Language
                            </span>
                            <select
                              value={appSettings.language}
                              onChange={(e) => setAppSettings((prev) => ({ ...prev, language: e.target.value }))}
                              className="bg-zinc-600 border border-zinc-500 rounded px-3 py-1 text-white text-sm"
                            >
                              <option value="en">English</option>
                              <option value="hi">Hindi</option>
                              <option value="es">Spanish</option>
                              <option value="fr">French</option>
                            </select>
                          </div>
                        </div>

                        <div className="p-4 bg-zinc-700 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white font-medium">Currency</span>
                            <select
                              value={appSettings.currency}
                              onChange={(e) => setAppSettings((prev) => ({ ...prev, currency: e.target.value }))}
                              className="bg-zinc-600 border border-zinc-500 rounded px-3 py-1 text-white text-sm"
                            >
                              <option value="INR">INR (₹)</option>
                              <option value="USD">USD ($)</option>
                              <option value="EUR">EUR (€)</option>
                              <option value="GBP">GBP (£)</option>
                            </select>
                          </div>
                        </div>

                        <div className="p-4 bg-zinc-700 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white font-medium">Timezone</span>
                            <select
                              value={appSettings.timezone}
                              onChange={(e) => setAppSettings((prev) => ({ ...prev, timezone: e.target.value }))}
                              className="bg-zinc-600 border border-zinc-500 rounded px-3 py-1 text-white text-sm"
                            >
                              <option value="Asia/Kolkata">Asia/Kolkata</option>
                              <option value="America/New_York">America/New_York</option>
                              <option value="Europe/London">Europe/London</option>
                              <option value="Asia/Tokyo">Asia/Tokyo</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-zinc-700 rounded-lg hover:bg-zinc-600 transition-colors">
                        <span className="text-white font-medium">Auto-save preferences</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={appSettings.autoSave}
                            onChange={() => handleAppSettingToggle("autoSave")}
                            className="sr-only peer"
                          />
                          <div className="relative w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white"></div>
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-end mt-6">
                      <button
                        onClick={() => handleSaveSettings("app")}
                        disabled={saveStatus === "saving"}
                        className="bg-white text-black px-6 py-3 rounded-lg font-bold hover:bg-gray-200 transition-all duration-200 hover:scale-105 disabled:opacity-50 flex items-center gap-2"
                      >
                        <Save size={16} />
                        {saveStatus === "saving" ? "Saving..." : "Save App Settings"}
                      </button>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6">
                    <h3 className="text-lg font-bold mb-6 text-red-400 flex items-center gap-2">
                      <AlertCircle size={20} />
                      Danger Zone
                    </h3>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-red-900/30 rounded-lg">
                        <div>
                          <div className="font-medium text-white">Download Your Data</div>
                          <div className="text-sm text-gray-400">Get a copy of all your account data</div>
                        </div>
                        <button
                          onClick={downloadData}
                          className="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-500 transition-colors flex items-center gap-2"
                        >
                          <Download size={16} />
                          Download
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-red-900/30 rounded-lg">
                        <div>
                          <div className="font-medium text-white">Delete Account</div>
                          <div className="text-sm text-gray-400">Permanently delete your account and all data</div>
                        </div>
                        <button
                          onClick={deleteAccount}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
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
