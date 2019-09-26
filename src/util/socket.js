import io from 'socket.io-client';

let socket = io();
let handlers = {};

export const SOCKET_EVENTS = {
    PLAYER_JOINED: 'PLAYER_JOINED',
    PLAYER_VOTED: 'PLAYER_VOTED',
    SHOW_CHOICE: 'SHOW_CHOICE',
    REMOVE_CHOICE: 'REMOVE_CHOICE',
};

export const socketHelper = {
    get: () => {
        return socket;
    },
    emit: (eventName, data) => {
        // if (!(eventName in handlers)) {
        //     throw new Error(`no handler(s) for ${eventName}.  Call add first`);
        // }
        socket.emit(eventName, data);
    },
    on: (eventName, handler) => {       
        if (Array.isArray(handlers[eventName])) {
            handlers[eventName] = handlers[eventName].concat(handler);
        } else {
            handlers[eventName] = [handler];
            socket.on(eventName, data => {
                handlers[eventName].forEach(handler => handler(data));
            });
        }      
    },
    off: (eventName) => {
        socket.off(eventName);
        delete handlers[eventName];
    },
    clear: () => {
        Object.keys(handler).forEach(key => socket.off(key));
        handlers = {};
    }
};
