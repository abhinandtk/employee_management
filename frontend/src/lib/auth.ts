export const setTokens = (access: string, refresh: string) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('access', access);
        localStorage.setItem('refresh', refresh);
    }
};

export const clearTokens = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
    }
};

export const isAuthenticated = () => {
    if (typeof window !== 'undefined') {
        return !!localStorage.getItem('access');
    }
    return false;
};

export const getUserRole = () => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('access');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                return payload.role; // Assuming role is NOT in JWT. Oh wait.
            } catch (e) {
                return null;
            }
        }
    }
    return null;
};
