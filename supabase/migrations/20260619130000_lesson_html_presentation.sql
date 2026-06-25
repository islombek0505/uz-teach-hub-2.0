-- =====================================================================
-- HTML-file presentations for lessons
-- =====================================================================
-- A lesson presentation can now be EITHER a sequence of slide images
-- (existing `presentation_slides text[]`) OR a single self-contained HTML
-- file stored in the "presentations" bucket. This column holds the storage
-- path of that HTML file; when set, the lesson uses the HTML deck.
ALTER TABLE public.lessons
  ADD COLUMN IF NOT EXISTS presentation_html_path text;
