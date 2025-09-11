const client = require('./client');

module.exports = {
    async getAllCountries() {
        const preparedQuery = {
            text: `SELECT * FROM country`,
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
        // console.log(result);
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
        // console.log(result.rows);

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
    async manageExplorerCards(explorerId, selectedCardsData, toBeDeletedIds) {
        try {
            const results = {
                upserted: [],
                deletedCount: 0
            };
            
            for (const cardData of selectedCardsData) {
                const result = await client.query(`
                    INSERT INTO explorer_has_cards (explorer_id, card_id, duplicate) 
                    VALUES ($1, $2, $3)
                    ON CONFLICT (explorer_id, card_id) 
                    DO UPDATE SET duplicate = EXCLUDED.duplicate
                    RETURNING *, 
                        CASE WHEN xmax = 0 THEN 'inserted' ELSE 'updated' END as action
                `, [explorerId, cardData.cardId, cardData.duplicate]);
                
                results.upserted.push(result.rows[0]);
            }
            
            if (toBeDeletedIds.length > 0) {
                const deleteResult = await client.query(`
                    DELETE FROM explorer_has_cards 
                    WHERE explorer_id = $1 AND card_id = ANY($2)
                `, [explorerId, toBeDeletedIds]);
                
                results.deletedCount = deleteResult.rowCount;
            }
            
            return results;
            
        } catch (error) {
            console.error('Database error in manageExplorerCards:', error);
            throw new Error('Failed to manage explorer cards');
        }
    },
    async getOpportunitiesForOneExplorer(explorerId) {
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
    async findSwapOpportunities(cardId, explorerId, page = 1, limit = 20) {
        const countQuery = {
            text: 
            `SELECT COUNT(*)
            FROM explorer_has_cards AS ehc
            JOIN explorer ON explorer.id = ehc.explorer_id
            WHERE ehc.card_id = $1
            AND explorer.id != $2 
            AND ehc.duplicate = true
            `,
            values: [cardId, explorerId],
        };

        const countResult = await client.query(countQuery);
        const totalCount = parseInt(countResult.rows[0].count);

        const offset = (page - 1) * limit;

        const preparedQuery = {
            text: `WITH explorers_with_card AS (
                SELECT ehc.explorer_id, explorer.name, explorer.last_active_at
                FROM explorer_has_cards AS ehc
                JOIN explorer ON explorer.id = ehc.explorer_id
                WHERE ehc.card_id = $1
                AND explorer.id != $2 
                AND ehc.duplicate = true
            ),
            explorer_duplicates AS (
                SELECT ehc.card_id
                FROM explorer_has_cards AS ehc
                WHERE ehc.explorer_id = $2
                AND ehc.duplicate = true
            ),
            opportunities_for_explorers AS (
                SELECT 
                    ewce.explorer_id,
                    ewce.name,
                    ewce.last_active_at,
                    c.id AS card_id,
                    c.name AS card_name
                FROM 
                    explorers_with_card ewce
                CROSS JOIN 
                    explorer_duplicates ed
                LEFT JOIN 
                    explorer_has_cards ehc ON ehc.explorer_id = ewce.explorer_id AND ehc.card_id = ed.card_id
                LEFT JOIN 
                    card c ON c.id = ed.card_id
                WHERE 
                    ehc.explorer_id IS NULL
            )
            SELECT 
                ewce.explorer_id,
                ewce.name AS explorer_name,
                ewce.last_active_at,
                COALESCE(
                    jsonb_agg(
                        jsonb_build_object(
                            'card', 
                            jsonb_build_object(
                                'id', o.card_id, 
                                'name', o.card_name)
                        ) 
                        ORDER BY o.card_name
                    ) FILTER (WHERE o.card_id IS NOT NULL), '[]'::jsonb
                ) AS opportunities
            FROM 
                explorers_with_card ewce
            LEFT JOIN 
                opportunities_for_explorers o ON o.explorer_id = ewce.explorer_id
            GROUP BY 
                ewce.explorer_id, ewce.name, ewce.last_active_at
            ORDER BY 
                CASE 
                    WHEN jsonb_array_length(COALESCE(jsonb_agg(
                            jsonb_build_object(
                                'card', 
                                jsonb_build_object(
                                    'id', o.card_id, 
                                    'name', o.card_name)
                                ) 
                            ORDER BY o.card_name
                        ) FILTER (WHERE o.card_id IS NOT NULL), '[]'::jsonb)) > 0 THEN 1
                    ELSE 2
                END,
                CASE
                    WHEN ewce.last_active_at > NOW() - INTERVAL '2 days' THEN 1
                    ELSE 2
                END,
                ewce.last_active_at DESC,
                ewce.explorer_id
            LIMIT $3 OFFSET $4
            ;
            `,
            values: [cardId, explorerId, limit, offset],
        };

        const result = await client.query(preparedQuery);
        // console.log(result.rows);
        return {
            items: result.rows,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                totalItems: totalCount,
                itemsPerPage: limit
            }
        };
    },
    async getOpportunitiesForRecipient(creatorId, recipientId) {
        const preparedQuery = {
            text: `
            SELECT
                jsonb_build_object(
                    'card', jsonb_build_object(
                        'id', c.id,
                        'name', c.name
                    )
                ) AS opportunity
            FROM card c
            JOIN explorer_has_cards ehc10 ON c.id = ehc10.card_id
            WHERE ehc10.explorer_id = $1
              AND ehc10.duplicate = true
              AND NOT EXISTS (
                  SELECT 1
                  FROM explorer_has_cards ehc1
                  WHERE ehc1.explorer_id = $2
                  AND ehc1.card_id = c.id
              )
            ORDER BY c.name
        `,
            values: [creatorId, recipientId],
        };

        const result = await client.query(preparedQuery);
        const opportunities = result.rows.map(row => row.opportunity);
        return opportunities; 
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
    async getConversationParticipants(id) {
        const preparedQuery = {
            text: `
            SELECT creator_id, recipient_id FROM conversation
            WHERE id = $1 
            `,
            values: [id]
        };
        const result = await client.query(preparedQuery);
        if (result.rowCount > 0) {
            return result.rows[0];
        }
        return null;
    },
    async createConversation(cardName, explorerId, swapExplorerId, timestamp) {
        //console.log("CREATE CONV DTMP")

        const preparedQuery = await client.query(
            `
            INSERT INTO "conversation"
                (card_name, creator_id, recipient_id, timestamp) 
            VALUES ($1, $2, $3, $4) 
            RETURNING id
            `,
            [cardName, explorerId, swapExplorerId, timestamp],
            );
            return preparedQuery.rows[0];
    },
    async insertNewMessage(data) {
        // console.log("INSERT MESSAGE DTMP")
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
    async getUnreadConversations(explorerId) {
        const preparedQuery = {
            text: `
            SELECT 
                status,
                COUNT(DISTINCT cv.id) AS unread
            FROM conversation cv
            JOIN message m ON m.conversation_id = cv.id
            WHERE (cv.creator_id = $1 OR cv.recipient_id = $1)
              AND m.recipient_id = $1
              AND m.read = false
              AND cv.creator_id IS NOT NULL
              AND cv.recipient_id IS NOT NULL
            GROUP BY status;
            `,
            values: [explorerId],
        };
        
        const result = await client.query(preparedQuery);

        const counts = result.rows.reduce((acc, row) => {
            acc[row.status] = parseInt(row.unread);
            return acc;
          }, {});

        return {
          inProgress: counts['In progress'] || 0,
          past: (counts['Completed'] || 0) + (counts['Declined'] || 0),
        };
    },
    async getCurrentConversationsOfExplorer(explorerId, page = 1, limit = 40, search = '') {
        const searchPattern = `%${search.toLowerCase()}%`;

        const countQuery = {
            text: `
            SELECT COUNT(*) 
            FROM conversation cv
            JOIN explorer e1 ON e1.id = cv.creator_id
            JOIN explorer e2 ON e2.id = cv.recipient_id
            WHERE (cv.creator_id = $1 OR cv.recipient_id = $1)
            AND creator_id IS NOT NULL
            AND recipient_id IS NOT NULL
            AND status = 'In progress'
            AND (
                LOWER(cv.card_name) LIKE $2 OR
                LOWER(e1.name) LIKE $2 OR
                LOWER(e2.name) LIKE $2
            )
            `,
            values: [explorerId, searchPattern],
        };
        
        const countResult = await client.query(countQuery);
        const totalCount = parseInt(countResult.rows[0].count);
        
        const offset = (page - 1) * limit;
        
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
                    cv.creator_id,
                    cv.recipient_id,
                    cv.status,
                    COUNT(m.id) FILTER (WHERE m.read = false AND m.recipient_id = $1) AS unread
                FROM conversation cv
                JOIN explorer e1 ON e1.id = cv.creator_id
                JOIN explorer e2 ON e2.id = cv.recipient_id
                LEFT JOIN message m ON m.conversation_id = cv.id
                WHERE (cv.creator_id = $1 OR cv.recipient_id = $1)
                   AND status = 'In progress'
                   AND (
                    LOWER(cv.card_name) LIKE $2 OR
                    LOWER(e1.name) LIKE $2 OR
                    LOWER(e2.name) LIKE $2
                   )
                GROUP BY cv.id, e2.name, e1.name, e2.id, e1.id
            )
            SELECT 
                ROW_NUMBER() OVER (
                    ORDER BY 
                        (unread > 0) DESC,
                        CASE WHEN unread > 0 THEN card_name END,
                        (status = 'In progress') DESC,
                        card_name
                ) AS row_id,
                db_id,
                card_name,
                swap_explorer,
                swap_explorer_id,
                status,
                creator_id,
                recipient_id,
                unread
            FROM ranked_conversations
            ORDER BY 
                (unread > 0) DESC,  
                CASE WHEN unread > 0 THEN card_name END,  
                (status = 'In progress') DESC,  
                card_name
            LIMIT $3 OFFSET $4;`,
            values: [explorerId, searchPattern, limit, offset],
        };
        const result = await client.query(preparedQuery);
        return {
            conversations: result.rows,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                totalItems: totalCount,
                itemsPerPage: limit
            }
        };
    },
    async getPastConversationsOfExplorer(explorerId, page = 1, limit = 40, search = '') {
        const searchPattern = `%${search.toLowerCase()}%`;
        
        const countQuery = {
            text: `
            SELECT COUNT(*) 
            FROM conversation cv
            JOIN explorer e1 ON e1.id = cv.creator_id
            JOIN explorer e2 ON e2.id = cv.recipient_id
            WHERE (cv.creator_id = $1 OR cv.recipient_id = $1)
            AND creator_id IS NOT NULL
            AND recipient_id IS NOT NULL
            AND (status = 'Completed' OR status = 'Declined')
            AND (
                LOWER(cv.card_name) LIKE $2 OR
                LOWER(e1.name) LIKE $2 OR
                LOWER(e2.name) LIKE $2
            )
            `,
            values: [explorerId, searchPattern],
        };
        
        const countResult = await client.query(countQuery);
        const totalCount = parseInt(countResult.rows[0].count);
        
        const offset = (page - 1) * limit;
        
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
                    cv.creator_id,
                    cv.recipient_id,
                    cv.status,
                    COUNT(m.id) FILTER (WHERE m.read = false AND m.recipient_id = $1) AS unread
                FROM conversation cv
                JOIN explorer e1 ON e1.id = cv.creator_id
                JOIN explorer e2 ON e2.id = cv.recipient_id
                LEFT JOIN message m ON m.conversation_id = cv.id
                WHERE (cv.creator_id = $1
                   OR cv.recipient_id = $1)
                   AND (status = 'Completed' OR status = 'Declined')
                   AND (
                    LOWER(cv.card_name) LIKE $2 OR
                    LOWER(e1.name) LIKE $2 OR
                    LOWER(e2.name) LIKE $2
                   )
                GROUP BY cv.id, e2.name, e1.name, e2.id, e1.id
            )
            SELECT 
                ROW_NUMBER() OVER (
                    ORDER BY 
                        (unread > 0) DESC,
                        CASE WHEN unread > 0 THEN card_name END,
                        card_name
                ) AS row_id,
                db_id,
                card_name,
                swap_explorer,
                swap_explorer_id,
                status,
                creator_id,
                recipient_id,
                unread
            FROM ranked_conversations
            ORDER BY 
                (unread > 0) DESC,  
                CASE WHEN unread > 0 THEN card_name END,  
                card_name
            LIMIT $3 OFFSET $4;`,
            values: [explorerId, searchPattern, limit, offset],
        };
        const result = await client.query(preparedQuery);
        // console.log(totalCount, result.rows);
        return {
            conversations: result.rows,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                totalItems: totalCount,
                itemsPerPage: limit
            }        
        };
    },
    async editConversationStatus(conversationId, status) {
        //console.log("editConversationStatus DTMP")

        const preparedQuery = {
            text: `
            UPDATE conversation
            SET status = $2
            WHERE id = $1
            `,
            values: [conversationId, status]
        };
        const result = await client.query(preparedQuery);
        // console.log(result);
        return result.command;
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
                COALESCE(
                  JSON_AGG(
                    JSON_BUILD_OBJECT(
                      'card', JSON_BUILD_OBJECT(
                        'id', c.id,
                        'name', c.name,
                        'number', c.number,
                        'place_id', c.place_id
                      ),
                      'duplicate', c.duplicate
                    )
                    ORDER BY c.number
                  ) FILTER (WHERE c.id IS NOT NULL),
                  '[]'
                ) AS cards
            FROM 
              place p
            LEFT JOIN (
              SELECT 
                c.place_id,
                c.id,
                c.name,
                c.number,
                ehc.duplicate,
                ehc.explorer_id
              FROM 
                card c
              JOIN 
                explorer_has_cards ehc ON c.id = ehc.card_id
              WHERE 
                ehc.explorer_id = $1
            ) c ON p.id = c.place_id
            GROUP BY p.id, p.name
            ORDER BY p.name;
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
        //console.log(result.command);
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
        // console.log("DTMP getAllCardsStatuses", result.rows);
        const map = {};
        for (let i = 0; i < result.rows.length; i++) {
          const row = result.rows[i];
          map[row.card_id] = row.status;
        }
        return map;    
    },
    async getAllCards() {
        const preparedQuery = {
            text: `SELECT * FROM card`,
        };
        const result = await client.query(preparedQuery);
        return result.rows;
    },
};
