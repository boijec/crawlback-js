# CrawlBackJS
NodeJS server simulating realtime streaming data over TCP Socket

#### CrawlBackTCP Protocol spec
Max sized packet is 32 bytes long with a message type header of 2 bytes / message footer of 2 bytes.
The payload is padded - 28 bytes long.
```
     2 bytes                     28 bytes                              2 bytes
____________________________________________________________________________________
|               |                                               |                   |
|     header    |                 payload                       |      footer       |
|_______________|_______________________________________________|___________________|
```