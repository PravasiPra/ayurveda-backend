const supabase = require('../config/supabase')

// ADD TO CART
exports.addToCart = async (req, res) => {
  try {
    const user_id = req.user.id
    const { product_id, quantity } = req.body

    const { data, error } = await supabase
      .from('cart_items')
      .insert({ user_id, product_id, quantity })

    if (error) return res.status(400).json(error)

    res.json({ message: "Added to cart", data })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// GET USER CART
exports.getCart = async (req, res) => {
  try {
    const user_id = req.user.id

    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        id,
        quantity,
        products (*)
      `)
      .eq('user_id', user_id)

    if (error) return res.status(400).json(error)

    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// REMOVE FROM CART
exports.removeFromCart = async (req, res) => {
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', req.params.id)

    if (error) return res.status(400).json(error)

    res.json({ message: "Item removed" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}