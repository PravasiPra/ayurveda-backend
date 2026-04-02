const supabase = require('../config/supabase')

// SIGNUP
exports.signup = async (req, res) => {
  try {
    const { email, password, full_name } = req.body

    // 1️⃣ Create user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) return res.status(400).json({ error: error.message })

    // 2️⃣ Create profile row
    await supabase.from('profiles').insert({
      id: data.user.id,
      full_name
    })

    res.json({
      message: "User created successfully",
      user: data.user
    })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) return res.status(400).json({ error: error.message })

    res.json({
      message: "Login successful",
      session: data.session
    })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}