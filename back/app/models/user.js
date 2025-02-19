const client = require('./client');

module.exports = {
    async createExplorer(userUID, username) {
        // console.log('DATAMAPPER', userUID, username);
        const preparedQuery = await client.query(
            `
        INSERT INTO "explorer"
        (userId, name) VALUES
        ($1, $2) RETURNING *
        `,
            [userUID, username],
        );
        console.log(preparedQuery.rows);
        return preparedQuery.rows[0];
    },
    async getExplorerInfo(userUID) {
        // console.log("ENTERING DATAMAPPER");
        const preparedQuery = {
            text: `
            SELECT id, name FROM explorer 
            WHERE userid = $1
            `,
            values: [userUID],
        };
        const result = await client.query(preparedQuery);
        return result.rows[0];
    },
    async getExplorerIdByClerkId(userUID) {
        // console.log("ENTERING DATAMAPPER");
        const preparedQuery = {
            text: `
            SELECT id FROM explorer 
            WHERE userid = $1
            `,
            values: [userUID],
        };
        const result = await client.query(preparedQuery);
        return result.rows[0];
    },
    async deleteExplorer(userUID) {
        // console.log('DATAMAPPER', userUID, username);
        const preparedQuery = await client.query(
            `
        DELETE FROM "explorer"
        WHERE userid = $1
        `,
            [userUID],
        );
        console.log(preparedQuery);
        return preparedQuery.rowCount;
    },
};