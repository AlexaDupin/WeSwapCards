const client = require('./client');

module.exports = {
    async createExplorer(userUID, name) {
        console.log('DATAMAPPER');
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
    async getExplorerInfo(userUID) {
        console.log("ENTERING DATAMAPPER");
        const preparedQuery = {
            text: `
            SELECT * FROM explorer 
            WHERE userid = $1
            `,
            values: [userUID],
        };
        const result = await client.query(preparedQuery);
        return result.rows[0];
    },
};