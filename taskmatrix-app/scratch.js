const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local manually
const env = fs.readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
  const [key, ...rest] = line.split('=');
  if (key && rest.length) {
    let val = rest.join('=').trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    acc[key.trim()] = val;
  }
  return acc;
}, {});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

(async () => {
  
  // Try inserting what my dashboard does
  const newTask = {
    title: 'test task',
    description: 'test desc',
    status: 'todo',
    user_id: 'e22e92c4-3bd3-4e4b-bbb1-eb5d8c6b4b45' // dummy uuid just to see error
  };
  
  const { data, error } = await supabase.from('tasks').insert([newTask]).select();
  console.log('Insert Check:\nData:', data, '\nError:', error);
})();
