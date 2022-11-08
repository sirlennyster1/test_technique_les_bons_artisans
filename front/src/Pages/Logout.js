import React from 'react'

export default function Logout() {
    React.useEffect(() => {
        localStorage.removeItem('token');
        window.location.href = '/';
    }, [])
}
