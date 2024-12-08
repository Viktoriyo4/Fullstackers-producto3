export const socket = io();

socket.on("connect", () => {
    console.log("Socket Connected")
})