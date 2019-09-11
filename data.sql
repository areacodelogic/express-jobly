CREATE TABLE companies
(
    handle text PRIMARY KEY,
    name text NOT NULL,
    num_employees integer,
    description text,
    logo_url text 
);