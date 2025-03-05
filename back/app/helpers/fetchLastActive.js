const cron = require('node-cron');
const { clerkClient } = require("@clerk/express");
const client = require('../models/client');

// Function to fetch last active timestamp from Clerk using clerkClient
const fetchLastActiveFromClerk = async (userId) => {
    try {
      const user = await clerkClient.users.getUser(userId);

      const lastActiveAtMillis = user.lastActiveAt; // Timestamp in milliseconds
      const lastActiveAtDate = new Date(lastActiveAtMillis); // Convert to JavaScript Date
      const formattedLastActiveAt = lastActiveAtDate.toISOString(); // Convert to ISO 8601 format
      
      return formattedLastActiveAt;
    
    } catch (error) {
      console.error(`Error fetching last active for user ${userId}:`, error);
      return null;
    }
  };
  
// Function to update the last_active_at field in the database
const updateUserLastActive = async (userId, lastActiveAt) => {
  try {
    const query = 'UPDATE explorer SET last_active_at = $1 WHERE userId = $2';
    const values = [lastActiveAt, userId];
    await client.query(query, values);
    // console.log(`Updated last_active_at for user ${userId}`);
  } catch (error) {
    console.error(`Error updating last active for user ${userId}:`, error);
  }
};

// Main function to fetch and update last_active_at for all users
const updateLastActiveForAllUsers = async () => {
  console.log("RUNNING CRON TASK");

    try {
      // Fetch all users from the database
      const res = await client.query('SELECT userid FROM explorer');
      const users = res.rows;
  
      for (const user of users) {
        const userId = user.userid;
        const lastActiveAt = await fetchLastActiveFromClerk(userId);
        
        if (lastActiveAt) {
          await updateUserLastActive(userId, lastActiveAt);
        }
      }
    } catch (error) {
      console.error('Error fetching or updating users:', error);
    }
  };

// Set up the cron job to run every 24 hours (or adjust the interval as needed)
cron.schedule('15 13 * * *', updateLastActiveForAllUsers); // Runs at midnight every day

module.exports = { updateLastActiveForAllUsers }; 