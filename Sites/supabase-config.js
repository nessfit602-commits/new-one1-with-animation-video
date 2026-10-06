/**
 * Supabase Client Configuration & Data Service for Adress Shoes
 */

// Global Supabase Credentials (Hardcoded)
window.SUPABASE_CONFIG = {
  url: 'https://nwakrwpqrxevsowcrsjp.supabase.co',
  key: 'sb_publishable_4W0xPyVrPM-ZqVRVZ8OfNw_eKe0mgN7'
};

// Local Storage Keys
const SUPABASE_URL_KEY = 'ADRESS_SHOES_SUPABASE_URL';
const SUPABASE_KEY_KEY = 'ADRESS_SHOES_SUPABASE_KEY';

// Default Fallback Products (Used if Supabase is not connected yet)
const DEFAULT_PRODUCTS = [
  {
    id: 'sample-1',
    title: 'Urban High-Top Warm Boot',
    category: 'winter',
    tag: 'Winter Special',
    price: 4500,
    sizes: '39, 40, 41, 42, 43, 44, 45',
    description: 'Water-resistant synthetic leather build with thermal inner lining and non-slip rubber grip sole.',
    image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    created_at: new Date().toISOString()
  },
  {
    id: 'sample-2',
    title: 'Executive Oxford Leather',
    category: 'men',
    tag: 'Pure Leather',
    price: 5200,
    sizes: '40, 41, 42, 43, 44',
    description: '100% Genuine polished cow leather, ergonomic cushioned footbed, durable heel sole.',
    image_url: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80',
    created_at: new Date().toISOString()
  },
  {
    id: 'sample-3',
    title: 'Elegance Heel Sandals',
    category: 'ladies',
    tag: 'Ladies Comfort',
    price: 3800,
    sizes: '36, 37, 38, 39, 40, 41',
    description: 'Soft cushioned interior with fashionable exterior finish and non-slip grip heel.',
    image_url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
    created_at: new Date().toISOString()
  },
  {
    id: 'sample-4',
    title: 'Junior Active Sports Runner',
    category: 'kids',
    tag: 'Kids Durable',
    price: 2800,
    sizes: '26, 28, 30, 32, 34, 35',
    description: 'Breathable mesh upper, velcro easy strap, shock-absorbing soft sole for active kids.',
    image_url: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=800&q=80',
    created_at: new Date().toISOString()
  },
  {
    id: 'sample-5',
    title: 'Rugged Trail Sneakerboot',
    category: 'winter',
    tag: 'Heavy Duty',
    price: 4900,
    sizes: '40, 41, 42, 43, 44, 45',
    description: 'Thick rubber lug outsole, padded ankle collar, premium heavy duty leather body.',
    image_url: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=800&q=80',
    created_at: new Date().toISOString()
  },
  {
    id: 'sample-6',
    title: 'Comfort Suede Slip-On Loafer',
    category: 'men',
    tag: 'Daily Wear',
    price: 3500,
    sizes: '39, 40, 41, 42, 43, 44',
    description: 'Soft suede upper material, flexible rubber grip bottom, memory foam insole.',
    image_url: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80',
    created_at: new Date().toISOString()
  }
];

let supabaseClient = null;

// Initialize Supabase Client
function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;

  const url = (window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.url) || localStorage.getItem(SUPABASE_URL_KEY);
  const key = (window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.key) || localStorage.getItem(SUPABASE_KEY_KEY);

  if (url && key && window.supabase) {
    try {
      supabaseClient = window.supabase.createClient(url, key);
      return supabaseClient;
    } catch (e) {
      console.warn('Supabase initialization failed:', e);
      return null;
    }
  }
  return null;
}

// Get Credentials
function getSupabaseCredentials() {
  return {
    url: (window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.url) || localStorage.getItem(SUPABASE_URL_KEY) || '',
    key: (window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.key) || localStorage.getItem(SUPABASE_KEY_KEY) || ''
  };
}

// Save Credentials
function saveSupabaseCredentials(url, key) {
  localStorage.setItem(SUPABASE_URL_KEY, url.trim());
  localStorage.setItem(SUPABASE_KEY_KEY, key.trim());
  supabaseClient = null;
  if (window.supabase && url && key) {
    supabaseClient = window.supabase.createClient(url.trim(), key.trim());
  }
  return !!supabaseClient;
}

