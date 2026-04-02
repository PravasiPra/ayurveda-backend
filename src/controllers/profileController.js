const supabase = require('../config/supabase')

// GET PROFILE
exports.getProfile = async (req, res) => {
  const user_id = req.user.id

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user_id)
    .single()

  if (error) return res.status(400).json(error)

  res.json(data)
}

// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  const user_id = req.user.id
  const { full_name, phone, address, city, pincode } = req.body

  const { data, error } = await supabase
    .from('profiles')
    .update({ full_name, phone, address, city, pincode })
    .eq('id', user_id)
    .select()

  if (error) return res.status(400).json(error)

  res.json({ message: "Profile updated", data })
}