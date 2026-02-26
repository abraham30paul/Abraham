import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const { error } = await supabase
    .from('feedback')
    .insert([{ name, email, message }])

  if (error) {
    return res.status(500).json({ message: "Database error." });
  }

  return res.status(200).json({ message: "Feedback submitted successfully!" });
}
