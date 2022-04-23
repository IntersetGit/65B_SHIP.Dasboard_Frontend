import io from 'socket.io-client';

const config = {
    urlendpoint: 'http://localhost:3001',
}

const socket = io(config.urlendpoint, {
    autoConnect: false,
});
export {
    socket
}
