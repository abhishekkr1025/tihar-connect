import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { ShoppingCart, Heart, Users, Package, CheckCircle, Clock, XCircle, Menu, X } from 'lucide-react'
import './App.css'

// Sample product data
const PRODUCTS = [
  {
    id: 1,
    name: 'Natural Handmade Soap',
    category: 'Personal Care',
    price: 50,
    unit: 'Jail No. 2 - Chemical Unit',
    image: './oil.jpg',
    description: 'Pure natural soap made with organic ingredients',
    stock: 50
  },
  {
    id: 2,
    name: 'Hand Sanitizer (500ml)',
    category: 'Personal Care',
    price: 80,
    unit: 'Jail No. 2 - Chemical Unit',
    image: 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=400&h=300&fit=crop',
    description: 'Effective hand sanitizer with 70% alcohol content',
    stock: 100
  },
  {
    id: 3,
    name: 'Fresh Dairy Milk (1L)',
    category: 'Dairy Products',
    price: 60,
    unit: 'Jail No. 3 - Dairy Unit',
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=300&fit=crop',
    description: 'Fresh pasteurized milk from our dairy farm',
    stock: 30
  },
  {
    id: 4,
    name: 'Pure Ghee (500g)',
    category: 'Dairy Products',
    price: 350,
    unit: 'Jail No. 3 - Dairy Unit',
    image: 'https://images.unsplash.com/photo-1623428454614-abaf00244e52?w=400&h=300&fit=crop',
    description: 'Traditional pure ghee made from cow milk',
    stock: 20
  },
  {
    id: 5,
    name: 'Cotton Kurta',
    category: 'Textiles',
    price: 450,
    unit: 'Jail No. 1 - Tailoring Unit',
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=300&fit=crop',
    description: 'Comfortable cotton kurta, hand-stitched by skilled artisans',
    stock: 15
  },
  {
    id: 6,
    name: 'Handwoven Carpet',
    category: 'Textiles',
    price: 2500,
    unit: 'Jail No. 1 - Weaving Unit',
    image: 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=400&h=300&fit=crop',
    description: 'Beautiful handwoven carpet with traditional designs',
    stock: 5
  },
  {
    id: 7,
    name: 'Wooden Office Chair',
    category: 'Furniture',
    price: 3500,
    unit: 'Jail No. 2 - Carpentry Unit',
    image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400&h=300&fit=crop',
    description: 'Sturdy wooden chair perfect for office use',
    stock: 8
  },
  {
    id: 8,
    name: 'Mango Pickle (500g)',
    category: 'Food Products',
    price: 120,
    unit: 'Jail No. 4 - Food Processing Unit',
    image: 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=400&h=300&fit=crop',
    description: 'Traditional mango pickle with authentic spices',
    stock: 40
  }
]

// Mock orders for admin
const INITIAL_ORDERS = [
  {
    id: 'ORD001',
    customer: 'Rajesh Kumar',
    items: [{ name: 'Natural Handmade Soap', quantity: 5 }],
    total: 250,
    status: 'pending',
    date: '2025-10-10'
  },
  {
    id: 'ORD002',
    customer: 'Priya Sharma',
    items: [{ name: 'Cotton Kurta', quantity: 2 }],
    total: 900,
    status: 'pending',
    date: '2025-10-11'
  }
]

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <MainApp />
      </div>
    </Router>
  )
}

function MainApp() {
  const [cart, setCart] = useState([])
  const [orders, setOrders] = useState(INITIAL_ORDERS)
  const [userRole, setUserRole] = useState('customer') // customer, admin, ngo
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id)
    if (existing) {
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ))
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
  }

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      setCart(cart.map(item => 
        item.id === productId ? { ...item, quantity } : item
      ))
    }
  }

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <>
      <Header 
        cartCount={cartCount} 
        userRole={userRole} 
        setUserRole={setUserRole}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      
      <Routes>
        <Route path="/" element={<HomePage addToCart={addToCart} />} />
        <Route path="/products" element={<ProductsPage products={PRODUCTS} addToCart={addToCart} />} />
        <Route path="/cart" element={
          <CartPage 
            cart={cart} 
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
            cartTotal={cartTotal}
          />
        } />
        <Route path="/donate" element={<DonatePage />} />
        <Route path="/admin" element={
          <AdminPage orders={orders} setOrders={setOrders} products={PRODUCTS} />
        } />
        <Route path="/about" element={<AboutPage />} />
      </Routes>

      <Footer />
    </>
  )
}