// Check if configured
function isSupabaseConfigured() {
  const client = getSupabaseClient();
  return !!client;
}

// ================= API SERVICES =================

// Fetch Products (Supabase -> LocalStorage Fallback -> Default)
async function fetchProductsFromSupabase() {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return { data, source: 'supabase' };
      }
      if (!error && data && data.length === 0) {
        // Connected but empty table
        return { data: [], source: 'supabase' };
      }
      console.warn('Supabase fetch error, falling back:', error);
    } catch (e) {
      console.warn('Supabase request failed:', e);
    }
  }

  // LocalStorage cached items
  const localItems = localStorage.getItem('ADRESS_SHOES_LOCAL_PRODUCTS');
  if (localItems) {
    try {
      return { data: JSON.parse(localItems), source: 'local' };
    } catch (e) { }
  }

  return { data: DEFAULT_PRODUCTS, source: 'default' };
}

// Add New Product
async function addProductToSupabase(productData) {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('products')
        .insert([productData])
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.warn('Supabase product insert failed (falling back to local storage):', error.message);
    }
  }

  // Fallback to local storage
  const { data: current } = await fetchProductsFromSupabase();
  const newProduct = {
    id: 'local-' + Date.now(),
    ...productData,
    created_at: new Date().toISOString()
  };
  const updated = [newProduct, ...current];
  localStorage.setItem('ADRESS_SHOES_LOCAL_PRODUCTS', JSON.stringify(updated));
  return newProduct;
}

// Update Existing Product
async function updateProductInSupabase(id, productData) {
  const client = getSupabaseClient();
  if (client && !id.startsWith('sample-') && !id.startsWith('local-')) {
    try {
      const { data, error } = await client
        .from('products')
        .update(productData)
        .eq('id', id)
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.warn('Supabase product update failed:', error.message);
    }
  }

  // Fallback update in local storage
  const { data: current } = await fetchProductsFromSupabase();
  const updated = current.map(p => p.id === id ? { ...p, ...productData } : p);
  localStorage.setItem('ADRESS_SHOES_LOCAL_PRODUCTS', JSON.stringify(updated));
  return { id, ...productData };
}

// Delete Product
async function deleteProductFromSupabase(id) {
  const client = getSupabaseClient();
  if (client && !id.startsWith('sample-') && !id.startsWith('local-')) {
    try {
      const { error } = await client
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.warn('Supabase product delete failed:', error.message);
    }
  }

  // Fallback delete in local storage
  const { data: current } = await fetchProductsFromSupabase();
  const updated = current.filter(p => p.id !== id);
  localStorage.setItem('ADRESS_SHOES_LOCAL_PRODUCTS', JSON.stringify(updated));
  return true;
}

// Upload Image to Supabase Storage
async function uploadImageToSupabase(file) {
  const client = getSupabaseClient();
  if (!client) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
    });
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
  const filePath = `products/${fileName}`;

  // Candidates based on your Supabase Storage buckets
  const bucketCandidates = ['adress shoes 22', 'adress shoes', 'shoe-images'];

  for (const bucketName of bucketCandidates) {
    try {
      const { error: uploadError } = await client.storage
        .from(bucketName)
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (!uploadError) {
        const { data } = client.storage
          .from(bucketName)
          .getPublicUrl(filePath);

        if (data && data.publicUrl) {
          console.log(`Image uploaded successfully to bucket: "${bucketName}"`);
          return data.publicUrl;
        }
      }
    } catch (err) {
      console.warn(`Upload attempt failed on bucket "${bucketName}":`, err.message);
    }
  }

  // Fallback to local encoding if cloud bucket is restricted/not ready
  console.warn('Cloud storage upload failed. Using local encoding fallback.');
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
}

// ================= GOOGLE OAUTH AUTHENTICATION =================
async function signInWithGoogleOAuth() {
  const client = getSupabaseClient();
  if (!client) {
    alert('Supabase Client is not initialized.');
    return;
  }
  const redirectUrl = window.location.origin + window.location.pathname;
  const { data, error } = await client.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl
    }
  });

  if (error) {
    alert('Google Sign-In Error: ' + error.message);
  }
}

async function checkSupabaseSession() {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data: { session } } = await client.auth.getSession();
      if (session) {
        return session.user;
      }
    } catch (e) {
      console.warn('Session check error:', e);
    }
  }
  return null;
}
