-- Image ingestion trigger: a new place notifies the worker on channel
-- image_ingest (app/worker/imageIngestionWorker.js), which adds a Pexels image
-- through Cloudinary. Run manually (psql or phpPgAdmin).
--
-- Copied from production, where it was created by hand. Safe to re-run there:
-- the function is replaced and the trigger dropped and recreated.
--
-- EXECUTE PROCEDURE, not EXECUTE FUNCTION: production runs PostgreSQL 9.6.

BEGIN;

CREATE OR REPLACE FUNCTION public.place_notify_image_ingest()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  PERFORM pg_notify('image_ingest', NEW.id::text);
  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS trg_place_notify_image_ingest ON public.place;
CREATE TRIGGER trg_place_notify_image_ingest
    AFTER INSERT ON public.place
    FOR EACH ROW EXECUTE PROCEDURE public.place_notify_image_ingest();

COMMIT;

-- Revert:
-- DROP TRIGGER IF EXISTS trg_place_notify_image_ingest ON public.place;
-- DROP FUNCTION IF EXISTS public.place_notify_image_ingest();
