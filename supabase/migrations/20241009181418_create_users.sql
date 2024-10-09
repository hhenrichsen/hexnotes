CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
    email VARCHAR(255),
    fullname VARCHAR(255)
);
CREATE INDEX IF NOT EXISTS users_email_idx ON users (email);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User info is visible to the user."
ON public.users FOR SELECT
USING (auth.uid() = id);

-- This trigger is required to populate the users table with the full_name from the auth.users table.
-- Thanks to https://stackoverflow.com/a/78908207
CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS trigger 
    SET search_path = ''
AS $$
DECLARE
full_name VARCHAR(255);

BEGIN
full_name := (new.raw_user_meta_data ->> 'full_name');

INSERT INTO public.users (id, email, fullname)
VALUES (new.id, new.email, full_name);

RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_new_user ON auth.users;

CREATE TRIGGER on_new_user
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE PROCEDURE public.handle_new_user();