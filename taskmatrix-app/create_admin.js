const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const env = fs.readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
  const [key, ...rest] = line.split('=');
  if (key && rest.length) {
    let val = rest.join('=').trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    acc[key.trim()] = val;
  }
  return acc;
}, {});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

(async () => {
  const { data, error } = await supabase.auth.signUp({
    email: 'nabinmahanty2003@gmail.com',
    password: 'Q@werty00',
    options: {
      data: {
        role: 'admin',
        full_name: 'Nabin Mahanty (Admin)'
      }
    }
  });

  if (error) {
    console.error('Error creating admin:', error.message);
  } else {
    console.log('Admin created successfully:', data.user?.email);
  }
})();
