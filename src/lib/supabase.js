import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase credentials are missing. Make sure to set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.');
}

export const supabase = createClient(
  supabaseUrl || 'https://your-supabase-url.supabase.co',
  supabaseKey || 'your-supabase-key'
);

// Authentication functions
export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
};

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
};

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
};

// User profile functions
export const createUserProfile = async (userId, profileData) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert([{ id: userId, ...profileData }])
    .select();
  
  if (error) throw error;
  return data[0];
};

export const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      // Profile not found, create a default one
      return createUserProfile(userId, {
        full_name: '',
        created_at: new Date().toISOString(),
      });
    }
    throw error;
  }
  
  return data;
};

export const updateUserProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select();
  
  if (error) throw error;
  return data[0];
};

// Subscription functions
export const getUserSubscription = async (userId) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      // No subscription found
      return null;
    }
    throw error;
  }
  
  return data;
};

export const createUserSubscription = async (subscriptionData) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .insert([subscriptionData])
    .select();
  
  if (error) throw error;
  return data[0];
};

export const updateUserSubscription = async (subscriptionId, updates) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .update(updates)
    .eq('id', subscriptionId)
    .select();
  
  if (error) throw error;
  return data[0];
};

// Image storage functions
export const uploadImage = async (bucket, path, file) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });
  
  if (error) throw error;
  return data;
};

export const getImageUrl = (bucket, path) => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};

export const deleteImage = async (bucket, path) => {
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw error;
};

// Image metadata functions
export const saveImageMetadata = async (imageData) => {
  const { data, error } = await supabase
    .from('images')
    .insert([imageData])
    .select();
  
  if (error) throw error;
  return data[0];
};

export const getImageMetadata = async (imageId) => {
  const { data, error } = await supabase
    .from('images')
    .select('*')
    .eq('id', imageId)
    .single();
  
  if (error) throw error;
  return data;
};

export const updateImageMetadata = async (imageId, updates) => {
  const { data, error } = await supabase
    .from('images')
    .update(updates)
    .eq('id', imageId)
    .select();
  
  if (error) throw error;
  return data[0];
};

export const deleteImageMetadata = async (imageId) => {
  const { error } = await supabase
    .from('images')
    .delete()
    .eq('id', imageId);
  
  if (error) throw error;
};

export const getUserImages = async (userId) => {
  const { data, error } = await supabase
    .from('images')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

