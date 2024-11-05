const client = require('./client');

module.exports = {
    async getAllExplorers() {
        const preparedQuery = {
            text: `SELECT * FROM explorer
            ORDER BY name`,
        };
        const result = await client.query(preparedQuery);
        return result.rows;
    },
    async getAllPlaces() {
        const preparedQuery = {
            text: `SELECT * FROM place
            ORDER BY place.name`,
        };
        const result = await client.query(preparedQuery);
        return result.rows;
    },
    async getAllCardsFromOnePlace(placeId) {
        const preparedQuery = {
            text: `SELECT * FROM card WHERE place_id = $1
            ORDER BY name`,
            values: [placeId],
        };
        const result = await client.query(preparedQuery);
        return result.rows;
    },
    async createExplorerHasCard(formObject) {
        const preparedQuery = await client.query(
            `
        INSERT INTO "explorer_has_cards"
        (explorer_id, card_id, duplicate) VALUES
        ($1, $2, $3) RETURNING *
        `,
            [formObject.explorerId, formObject.cardId, formObject.duplicate],
        );
        return preparedQuery.rows[0];
    },
    async getCardsFromOneExplorerInOnePlace(placeId, explorerId) {
        const preparedQuery = {
            text: `
                SELECT DISTINCT c.id, c.name, c.number, c.place_id FROM card AS c
                JOIN explorer_has_cards ON c.id = explorer_has_cards.card_id
                WHERE place_id = $1 AND explorer_has_cards.explorer_id = $2`,
            values: [placeId, explorerId],
        };
        const result = await client.query(preparedQuery);
        return result.rows;
    },
    async getOpportunitiesForOneExplorer(explorerId) {
        const preparedQuery = {
            text: `
                SELECT ehc.id, c.id AS card_id, c.name AS card_name, e.name AS explorer_name, p.id AS place_id FROM card AS c
                JOIN explorer_has_cards AS ehc ON c.id = ehc.card_id
                JOIN explorer AS e ON e.id = ehc.explorer_id
                JOIN place AS p ON p.id = c.place_id
                WHERE ehc.duplicate = true AND ehc.explorer_id NOT IN ($1) 
                AND ehc.explorer_id NOT IN (3)  
                AND c.id NOT IN (SELECT DISTINCT c.id FROM card AS c
                JOIN explorer_has_cards AS ehc ON c.id = ehc.card_id
                WHERE ehc.explorer_id = $1)
                ORDER BY c.name
                `,
            values: [explorerId],
        };
        const result = await client.query(preparedQuery);
        // console.log(result.rows);

        return result.rows;
    },
    async checkDuplicates(explorerId, placeId) {
        const preparedQuery = {
            text: `
            SELECT card_id FROM explorer_has_cards AS ehc
            JOIN card ON card.id = ehc.card_id
            WHERE duplicate=true
            AND explorer_id = $1
            AND place_id = $2
            `,
            values: [explorerId, placeId]
        };
        const result = await client.query(preparedQuery);
        // console.log(result.rows);

        return result.rows;
    },
    async checkCardExists(explorerId, cardId) {
        const preparedQuery = {
            text: `
            SELECT * FROM explorer_has_cards AS ehc
            WHERE explorer_id = $1
            AND card_id = $2
            `,
            values: [explorerId, cardId]
        };
        const result = await client.query(preparedQuery);
        if (result.rowCount > 0) {
            return true;
        }
        return null;    
    },
    async checkDuplicateStatus(explorerId, cardId) {
        const preparedQuery = {
            text: `
            SELECT duplicate FROM explorer_has_cards AS ehc
            WHERE explorer_id = $1
            AND card_id = $2
            `,
            values: [explorerId, cardId]
        };
        const result = await client.query(preparedQuery);
        if (result.rowCount > 0) {
            return result.rows[0];
        }
        return null;
    },
    async editDuplicateStatus(explorerId, cardId, newDuplicateData) {
        const preparedQuery = {
            text: `
            UPDATE explorer_has_cards
            SET duplicate = $3
            WHERE explorer_id = $1
            AND card_id = $2
            `,
            values: [explorerId, cardId, newDuplicateData]
        };
        await client.query(preparedQuery);
    },
    async editExplorerHasCard(duplicateValue, explorerId, cardId) {
        const preparedQuery = {
            text: `
            UPDATE explorer_has_cards SET duplicate = $1
            WHERE explorer_id = $2
            AND card_id = $3
            `,
            values: [duplicateValue, explorerId, cardId]
        };
        // return preparedQuery.rows[0];
        const result = await client.query(preparedQuery);
        return result.rows;
    },
    async getOpportunitiesCountForOnePlaceForOneExplorer(explorerId, placeId) {
        const preparedQuery = {
            text: `
            SELECT COUNT(*) FROM explorer_has_cards AS ehc
            JOIN card AS c ON c.id = ehc.card_id
            JOIN place AS p ON p.id = c.place_id
            WHERE ehc.explorer_id = $1
            AND p.id = $2
            `,
            values: [explorerId, placeId],
        };

        const result = await client.query(preparedQuery);
        // console.log(result.rows);

        return result.rows;
    },
    async getCardsForOneExplorer(explorerId) {
        const preparedQuery = {
            text: `
            SELECT p.name AS place_name, JSON_AGG (c.* ORDER BY c.number) AS cards FROM card AS c
            JOIN explorer_has_cards AS ehc ON ehc.card_id = c.id
            JOIN place AS p ON p.id = c.place_id
            WHERE ehc.explorer_id = $1
            GROUP BY p.name
            ORDER BY p.name
                `,
            values: [explorerId],
        };
        const result = await client.query(preparedQuery);
        // console.log(result.rows);

        return result.rows;
    },
    async getExplorerInfo(userUIID) {
        console.log("ENTERING DATAMAPPER");
        const preparedQuery = {
            text: `
            SELECT * FROM explorer 
            WHERE userid = $1
            `,
            values: [userUIID],
        };
        const result = await client.query(preparedQuery);
        console.log("result.rows DM", result.rows);
        return result.rows;
    },
    async getExplorerInfoByExplorerId(explorerId) {
        console.log("ENTERING DATAMAPPER");
        const preparedQuery = {
            text: `
            SELECT * FROM explorer 
            WHERE id = $1
            `,
            values: [explorerId],
        };
        const result = await client.query(preparedQuery);
        console.log("result.rows DM", result.rows[0]);
        return result.rows[0];
    }
};