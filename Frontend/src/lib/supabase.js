import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://voqumevjvcrwiiorykns.supabase.co"
const SUPABASE_ANON_KEY = "sb_publishable_4tjg-QTxhMixmxD261xNeQ_mpVPaaqi"

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