function Header({ cartCount, userRole, setUserRole, mobileMenuOpen, setMobileMenuOpen }) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">TC</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Tihar Connect</h1>
              <p className="text-xs text-gray-500">Supporting Rehabilitation</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-orange-600 transition">Home</Link>
            <Link to="/products" className="text-gray-700 hover:text-orange-600 transition">Products</Link>
            <Link to="/donate" className="text-gray-700 hover:text-orange-600 transition flex items-center gap-1">
              <Heart className="w-4 h-4" />
              Donate
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-orange-600 transition">About</Link>
            {userRole === 'admin' && (
              <Link to="/admin" className="text-gray-700 hover:text-orange-600 transition">Admin</Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {/* Role Switcher */}
            <select 
              value={userRole} 
              onChange={(e) => setUserRole(e.target.value)}
              className="hidden md:block text-sm border border-gray-300 rounded-md px-2 py-1"
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
              <option value="ngo">NGO</option>
            </select>

            <Link to="/cart" className="relative">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">Cart</span>
                {cartCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-orange-600">{cartCount}</Badge>
                )}
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 space-y-2">
            <Link to="/" className="block py-2 text-gray-700 hover:text-orange-600" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/products" className="block py-2 text-gray-700 hover:text-orange-600" onClick={() => setMobileMenuOpen(false)}>Products</Link>
            <Link to="/donate" className="block py-2 text-gray-700 hover:text-orange-600" onClick={() => setMobileMenuOpen(false)}>Donate</Link>
            <Link to="/about" className="block py-2 text-gray-700 hover:text-orange-600" onClick={() => setMobileMenuOpen(false)}>About</Link>
            {userRole === 'admin' && (
              <Link to="/admin" className="block py-2 text-gray-700 hover:text-orange-600" onClick={() => setMobileMenuOpen(false)}>Admin</Link>
            )}
            <select 
              value={userRole} 
              onChange={(e) => setUserRole(e.target.value)}
              className="w-full text-sm border border-gray-300 rounded-md px-2 py-2 mt-2"
            >
              <option value="customer">Customer View</option>
              <option value="admin">Admin View</option>
              <option value="ngo">NGO View</option>
            </select>
          </nav>
        )}
      </div>
    </header>
  )
}

