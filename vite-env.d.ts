interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL: string;
    readonly VITE_SUPABASE_ANON_KEY: string;
    // add more env variables here if needed
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}