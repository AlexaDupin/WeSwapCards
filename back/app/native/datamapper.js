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
            text: ` SELECT c.id AS card_id,
                        CASE
                          WHEN ehc.duplicate IS TRUE  THEN 'duplicated'
                          WHEN ehc.duplicate IS FALSE THEN 'owned'
                          ELSE 'default'
                        END AS status
                    FROM card c
                    LEFT JOIN explorer_has_cards ehc ON c.id = ehc.card_id
                    AND ehc.explorer_id = $1
                    ORDER BY c.id;`,
            values: [explorerId],
        };
        const result = await client.query(preparedQuery);
        const map = {};
        for (let i = 0; i < result.rows.length; i++) {
          const row = result.rows[i];
          map[row.card_id] = row.status;
        }
        return map;    
    },
 
};