function HomePage({ addToCart }) {
  const navigate = useNavigate()

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Shop with Purpose
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-orange-100">
            Every purchase supports rehabilitation and transforms lives
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-orange-600 hover:bg-gray-100"
              onClick={() => navigate('/products')}
            >
              Browse Products
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white text-orange-600 hover:bg-gray-100"
              onClick={() => navigate('/donate')}
            >
              <Heart className="w-5 h-5 mr-2" />
              Support Rehabilitation
            </Button>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">400+</div>
              <div className="text-gray-600">Inmates Trained</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">8</div>
              <div className="text-gray-600">Product Categories</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">ISO</div>
              <div className="text-gray-600">9001:2015 Certified</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">100%</div>
              <div className="text-gray-600">Quality Assured</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-6">
          <h3 className="text-3xl font-bold text-center mb-12">Featured Products</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCTS.slice(0, 4).map(product => (
              <ProductCard key={product.id} product={product} addToCart={addToCart} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Button onClick={() => navigate('/products')}>View All Products</Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center mb-12">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-8 h-8 text-orange-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Browse & Order</h4>
              <p className="text-gray-600">
                Choose from quality products made by skilled inmates
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-orange-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Admin Approval</h4>
              <p className="text-gray-600">
                Jail authorities verify and approve all orders for legal compliance
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-orange-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Production & Delivery</h4>
              <p className="text-gray-600">
                Products are crafted with care and delivered to your doorstep
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-orange-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold mb-4">Support Rehabilitation Programs</h3>
          <p className="text-lg text-gray-700 mb-8">
            Your donations help provide skill training, behavioral correction programs, and post-release support for inmates
          </p>
          <Button size="lg" onClick={() => navigate('/donate')} className="bg-orange-600 hover:bg-orange-700">
            <Heart className="w-5 h-5 mr-2" />
            Make a Donation
          </Button>
        </div>
      </section>
    </div>
  )
}

function ProductCard({ product, addToCart }) {
  return (
    <Card className="hover:shadow-2xl transition-transform transform hover:scale-105 rounded-2xl overflow-hidden">
      <CardHeader className="p-0">
        <div className="w-full aspect-square overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <Badge className="mb-3 bg-orange-100 text-orange-700 text-sm px-3 py-1 rounded-full">
          {product.category}
        </Badge>

        <CardTitle className="text-xl font-semibold mb-2">{product.name}</CardTitle>
        <CardDescription className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </CardDescription>

        <p className="text-xs text-gray-500 mb-3">{product.unit}</p>

        <div className="flex justify-between items-center mb-3">
          <span className="text-2xl font-bold text-orange-600">₹{product.price}</span>
          <span className="text-sm text-gray-500">{product.stock} in stock</span>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button 
          className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2.5 rounded-lg font-medium transition-colors"
          onClick={() => addToCart(product)}
          disabled={product.stock === 0}
        >
          {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </CardFooter>
    </Card>
  );
}


function ProductsPage({ products, addToCart }) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const categories = ['All', ...new Set(products.map(p => p.category))]
  
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold mb-8">Our Products</h2>
      
      {/* Filters */}
      <div className="mb-8 space-y-4">
        <Input 
          placeholder="Search products..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(cat)}
              className={selectedCategory === cat ? 'bg-orange-600 hover:bg-orange-700' : ''}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} addToCart={addToCart} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found matching your criteria</p>
        </div>
      )}
    </div>
  )
}

