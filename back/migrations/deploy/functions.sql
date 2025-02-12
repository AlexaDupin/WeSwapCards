-- Deploy wecards:functions to pg

BEGIN;

-- Insert a new card 
CREATE OR REPLACE FUNCTION insert_card(name text, number integer, place_id integer) RETURNS card AS $$

	INSERT INTO "card"
	   ("name", "number", "place_id") VALUES
	   (
		   name,
		   number,
		   place_id
	   )
   RETURNING *;

$$ LANGUAGE sql;


-- Insert a new place by name 
CREATE OR REPLACE FUNCTION insert_place(place_name text) RETURNS place AS $$

	INSERT INTO "place" ("name") VALUES (place_name)
	RETURNING *;
   
$$ LANGUAGE sql;


-- Insert all cards by giving placeId
CREATE OR REPLACE FUNCTION insert_cards_placeId(place_id integer) RETURNS void AS $$

DECLARE 
i int:= 1;
place_name text;

BEGIN
	SELECT name FROM place WHERE id = place_id INTO place_name;

	LOOP
		PERFORM insert_card(place_name || i, i, place_id);
		i := i + 1;
		IF i > 9 THEN exit;
		END IF;
	END LOOP;
END
   
$$ LANGUAGE plpgsql;


-- Insert all cards by giving placeName
CREATE OR REPLACE FUNCTION insert_cards_placeName(place_name text) RETURNS void AS $$

DECLARE 
i int:= 1;
place_id int;

BEGIN
	-- Retrieve Id of newly added place 
	SELECT id FROM place WHERE name = place_name INTO place_id;

	LOOP
		PERFORM insert_card(place_name || i, i, place_id);
		i := i + 1;
		IF i > 9 THEN exit;
		END IF;
	END LOOP;

END
   
$$ LANGUAGE plpgsql;



-- Insert all cards for all places in the database (to be run once)
CREATE OR REPLACE FUNCTION insert_allCards() RETURNS void AS $$

DECLARE 
place_data record;

BEGIN
	FOR place_data IN SELECT id, name FROM place LOOP
		PERFORM insert_card(place_data.name || generate_series, generate_series, place_data.id)
		FROM generate_series(1, 9);
	END LOOP;
END;
   
$$ LANGUAGE plpgsql;

COMMIT;

