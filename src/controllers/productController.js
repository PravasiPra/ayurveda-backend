const supabase = require('../config/supabase')

// GET ALL PRODUCTS
exports.getProducts = async (req, res) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')

  if (error) return res.status(400).json(error)

  res.json(data)
}

// GET PRODUCT BY ID
exports.getProductById = async (req, res) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', req.params.id)
    .single()

  if (error) return res.status(400).json(error)

  res.json(data)
}