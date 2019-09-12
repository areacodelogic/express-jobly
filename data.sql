CREATE TABLE companies
(
    handle text PRIMARY KEY,
    name text NOT NULL,
    num_employees integer,
    description text,
    logo_url text 
);

CREATE TABLE jobs
(
    id SERIAL PRIMARY KEY,
    title text NOT NULL,
    salary float NOT NULL,
    equity float NOT NULL,
    company_handle text REFERENCES companies ON DELETE CASCADE,
    date_posted timestamp DEFAULT current_timestamp 
);