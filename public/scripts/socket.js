export const socket = io("https://k2l9wc-8080.csb.app:8080");

socket.on("connect", () => {
    console.log("Socket Connected")
})