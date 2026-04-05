const supabase = require('../config/supabase')

// GET ALL PRODUCTS AND BEST SELLING PRODUCTS
exports.getProducts = async (req, res) => {
  try {

    // 1️⃣ Get all products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')

    if (productsError) throw productsError

    // 2️⃣ Get best selling products (SQL aggregation)
    const { data: bestSellingRaw, error: bestError } = await supabase
      .from('order_items')
      .select(`
        product_id,
        product_name,
        total_sold:quantity.sum()
      `)
      .group('product_id, product_name')
      .order('total_sold', { ascending: false })
      .limit(5)

    if (bestError) throw bestError

    // 3️⃣ Get full product details of best sellers
    const bestSellingIds = bestSellingRaw.map(p => p.product_id)

    const bestSellingProducts = products.filter(p =>
      bestSellingIds.includes(p.id)
    )

    // 4️⃣ Attach sold count to product object
    const bestSellingFinal = bestSellingProducts.map(product => {
      const stats = bestSellingRaw.find(p => p.product_id === product.id)
      return {
        ...product,
        total_sold: stats.total_sold
      }
    })

    // 5️⃣ Final response
    res.json({
      products,
      bestSelling: bestSellingFinal
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