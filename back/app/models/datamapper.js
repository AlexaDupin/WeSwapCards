const client = require('./client');

module.exports = {
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
        console.log(result.rows);
        return result.rows;
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
    async getDuplicatesFromExplorerInOnePlace(explorerId, placeId) {
        const preparedQuery = {
            text: `
            SELECT DISTINCT c.id, c.name, c.number, c.place_id FROM card AS c
            JOIN explorer_has_cards AS ehc ON c.id = ehc.card_id
            WHERE place_id = $2
            AND ehc.explorer_id = $1
            AND ehc.duplicate=true
            `,
            values: [explorerId, placeId]
        };
        const result = await client.query(preparedQuery);
        console.log(result.rows);

        return result.rows;
    },
    async checkIfCardLoggedForExplorer(explorerId, cardId) {
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
    async createExplorerHasCard(data) {
        const preparedQuery = await client.query(
            `
        INSERT INTO "explorer_has_cards"
        (explorer_id, card_id, duplicate) VALUES
        ($1, $2, $3) RETURNING *
        `,
            [data.explorerId, data.cardId, data.duplicate],
        );
        return preparedQuery.rows[0];
    },
    async checkDuplicateStatus(explorerId, cardId) {
        const preparedQuery = {
            text: `
            SELECT duplicate FROM explorer_has_cards
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
    async deleteCardFromExplorerHasCard(explorerId, cardId) {
        const preparedQuery = {
            text: `
            DELETE FROM explorer_has_cards
            WHERE explorer_id = $1
            AND card_id = $2
            `,
            values: [explorerId, cardId]
        };
        // return preparedQuery.rows[0];
        const result = await client.query(preparedQuery);
        return result.rows;
    },
    async getOpportunitiesForOneExplorer(explorerId) {
        console.log("ENTERING DATAMAPPER");

        const preparedQuery = {
            text: `
            SELECT ehc.id, c.id AS card_id, c.name AS card_name, e.name AS explorer_name, p.id AS place_id FROM card AS c
            JOIN explorer_has_cards AS ehc ON c.id = ehc.card_id
            JOIN explorer AS e ON e.id = ehc.explorer_id
            JOIN place AS p ON p.id = c.place_id
            WHERE ehc.duplicate = true AND ehc.explorer_id NOT IN ($1) 
            AND ehc.explorer_id NOT IN (3, $1)  
            AND c.id NOT IN (SELECT DISTINCT c.id FROM card AS c
            JOIN explorer_has_cards AS ehc ON c.id = ehc.card_id
            WHERE ehc.explorer_id = $1)
            ORDER BY c.name, e.name
            `,
            values: [explorerId],
        };
        const result = await client.query(preparedQuery);
        // console.log(result.rows);

        return result.rows;
    },
    async findSwapOpportunities(cardId, explorerId) {
        console.log("ENTERING DATAMAPPER");

        const preparedQuery = {
            text: `
            WITH explorers_with_duplicate AS (
                SELECT ehc.explorer_id, explorer.name
                FROM explorer_has_cards AS ehc
                JOIN explorer ON explorer.id = ehc.explorer_id
                WHERE card_id = $1 AND duplicate = true
                  AND explorer_id != $2
            ),
            explorer_duplicates AS (
                SELECT card_id
                FROM explorer_has_cards
                WHERE explorer_id = $2 AND duplicate = true
            )
            SELECT 
            swapexp.explorer_id AS explorer_id,
            swapexp.name AS explorer_name,
            jsonb_agg(
                jsonb_build_object(
                    'card', 
                    jsonb_build_object(
                        'id', c.id, 
                        'name', c.name)
                    )
                ORDER BY c.name) AS opportunities
            FROM 
                explorers_with_duplicate swapexp
            JOIN 
                card c ON c.id IN (SELECT card_id FROM explorer_duplicates)
            LEFT JOIN 
                explorer_has_cards ehc_all ON ehc_all.explorer_id = swapexp.explorer_id AND ehc_all.card_id = c.id
            WHERE 
                ehc_all.explorer_id IS NULL
            GROUP BY 
                swapexp.explorer_id, swapexp.name
            ORDER BY random()
            `,
            values: [cardId, explorerId],
        };
        const result = await client.query(preparedQuery);
        // console.log(result.rows);
        return result.rows;
    },
    async getCardName(cardId) {
        const preparedQuery = {
            text: `
            SELECT name FROM card
            WHERE id = $1
            `,
            values: [cardId]
        };
        const result = await client.query(preparedQuery);
        // console.log(result.rows);
        return result.rows[0];
    },
    async findConversation(cardName, explorerId, swapExplorerId) {
        const preparedQuery = {
            text: `
            SELECT id FROM conversation
            WHERE card_name = $1
            AND ((creator_id = $2 AND recipient_id = $3)
            OR (creator_id = $3 AND recipient_id = $2)) 
            `,
            values: [cardName, explorerId, swapExplorerId]
        };
        const result = await client.query(preparedQuery);
        if (result.rowCount > 0) {
            return result.rows[0];
        }
        return null;
    },
    async createConversation(cardName, explorerId, swapExplorerId) {
        console.log("CREATE CONV DTMP")

        const preparedQuery = await client.query(
            `
            INSERT INTO "conversation"
                (card_name, creator_id, recipient_id) 
            VALUES ($1, $2, $3) 
            RETURNING id
            `,
            [cardName, explorerId, swapExplorerId],
            );
            return preparedQuery.rows[0];
    },
    async insertNewMessage(data) {
        console.log("INSERT MESSAGE DTMP")

        const preparedQuery = await client.query(
            `
        INSERT INTO "message"
        (content, timestamp, sender_id, recipient_id, conversation_id) VALUES
        ($1, $2, $3, $4, $5) RETURNING *
        `,
            [data.content, data.timestamp, data.senderId, data.recipientId, data.conversationId],
        );
        return preparedQuery.rows[0];
    },
    async getAllMessagesInAChat(conversationId) {
        console.log("GET ALL MESSAGES IN CHAT DTMP")
        const preparedQuery = {
            text: `SELECT * FROM "message"
                WHERE conversation_id = $1
                ORDER BY timestamp`,
            values: [conversationId],
        };
        const result = await client.query(preparedQuery);
        // console.log(result.rows);
        return result.rows;
    },
    async updateMessageStatus(conversationId, explorerId) {
        const preparedQuery = {
            text: `
            UPDATE message SET read = true
            WHERE conversation_id = $1
            AND recipient_id = $2
            AND read = false
            `,
            values: [conversationId, explorerId]
        };
        // return preparedQuery.rows[0];
        const result = await client.query(preparedQuery);
        // console.log("READ DTMP", result);
        if (result.rowCount > 0) {
            return true;
        }
        return 0;     
    },
    async getAllConversationsOfExplorer(explorerId) {
        const preparedQuery = {
            text: `
            WITH ranked_conversations AS (
                SELECT 
                    cv.id AS db_id,
                    cv.card_name,
                    CASE
                        WHEN cv.creator_id = $1 THEN e2.name
                        WHEN cv.recipient_id = $1 THEN e1.name
                    END AS swap_explorer,
                    CASE
                        WHEN cv.creator_id = $1 THEN e2.id
                        WHEN cv.recipient_id = $1 THEN e1.id
                    END AS swap_explorer_id,
                    cv.status,
                    COUNT(m.id) FILTER (WHERE m.read = false AND m.recipient_id = $1) AS unread
                FROM conversation cv
                JOIN explorer e1 ON e1.id = cv.creator_id
                JOIN explorer e2 ON e2.id = cv.recipient_id
                LEFT JOIN message m ON m.conversation_id = cv.id
                WHERE cv.creator_id = $1
                   OR cv.recipient_id = $1
                GROUP BY cv.id, e2.name, e1.name, e2.id, e1.id
            )
            SELECT 
                ROW_NUMBER() OVER (ORDER BY unread DESC, card_name, swap_explorer) AS row_id,
                db_id,
                card_name,
                swap_explorer,
                swap_explorer_id,
                status,
                unread
            FROM ranked_conversations
            ORDER BY unread DESC, card_name, swap_explorer;`,
            values: [explorerId],
        };
        const result = await client.query(preparedQuery);
        console.log(result.rows);
        return result.rows;
    },
    async editConversationStatus(conversationId, status) {
        console.log("editConversationStatus DTMP")

        const preparedQuery = {
            text: `
            UPDATE conversation
            SET status = $2
            WHERE id = $1
            `,
            values: [conversationId, status]
        };
        const result = await client.query(preparedQuery);
        console.log(result);
    },
//     async findExplorersForCardIdOpportunity(cardId, explorerId) {
//         console.log("ENTERING DATAMAPPER");

//         const preparedQuery = {
//             text: `
//             SELECT explorer_id FROM explorer_has_cards
//             WHERE card_id = $1 AND duplicate = true AND explorer_id NOT IN ($2)
//             ORDER BY random()
//             `,
//             values: [cardId, explorerId],
//         };
//         const result = await client.query(preparedQuery);
//         // console.log(result.rows);
//         return result.rows;
//     },
//     async findSwapOpportunities(explorerId, swapExplorerId) {
//         console.log("ENTERING DATAMAPPER");

//         const preparedQuery = {
//             text: `
// SELECT id FROM card
// WHERE id NOT IN (
//     SELECT card_id FROM explorer_has_cards
//     WHERE explorer_id = $2
//     ) AND id IN (
//     SELECT card_id FROM explorer_has_cards
//     WHERE explorer_id = $1 and duplicate = true
//     )
//             `,
//             values: [explorerId, swapExplorerId],
//         };
//         const result = await client.query(preparedQuery);
//         // console.log(result.rows);
//         return result.rows;
//     },
    
    ////// INFINITE SCROLL //////
    // async getOpportunitiesForOneExplorer(explorerId, limit, offset) {
    //     console.log("ENTERING DATAMAPPER", limit, offset);

    //     const preparedQuery = {
    //         text: `
    //         SELECT ehc.id, c.id AS card_id, c.name AS card_name, e.name AS explorer_name, p.id AS place_id FROM card AS c
    //         JOIN explorer_has_cards AS ehc ON c.id = ehc.card_id
    //         JOIN explorer AS e ON e.id = ehc.explorer_id
    //         JOIN place AS p ON p.id = c.place_id
    //         WHERE ehc.duplicate = true AND ehc.explorer_id NOT IN ($1) 
    //         AND ehc.explorer_id NOT IN (3, $1)  
    //         AND c.id NOT IN (SELECT DISTINCT c.id FROM card AS c
    //         JOIN explorer_has_cards AS ehc ON c.id = ehc.card_id
    //         WHERE ehc.explorer_id = $1)
    //         ORDER BY c.name, e.name
    //         LIMIT $2 
    //         OFFSET $3
    //             `,
    //         values: [explorerId, limit, offset],
    //     };
    //     const result = await client.query(preparedQuery);
    //     // console.log(result.rows);

    //     return result.rows;
    // },
    async getCountForOnePlaceForExplorer(explorerId, placeId) {
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
    async getCardsByPlaceForOneExplorer(explorerId) {
        const preparedQuery = {
            text: `
            SELECT 
                p.name AS place_name, 
                JSON_AGG(
                    jsonb_build_object(
                        'card', c,
                        'duplicate', ehc.duplicate) 
                    ORDER BY c.number) AS cards
            FROM card AS c        
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
        const result = await client.query(preparedQuery);
        console.log(result.command);
    },


    // async getAllExplorers() {
    //     const preparedQuery = {
    //         text: `SELECT * FROM explorer
    //         ORDER BY name`,
    //     };
    //     const result = await client.query(preparedQuery);
    //     return result.rows;
    // },












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
