import io from 'socket.io-client';

export default io(process.env.REACT_APP_SOCKET_URL, {
    transportOptions: {
        polling: {
            extraHeaders: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        },
    },
});