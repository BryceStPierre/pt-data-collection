---------------------------
--Get list of domain items.
---------------------------
CREATE OR REPLACE FUNCTION meta.get_domain_items ()
RETURNS TABLE (
  value INT,
  text VARCHAR
) AS $$
BEGIN
  RETURN QUERY 
    SELECT id, label FROM meta.domains 
      ORDER BY label ASC;
END; 
$$ LANGUAGE 'plpgsql';

-----------------------------
--Get list of category items.
-----------------------------
CREATE OR REPLACE FUNCTION meta.get_category_items (
  domain INT
)
RETURNS TABLE (
  value INT,
  text VARCHAR
) AS $$
BEGIN
  RETURN QUERY 
    SELECT id, label FROM meta.categories 
      WHERE domain_id = domain
      ORDER BY label ASC;
END; 
$$ LANGUAGE 'plpgsql';
