const supabase = require('../config/supabase')

// GET ALL PRODUCTS AND BEST SELLING PRODUCTS
exports.getProducts = async (req, res) => {
  try {
    // 1️⃣ Get all products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')

    if (productsError) throw productsError

    // 2️⃣ Get best sellers from VIEW
    const { data: bestSellingRaw, error: bestError } = await supabase
      .from('best_selling_products')
      .select('*')
      .limit(5)

    if (bestError) throw bestError

    // 3️⃣ Merge product details with sales count
    const bestSelling = products
      .filter(p => bestSellingRaw.some(b => b.product_id === p.id))
      .map(product => {
        const stats = bestSellingRaw.find(b => b.product_id === product.id)
        return {
          ...product,
          total_sold: stats.total_sold
        }
      })

    // 4️⃣ Final response
    res.json({
      products,
      bestSelling
    })

  } catch (err) {
    res.status(400).json({ error: err.message })
  }
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