import { createClient } from "@supabase/supabase-js"

const currentTime= new Date();

export let supabaseUrl = 'https://mxvdfimkvwoeqxlkycai.supabase.co'
export let supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14dmRmaW1rdndvZXF4bGt5Y2FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDM0MzY0MjgsImV4cCI6MjAxOTAxMjQyOH0.MB60Xt9392SDM84HyhW8GQ31ShIirgptQasOYpJ2M-A'
export const supabase = createClient(supabaseUrl, supabaseKey)

export function kalkulasiWaktu(newsTime: any) {
    const timeDifference = currentTime.getTime() - new Date(newsTime).getTime();
    const Hari = Math.floor(timeDifference / (24 * 1000 * 60 * 60));
    const Jam = Math.floor(timeDifference / (1000 * 60 * 60));
    const Menit = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const Detik = Math.floor((timeDifference % (1000 * 60)) / 1000);

    if (Hari <= 0 && Jam <= 0 && Menit <= 0) {
        return ` Baru saja`;
    }
    if (Hari <= 0 && Jam <= 0) {
        return ` ${Menit} menit yang lalu`;
    }
    if (Hari <= 0 && Jam > 0) {
        return ` ${Jam} jam yang lalu`;
    }
    if (Hari > 0 && Hari <= 30) {
        return `${Hari} hari yang lalu`;
    }

    if (Hari > 30 && Hari <= 360) {
        const bulan = Math.floor(timeDifference / (24 * 1000 * 60 * 60) / 30);
        return `${bulan} bulan yang lalu`;
    }

    if (Hari > 360) {
        const tahun = Math.floor(timeDifference / (24 * 1000 * 60 * 60) / 360);
        return `${tahun} tahun yang lalu`;
    }
}

