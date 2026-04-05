const supabase = require('../config/supabase')

// GET ALL PRODUCTS AND BEST SELLING PRODUCTS
exports.getProducts = async (req, res) => {
  try {

    // Get all products with category
    const { data: rawProducts, error: productsError } = await supabase
      .from('products')
      .select(`*,product_categories!products_category_id_fkey (id,name)`)

    if (productsError) throw productsError

    // Transform images columns → images array
    const products = rawProducts.map(product => {

      const images = [
        product.image_url,
        product.image_url2,
        product.image_url3,
        product.image_url4,
        product.image_url5
      ].filter(Boolean)   // removes null / empty values

      // remove old columns and create new object
      return {
        ...product,
        images,
        image_url: undefined,
        image_url2: undefined,
        image_url3: undefined,
        image_url4: undefined,
        image_url5: undefined
      }
    })

    // 2️⃣ Get best sellers from VIEW
    const { data: bestSellingRaw, error: bestError } = await supabase
      .from('best_selling_products')
      .select('*')
      .limit(5)

    if (bestError) throw bestError

    // Merge product details with sales count
    const bestSelling = products
      .filter(p => bestSellingRaw.some(b => b.product_id === p.id))
      .map(product => {
        const stats = bestSellingRaw.find(b => b.product_id === product.id)
        return {
          ...product,
          total_sold: stats.total_sold
        }
      })

       // 3️⃣ Get banner images from storage bucket
    const { data: files, error: bannerError } = await supabase
      .storage
      .from('banners')
      .list('', { limit: 100 })

    if (bannerError) throw bannerError

    const banners = files.map(file => {
      const { data } = supabase
        .storage
        .from('banners')
        .getPublicUrl(file.name)

      return data.publicUrl
    })

    // GROUP PRODUCTS BY CATEGORY
    const categoryProducts = {}

    products.forEach(product => {
      const categoryName = product.product_categories?.name || "Other"

      if (!categoryProducts[categoryName]) {
        categoryProducts[categoryName] = []
      }

      categoryProducts[categoryName].push(product)
    })

    // 4️⃣ Final response
    res.json({
      banners,
      products,
      bestSelling,
      categoryProducts
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