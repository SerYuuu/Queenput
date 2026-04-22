export const formatRp = (val) => {
    if (!val) return 'Rp 0';
    if (val >= 1_000_000) return 'Rp ' + (val / 1_000_000).toFixed(1) + ' jt';
    return 'Rp ' + Number(val).toLocaleString('id-ID');
};

export const formatDateID = (date) => {
    return new Date(date).toLocaleDateString('id-ID', { 
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
    });
};