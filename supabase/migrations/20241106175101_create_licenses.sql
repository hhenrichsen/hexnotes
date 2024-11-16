CREATE TABLE public.user_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users NOT NULL,
    license_id INTEGER,
    payment_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.user_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User can read thier payments."
ON public.user_payments FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

ALTER TABLE public.profiles 
    ADD COLUMN license_id INTEGER DEFAULT 0, 
    ADD COLUMN payment_pending BOOLEAN DEFAULT FALSE;
