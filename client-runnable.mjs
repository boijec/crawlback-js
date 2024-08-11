import {Socket} from "net";

const client = new Socket();
let t = false;
client.on('data', function(data) {
    console.log(data)
});
client.on('close', function() {
    console.log("Connection closed");
});
client.connect(8443, '127.0.0.1', function() {
    client.write(Buffer.of(0x17,0x0a));
});