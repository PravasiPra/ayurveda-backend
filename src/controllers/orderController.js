const supabase = require('../config/supabase')

// CHECKOUT
exports.checkout = async (req, res) => {
  try {
    const user_id = req.user.id

    // 1️⃣ Get cart items
    const { data: cartItems, error: cartError } = await supabase
      .from('cart_items')
      .select(`quantity, products(id, name, price)`)
      .eq('user_id', user_id)

    if (cartError) return res.status(400).json(cartError)
    if (!cartItems.length) return res.status(400).json({ error: "Cart is empty" })

    // 2️⃣ Calculate total price
    let total = 0
    cartItems.forEach(item => {
      total += item.products.price * item.quantity
    })

    // 3️⃣ Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({ user_id, total_price: total })
      .select()
      .single()

    if (orderError) return res.status(400).json(orderError)

    // 4️⃣ Insert order items
    const orderItems = cartItems.map(item => ({
      order_id: order.id,
      product_id: item.products.id,
      product_name: item.product.name,
      quantity: item.quantity,
      price: item.products.price
    }))

    await supabase.from('order_items').insert(orderItems)

    // 5️⃣ Clear cart
    await supabase.from('cart_items').delete().eq('user_id', user_id)

    res.json({ message: "Order placed successfully", order })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// GET USER ORDERS
exports.getOrders = async (req, res) => {
  const user_id = req.user.id

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        quantity,
        price,
        products (*)
      )
    `)
    .eq('user_id', user_id)

  if (error) return res.status(400).json(error)

  res.json(data)
}