const supabase = require('../config/supabase')

// ================= SIGNUP =================
exports.signup = async (req, res) => {
  try {
    const { email, password, full_name } = req.body

    // 1️⃣ Create user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    // Safety check
    if (!data.user) {
      return res.status(400).json({ error: "User not returned from Supabase" })
    }

    // 2️⃣ Create profile row in profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: data.user.id,      // MUST match auth.users id
          email: email,
          full_name: full_name,
          created_at: new Date()
        }
      ])

    if (profileError) {
      return res.status(400).json({
        error: "User created but profile failed",
        details: profileError.message
      })
    }

    res.json({
      message: "User + Profile created successfully",
      user_id: data.user.id
    })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}


// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.json({
      message: "Login successful",
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      user: data.user
    })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}