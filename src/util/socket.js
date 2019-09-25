import io from 'socket.io-client';

let socket = null;
let handlers = {};

export const SOCKET_EVENTS = {
    PLAYER_JOINED: 'PLAYER_JOINED',
    PLAYER_VOTED: 'PLAYER_VOTED',
    SHOW_CHOICE: 'SHOW_CHOICE',
    REMOVE_CHOICE: 'REMOVE_CHOICE',
};

export const socketHelper = {
    init: () => {
        if (socket != null) {
            return;
        }
        socket = io();
    },
    emit: (eventName, data) => {
        if (!socket) {
            this.init();
        }
        // if (!(eventName in handlers)) {
        //     throw new Error(`no handler(s) for ${eventName}.  Call add first`);
        // }
        socket.emit(eventName, data);
    },
    on: (eventName, handler) => {       
        if (!socket) {
            this.init();
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
