export const isToday = (date: number | Date): boolean => {
    const d = new Date(date);
    const today = new Date();
    return d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear();
};

export const isTomorrow = (date: number | Date): boolean => {
    const d = new Date(date);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return d.getDate() === tomorrow.getDate() &&
        d.getMonth() === tomorrow.getMonth() &&
        d.getFullYear() === tomorrow.getFullYear();
};

export const isUpcoming = (date: number | Date): boolean => {
    const d = new Date(date);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return d.getTime() > today.getTime();
};

export const isOverdue = (date: number | Date): boolean => {
    const d = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d.getTime() < today.getTime();
};

export const getStartOfDay = (date: number | Date): number => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
};

export const getNextRecurrenceDate = (currentDate: number, type: 'daily' | 'weekly' | 'monthly' | 'yearly'): number => {
    const date = new Date(currentDate);
    switch (type) {
        case 'daily':
            date.setDate(date.getDate() + 1);
            break;
        case 'weekly':
            date.setDate(date.getDate() + 7);
            break;
        case 'monthly':
            date.setMonth(date.getMonth() + 1);
            break;
        case 'yearly':
            date.setFullYear(date.getFullYear() + 1);
            break;
    }
    return date.getTime();
};
