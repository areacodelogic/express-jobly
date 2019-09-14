CREATE TABLE companies (
  handle text PRIMARY KEY,
  name text NOT NULL,
  num_employees integer,
  description text,
  logo_url text
);
CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  title text NOT NULL,
  salary float NOT NULL,
  equity float NOT NULL,
  company_handle text REFERENCES companies ON DELETE CASCADE,
  date_posted timestamp DEFAULT current_timestamp
);
CREATE TABLE users (
  username text PRIMARY KEY,
  password text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL UNIQUE,
  photo_url TEXT,
  is_admin boolean DEFAULT false
);