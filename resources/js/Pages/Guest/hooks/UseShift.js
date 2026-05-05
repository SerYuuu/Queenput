import { useState, useEffect } from 'react';

const STORAGE_KEY = 'active_shift';

// Tambahkan parameter currentUser agar hook tahu siapa yang sedang login
export function useShift(currentUser) { 
    const [shiftInp, setShiftInp] = useState({
        name: '',
        date: new Date().toISOString().split('T')[0],
        session: 'Pagi',
    });

    // Validasi data di localStorage berdasarkan user aktif
    const getActiveData = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;

    const parsed = JSON.parse(saved);

    if (!currentUser) return parsed; // ⬅️ FIX penting

    if (currentUser.role === 'owner' || parsed.userId === currentUser.id) {
            return parsed;
        }

        return null;
    };


    const [activeShiftInfo, setActiveShiftInfo] = useState(getActiveData);
    const [shiftActive, setShiftActive] = useState(() => !!getActiveData());

    // Di dalam file UseShift.js
    const startShift = () => {
        if (!shiftInp.name || !currentUser?.id) {
            alert("User belum siap / belum login");
            return;
        }

        const dataToSave = { 
            ...shiftInp, 
            userId: currentUser.id, // ⬅️ jangan pakai optional lagi
            startTime: new Date().toISOString() 
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
        setActiveShiftInfo(dataToSave);
        setShiftActive(true);
    };


    const endShift = (onEnd) => {
        localStorage.removeItem(STORAGE_KEY);
        setShiftActive(false);
        setActiveShiftInfo(null);
        onEnd?.();
    };

    return { shiftActive, activeShiftInfo, shiftInp, handleInputChange: (field, value) => setShiftInp(p => ({...p, [field]: value})), startShift, endShift };
}