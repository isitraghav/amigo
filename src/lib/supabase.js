import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  "https://uwtzbauycxyhqlalcdla.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3dHpiYXV5Y3h5aHFsYWxjZGxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjAxODI3NjEsImV4cCI6MjAzNTc1ODc2MX0.lfoGfjB3LBuUKTyFTKokeG4jNbiHeNg9Q4sn4edk218"
);
