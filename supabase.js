const SUPABASE_URL =
    "https://ajtysjkywxonecasgjfw.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_SruVRFF8clBx0z_Bq0z4iA_pEPAn0sx";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );