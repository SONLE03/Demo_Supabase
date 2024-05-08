import { createClient } from "@supabase/supabase-js";
export const supabaseUrl = "https://bbtrsrmdblgrgfckpziz.supabase.co";
const supabaseKey =
 "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJidHJzcm1kYmxncmdmY2tweml6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMwMTM0NDcsImV4cCI6MjAyODU4OTQ0N30.0idv4SXOAG9vRgSIvfdtbJEcqP4CZ1snuygo8Ck6JiQ";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
    