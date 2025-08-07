const client = require('../models/client');

module.exports = {
    async getAllCards() {
        const preparedQuery = {
            text: `SELECT * FROM card`,
        };
        const result = await client.query(preparedQuery);
        return result.rows;
    },
};