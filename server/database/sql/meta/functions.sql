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

----------------------
--Create a new domain.
----------------------
CREATE OR REPLACE FUNCTION meta.create_domain (
  domain_name TEXT,
  domain_label TEXT
)
RETURNS TABLE (
  value INT,
  text VARCHAR
) AS $$
BEGIN
  EXECUTE 'CREATE TABLE domain.' || domain_name || '(
    id SERIAL PRIMARY KEY NOT NULL,
    value VARCHAR(150) NULL,
    category INT NOT NULL,
    type INT NOT NULL,
    updated TIMESTAMP WITHOUT TIME ZONE DEFAULT clock_timestamp(),
    created TIMESTAMP WITHOUT TIME ZONE DEFAULT clock_timestamp()
  )';

  INSERT INTO meta.domains (name, label) VALUES (domain_name, domain_label);
  
  RETURN QUERY 
    SELECT id, label FROM meta.domains 
      ORDER BY label ASC;
END; 
$$ LANGUAGE 'plpgsql';

-------------------------------------------
--Create a new category for a given domain.
-------------------------------------------
CREATE OR REPLACE FUNCTION meta.create_category (
  category_domain INT,
  category_label TEXT
)
RETURNS TABLE (
  value INT,
  text VARCHAR
) AS $$
BEGIN
  INSERT INTO meta.categories (label, domain_id) VALUES (category_label, category_domain);

  RETURN QUERY 
    SELECT id, label FROM meta.categories 
      WHERE domain_id = category_domain
      ORDER BY label ASC;
END; 
$$ LANGUAGE 'plpgsql';