const client = require('../models/client');

module.exports = {
    async getAllCards() {
        const preparedQuery = {
            text: `SELECT * FROM card`,
        };
        const result = await client.query(preparedQuery);
        return result.rows;
    },

    async getAllCardsStatuses(explorerId) {
        const preparedQuery = {
            text: `SELECT jsonb_object_agg(c.id,
                    CASE
                        WHEN ehc.duplicate IS true THEN 'duplicated'
                        WHEN ehc.duplicate IS false THEN 'owned'
                        ELSE 'default'
                    END 
                )		AS status
                FROM card c
                LEFT JOIN explorer_has_cards ehc ON c.id = ehc.card_id
                AND ehc.explorer_id = $1`,
            values: [explorerId],
        };
        const result = await client.query(preparedQuery);
        return result.rows;
    },
 
};