export const socket = io("http://localhost:8080");

socket.on("connect", () => {
    console.log("Socket Connected")
})