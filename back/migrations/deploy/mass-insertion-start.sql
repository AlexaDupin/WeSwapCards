-- Deploy wecards:mass-insertion-start to pg

BEGIN;

INSERT INTO "explorer" ("name") VALUES
('Test'), ('Test1');

INSERT INTO "place" ("name") VALUES 
('Brussels'), 
('Berlin'), 
('Rio de Janeiro'),
('Tokyo'), 
('New York'), 
('Australia'),
('London'), 
('Montreal'), 
('Egypt'),
('New Orleans'), 
('Peru'), 
('Finland'),
('Vietnam'), 
('Venice'), 
('Paris'),
('Hawaii'), 
('Oslo'), 
('Barcelona'),
('India'), 
('South Africa'),
('Global Walk Cup'), 
('Morocco'), 
('Greece'),
('Mexico'), 
('Seoul'),
('Scotland'),
('Reunion Island'),
('Boston'),
('The Netherlands'),
('Colombia'),
('Marseille'),
('Tahiti'),
('Portugal'),
('Cuba'),
('Valentine''s Day'),
('Kuala Lumpur'),
('Jordan'),
('Rome'),
('Halloween'),
('Buenos Aires'),
('Mongolia');

SELECT * FROM insert_allCards();

COMMIT;
