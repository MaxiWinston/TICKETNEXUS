-- You need to run this command in your Supabase SQL Editor to allow the new ticketing system to verify and view tickets.
-- Without this, users will not be able to view their digital tickets after purchasing.

-- Enable selecting tickets globally based on their unguessable UUID
create policy "Anyone with the link can view tickets." 
  on tickets for select using ( true );
