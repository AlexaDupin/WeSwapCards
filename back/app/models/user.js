const client = require('./client');

module.exports = {
    async createExplorer(userUID, name) {
        const preparedQuery = await client.query(
            `
        INSERT INTO "explorer"
        (userId, name) VALUES
        ($1, $2) RETURNING *
        `,
            [userUID, name],
        );
        return preparedQuery.rows[0];
    },
};