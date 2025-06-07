"use client"

import React, { useState, useRef, useCallback } from "react"

import {
  User,
  Heart,
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
  ShoppingCart,
  Check,
  AlertCircle,
} from "lucide-react"

interface Order {
  id: string
  date: string
  status: "delivered" | "processing" | "shipped"
  total: number
  items: number
  image: string
}

interface WishlistItem {
  id: string
  name: string
  price: number
  image: string
  inStock: boolean
}

interface UserProfile {
  firstName: string
  lastName: string
  email: string
  phone: string
  avatar: string
}

interface NotificationSettings {
  orderUpdates: boolean
  newProducts: boolean
  specialOffers: boolean
  marketingEmails: boolean
}

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview")
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")

  const fileInputRef = useRef<HTMLInputElement>(null)

  // User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>({
    firstName: "Alex",
    lastName: "Rodriguez",
    email: "alex@example.com",
    phone: "+91 98765 43210",
    avatar: "/api/placeholder/128/128",
  })

  // Password State
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  })

  // Notification Settings State
  const [notifications, setNotifications] = useState<NotificationSettings>({
    orderUpdates: true,
    newProducts: true,
    specialOffers: false,
    marketingEmails: false,
  })

  // Orders State
  const orders: Order[] = [
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
  ]

  // Wishlist State
  const [wishlist, setWishlist] = useState<WishlistItem[]>([
    {
      id: "W-001",
      name: "Warrior Combat Tee",
      price: 1999,
      image: "/api/placeholder/80/80",
      inStock: true,
    },
    {
      id: "W-002",
      name: "MMA Fighter Shorts",
      price: 2299,
      image: "/api/placeholder/80/80",
      inStock: false,
    },
  ])

  // Image Upload Handler
  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
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

  // Save Profile
  const handleSaveProfile = async () => {
    setSaveStatus("saving")

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    try {
      // Here you would make your actual API call
      console.log("Saving profile:", userProfile)
      setSaveStatus("saved")
      setIsEditing(false)
      setTimeout(() => setSaveStatus("idle"), 3000)
    } catch {
      setSaveStatus("error")
      setTimeout(() => setSaveStatus("idle"), 3000)
    }
  }

  // Save Password
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
      // Simulate API call
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

  // Save Notifications
  const handleSaveNotifications = async () => {
    setSaveStatus("saving")

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Notifications updated:", notifications)
      setSaveStatus("saved")
      setTimeout(() => setSaveStatus("idle"), 3000)
    } catch {
      setSaveStatus("error")
      setTimeout(() => setSaveStatus("idle"), 3000)
    }
  }

  // Wishlist Actions
  const removeFromWishlist = (id: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id))
  }

  const addToCart = (item: WishlistItem) => {
    if (!item.inStock) return

    // Simulate adding to cart
    console.log("Added to cart:", item.name)
    alert(`${item.name} added to cart!`)
  }

  const notifyWhenAvailable = (item: WishlistItem) => {
    console.log("Notify when available:", item.name)
    alert(`You'll be notified when ${item.name} is back in stock!`)
  }

  // Order Actions
  const viewOrderDetails = (orderId: string) => {
    console.log("Viewing order:", orderId)
    alert(`Opening order details for ${orderId}`)
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
    { id: "wishlist", label: "Wishlist", icon: Heart },
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
              <p className="text-gray-400 text-lg mb-4">Premium Member • Fighter Since 2023</p>

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
                  <div className="text-2xl font-bold text-white">{wishlist.length}</div>
                  <div className="text-sm text-gray-400">Wishlist</div>
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
                        onClick={() => setActiveTab("wishlist")}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <Heart className="text-purple-400" size={24} />
                          <span className="text-purple-400 text-sm font-medium">Items</span>
                        </div>
                        <div className="text-2xl font-bold text-white mb-1">{wishlist.length}</div>
                        <div className="text-gray-400 text-sm">Wishlist Items</div>
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

              {activeTab === "wishlist" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Wishlist</h2>
                    <div className="text-gray-400 text-sm">
                      {wishlist.length} {wishlist.length === 1 ? "item" : "items"}
                    </div>
                  </div>

                  {wishlist.length === 0 ? (
                    <div className="text-center py-12">
                      <Heart size={48} className="text-gray-600 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-400 mb-2">Your wishlist is empty</h3>
                      <p className="text-gray-500">Add items you love to keep track of them</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {wishlist.map((item, index) => (
                        <div
                          key={item.id}
                          className="bg-zinc-800 rounded-xl p-6 hover:bg-zinc-700 transition-all duration-300 group"
                          style={{
                            animationDelay: `${index * 0.1}s`,
                            animation: "bounceIn 0.6s ease-out forwards",
                            opacity: 0,
                          }}
                        >
                          <div className="relative mb-4">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              className="w-full h-32 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                            />
                            <button
                              onClick={() => removeFromWishlist(item.id)}
                              className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                            >
                              <Heart size={16} fill="currentColor" />
                            </button>
                          </div>

                          <h3 className="font-bold text-white mb-2 group-hover:text-gray-200 transition-colors">
                            {item.name}
                          </h3>
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-2xl font-bold text-white">₹{item.price.toLocaleString()}</span>
                            <span className={`text-sm font-medium ${item.inStock ? "text-green-400" : "text-red-400"}`}>
                              {item.inStock ? "In Stock" : "Out of Stock"}
                            </span>
                          </div>

                          <button
                            onClick={() => (item.inStock ? addToCart(item) : notifyWhenAvailable(item))}
                            className={`w-full py-3 rounded-lg font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
                              item.inStock
                                ? "bg-white text-black hover:bg-gray-200 hover:scale-105"
                                : "bg-gray-600 text-gray-400 hover:bg-gray-500"
                            }`}
                          >
                            {item.inStock ? (
                              <>
                                <ShoppingCart size={16} />
                                Add to Cart
                              </>
                            ) : (
                              <>
                                <Bell size={16} />
                                Notify When Available
                              </>
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
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

                  {/* Security */}
                  <div className="bg-zinc-800 rounded-xl p-6">
                    <h3 className="text-lg font-bold mb-6 text-white flex items-center gap-2">
                      <Settings size={20} />
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
                        onClick={handleSaveNotifications}
                        disabled={saveStatus === "saving"}
                        className="bg-white text-black px-6 py-3 rounded-lg font-bold hover:bg-gray-200 transition-all duration-200 hover:scale-105 disabled:opacity-50 flex items-center gap-2"
                      >
                        <Save size={16} />
                        {saveStatus === "saving" ? "Saving..." : "Save Preferences"}
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
        
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.3); }
          50% { opacity: 1; transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}

export default Profile
