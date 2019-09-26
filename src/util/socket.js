import io from 'socket.io-client';

let socket = null;
let handlers = {};

export const SOCKET_EVENTS = {
    PLAYER_JOINED: 'PLAYER_JOINED',
    PLAYER_VOTED: 'PLAYER_VOTED',
    SHOW_CHOICE: 'SHOW_CHOICE',
    REMOVE_CHOICE: 'REMOVE_CHOICE',
};

const init = () => {
    if (socket === null) {
        socket = io();
    }
    return socket;
}

export const socketHelper = {
    get: () => {
        return init();
    },
    emit: (eventName, data) => {
        if (!socket) {
            init();
        }
        // if (!(eventName in handlers)) {
        //     throw new Error(`no handler(s) for ${eventName}.  Call add first`);
        // }
        socket.emit(eventName, data);
    },
    on: (eventName, handler) => {       
        if (!socket) {
            init();
        }
        if (Array.isArray(handlers[eventName])) {
            handlers[eventName] = handlers[eventName].concat(handler);
        } else {
            handlers[eventName] = [handler];
            socket.on(eventName, data => {
                handlers[eventName].forEach(handler => handler(data));
            });
        }      
    },
    clear: () => {
        if (!socket) {
            return;
        }
        Object.keys(handler).forEach(key => socket.off(key));
        handlers = {};
    }
};
