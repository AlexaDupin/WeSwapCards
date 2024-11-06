const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const test = {

async testSignIn() {
    console.log('test');

    const email = 'alexa.dupin+wecards@gmail.com'; // Use a valid email
    const password = 'T1wC7,2QwT%a.5s4'; // Use a valid password

    const response = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    console.log('Response:', response); // Log the entire response object

    // if (error) {
    //     console.error('Sign in error:', error);
    //     return;
    // }
    const { user, session } = response.data; // Check if this is where the data is

    console.log('User:', user);
    console.log('Session:', session);
}
}

// Run the test function
// testSignIn();

module.exports = test;