function CartPage({ cart, removeFromCart, updateQuantity, cartTotal }) {
  const navigate = useNavigate()
  const [orderPlaced, setOrderPlaced] = useState(false)

  const handleCheckout = () => {
    setOrderPlaced(true)
    setTimeout(() => {
      navigate('/')
    }, 3000)
  }

  if (orderPlaced) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold mb-4">Order Submitted!</h2>
        <p className="text-gray-600 mb-4">
          Your order has been sent to jail authorities for approval.
          You will be notified once it's approved and enters production.
        </p>
        <p className="text-sm text-gray-500">Redirecting to homepage...</p>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ShoppingCart className="w-20 h-20 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Button onClick={() => navigate('/products')}>Browse Products</Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold mb-8">Shopping Cart</h2>
      
      <div className="space-y-4 mb-8">
        {cart.map(item => (
          <Card key={item.id}>
            <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
              <img 
                src={item.image} 
                alt={item.name}
                className="w-full sm:w-24 h-24 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.unit}</p>
                <p className="text-orange-600 font-bold mt-1">₹{item.price}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  -
                </Button>
                <span className="w-12 text-center">{item.quantity}</span>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{cartTotal}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Delivery</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-orange-600">₹{cartTotal}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full bg-orange-600 hover:bg-orange-700" 
            size="lg"
            onClick={handleCheckout}
          >
            Place Order (Pending Admin Approval)
          </Button>
        </CardFooter>
      </Card>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-900">
          <strong>Note:</strong> All orders are subject to approval by jail authorities to ensure legal compliance. 
          You will be notified once your order is approved and enters production.
        </p>
      </div>
    </div>
  )
}

function DonatePage() {
  const [donationAmount, setDonationAmount] = useState('')
  const [donationType, setDonationType] = useState('general')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  const programs = [
    {
      id: 'general',
      name: 'General Rehabilitation Fund',
      description: 'Support overall rehabilitation efforts including skill training and welfare programs'
    },
    {
      id: 'skill',
      name: 'Skill Training Programs',
      description: 'Fund vocational training in carpentry, tailoring, food processing, and more'
    },
    {
      id: 'behavioral',
      name: 'Behavioral Correction',
      description: 'Support counseling, therapy, and behavioral correction initiatives'
    },
    {
      id: 'education',
      name: 'Educational Programs',
      description: 'Provide educational resources and literacy programs for inmates'
    },
    {
      id: 'post-release',
      name: 'Post-Release Support',
      description: 'Help with job placement and reintegration after release'
    }
  ]

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <Heart className="w-20 h-20 text-red-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold mb-4">Thank You!</h2>
        <p className="text-gray-600">
          Your donation will make a real difference in transforming lives and supporting rehabilitation efforts.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold mb-4">Support Rehabilitation</h2>
      <p className="text-gray-600 mb-8">
        Your generous donations help provide skill training, educational programs, and post-release support for inmates.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Donation Form */}
        <Card>
          <CardHeader>
            <CardTitle>Make a Donation</CardTitle>
            <CardDescription>Choose a program to support</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select Program</label>
                <select 
                  value={donationType}
                  onChange={(e) => setDonationType(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  {programs.map(prog => (
                    <option key={prog.id} value={prog.id}>{prog.name}</option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 mt-1">
                  {programs.find(p => p.id === donationType)?.description}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Donation Amount (₹)</label>
                <Input 
                  type="number" 
                  placeholder="Enter amount"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  required
                  min="100"
                />
              </div>

              <div className="flex gap-2">
                {[500, 1000, 5000, 10000].map(amount => (
                  <Button
                    key={amount}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setDonationAmount(amount.toString())}
                  >
                    ₹{amount}
                  </Button>
                ))}
              </div>

              <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700">
                <Heart className="w-4 h-4 mr-2" />
                Donate Now
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Impact Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Impact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold">Skill Development</h4>
                  <p className="text-sm text-gray-600">Train inmates in valuable vocational skills</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold">Reduce Recidivism</h4>
                  <p className="text-sm text-gray-600">Help prevent return to criminal activities</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Heart className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold">Transform Lives</h4>
                  <p className="text-sm text-gray-600">Support successful reintegration into society</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tax Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Donations are eligible for tax exemption under Section 80G of the Income Tax Act. 
                You will receive a certificate for your contribution.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function AdminPage({ orders, setOrders, products }) {
  const [activeTab, setActiveTab] = useState('orders')

  const approveOrder = (orderId) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: 'approved' } : order
    ))
  }

  const rejectOrder = (orderId) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: 'rejected' } : order
    ))
  }

  const pendingOrders = orders.filter(o => o.status === 'pending')
  const approvedOrders = orders.filter(o => o.status === 'approved')
  const rejectedOrders = orders.filter(o => o.status === 'rejected')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold mb-8">Admin Dashboard</h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 font-medium ${activeTab === 'orders' ? 'border-b-2 border-orange-600 text-orange-600' : 'text-gray-600'}`}
        >
          Orders ({pendingOrders.length} pending)
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 font-medium ${activeTab === 'products' ? 'border-b-2 border-orange-600 text-orange-600' : 'text-gray-600'}`}
        >
          Products
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-2 font-medium ${activeTab === 'stats' ? 'border-b-2 border-orange-600 text-orange-600' : 'text-gray-600'}`}
        >
          Statistics
        </button>
      </div>

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Pending Orders</h3>
            {pendingOrders.length === 0 ? (
              <p className="text-gray-500">No pending orders</p>
            ) : (
              <div className="space-y-4">
                {pendingOrders.map(order => (
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{order.id}</CardTitle>
                          <CardDescription>Customer: {order.customer} | Date: {order.date}</CardDescription>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800">
                          <Clock className="w-3 h-3 mr-1" />
                          Pending
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span>{item.name}</span>
                            <span>Qty: {item.quantity}</span>
                          </div>
                        ))}
                        <div className="border-t pt-2 flex justify-between font-semibold">
                          <span>Total</span>
                          <span>₹{order.total}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button 
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => approveOrder(order.id)}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button 
                        variant="destructive"
                        className="flex-1"
                        onClick={() => rejectOrder(order.id)}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Approved Orders</h3>
            {approvedOrders.length === 0 ? (
              <p className="text-gray-500">No approved orders</p>
            ) : (
              <div className="space-y-4">
                {approvedOrders.map(order => (
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{order.id}</CardTitle>
                          <CardDescription>Customer: {order.customer}</CardDescription>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Approved
                        </Badge>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Product Inventory</h3>
            <Button className="bg-orange-600 hover:bg-orange-700">Add New Product</Button>
          </div>
          <div className="grid gap-4">
            {products.map(product => (
              <Card key={product.id}>
                <CardContent className="p-4 flex items-center gap-4">
                  <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded" />
                  <div className="flex-1">
                    <h4 className="font-semibold">{product.name}</h4>
                    <p className="text-sm text-gray-500">{product.unit}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-orange-600">₹{product.price}</p>
                    <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                  </div>
                  <Button variant="outline" size="sm">Edit</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Statistics Tab */}
      {activeTab === 'stats' && (
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-orange-600">{orders.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Pending Approval</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-yellow-600">{pendingOrders.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-blue-600">{products.length}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold mb-6">About Tihar Connect</h2>
      
      <div className="prose max-w-none space-y-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-3">Our Mission</h3>
            <p className="text-gray-700">
              Tihar Connect is a platform that bridges the gap between society and inmates undergoing rehabilitation. 
              We provide a marketplace for quality products made by skilled inmates while supporting their journey 
              towards reformation and successful reintegration into society.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-3">About Tihar Jail</h3>
            <p className="text-gray-700 mb-3">
              Tihar Jail is the largest prison complex in Asia, located in New Delhi. The Delhi Prison Administration 
              focuses on reforming and rehabilitating inmates by providing vocational training in various skilled trades.
            </p>
            <p className="text-gray-700">
              The Central Jail Factory, an ISO 9001:2015 certified establishment, engages around 400 inmates in 
              different production units including Carpentry, Chemical, Paper, Weaving, Tailoring, Food Processing, 
              and more.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-3">How Your Purchase Helps</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Provides inmates with valuable vocational skills for post-release employment</li>
              <li>• Contributes to victim compensation funds</li>
              <li>• Supports inmate families with earnings from their work</li>
              <li>• Reduces recidivism by offering dignified livelihood opportunities</li>
              <li>• Promotes social reintegration and rehabilitation</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-3">Quality Assurance</h3>
            <p className="text-gray-700">
              All products are manufactured using quality materials in hygienic conditions under the supervision 
              of trained staff. The Central Jail Factory maintains ISO 9001:2015 certification, ensuring consistent 
              quality standards across all product categories.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-3">Contact Information</h3>
            <div className="text-gray-700 space-y-1">
              <p><strong>Address:</strong> Central Jail Factory, Central Jail No.02, Tihar, New Delhi – 110064</p>
              <p><strong>Phone:</strong> +91-11-28522110</p>
              <p><strong>Email:</strong> Contact through official channels</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Tihar Connect</h3>
            <p className="text-gray-400 text-sm">
              Supporting rehabilitation through commerce and compassion
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li><Link to="/products" className="hover:text-white">Products</Link></li>
              <li><Link to="/donate" className="hover:text-white">Donate</Link></li>
              <li><Link to="/about" className="hover:text-white">About</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white">Refund Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <p className="text-sm text-gray-400">
              Central Jail Factory<br />
              Tihar, New Delhi – 110064<br />
              Phone: +91-11-28522110
            </p>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>© 2025 Tihar Connect. All rights reserved. ISO 9001:2015 Certified.</p>
        </div>
      </div>
    </footer>
  )
}

export default App

