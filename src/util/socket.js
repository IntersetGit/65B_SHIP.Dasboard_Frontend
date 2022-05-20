import socketClient from 'socket.io-client';


class socket {
    io = () => {
        return socketClient(process.env.REACT_APP_SOCKET_URL, {
            transportOptions: {
                polling: {
                    extraHeaders: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                },
            },
        });

    };
}

export default socket;