import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helpers
export const signUp = async (email, password, name) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  
  if (error) throw error
  
  // Create user profile
  if (data.user) {
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: data.user.id,
        email: data.user.email,
        name
      })
    
    if (profileError) throw profileError
  }
  
  return data
}

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) throw error
  return data
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// Business helpers
export const getBusinessByQRCode = async (qrCode) => {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('qr_code', qrCode)
    .single()
  
  if (error) throw error
  return data
}

// Feedback helpers
export const submitFeedback = async (businessId, rating, comment = '') => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  
  const { data, error } = await supabase
    .from('feedback')
    .insert({
      user_id: user.id,
      business_id: businessId,
      rating,
      comment
    })
    .select()
    .single()
  
  if (error) throw error
  
  // Add stamp
  const { error: stampError } = await supabase
    .from('stamps')
    .insert({
      user_id: user.id,
      business_id: businessId,
      feedback_id: data.id
    })
  
  if (stampError) throw stampError
  
  return data
}

// Stamps helpers
export const getUserStamps = async (businessId = null) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  
  let query = supabase
    .from('stamps')
    .select(`
      *,
      businesses (
        id,
        name,
        reward_threshold,
        reward_description
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  
  if (businessId) {
    query = query.eq('business_id', businessId)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  return data
}

export const getStampCount = async (businessId) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  
  const { count, error } = await supabase
    .from('stamps')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('business_id', businessId)
  
  if (error) throw error
  return count || 0
}

// Rewards helpers
export const claimReward = async (businessId) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  
  // Get business info
  const business = await getBusinessByQRCode()
  const business_data = await supabase
    .from('businesses')
    .select('*')
    .eq('id', businessId)
    .single()
  
  if (business_data.error) throw business_data.error
  
  const threshold = business_data.data.reward_threshold
  
  // Check if user has enough stamps
  const stampCount = await getStampCount(businessId)
  if (stampCount < threshold) {
    throw new Error(`Du brauchst ${threshold} Stempel für eine Belohnung`)
  }
  
  // Claim reward
  const { data, error } = await supabase
    .from('rewards_claimed')
    .insert({
      user_id: user.id,
      business_id: businessId,
      stamps_used: threshold
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const getUserRewards = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  
  const { data, error } = await supabase
    .from('rewards_claimed')
    .select(`
      *,
      businesses (
        name,
        reward_description
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}