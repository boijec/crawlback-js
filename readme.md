# CrawlBackJS
NodeJS server simulating realtime streaming data over TCP Socket

Goal: Let your implemented client record the XY coordinates of a character from a top-down perspective,
moving the character up, down, left or right on each MOVE instuction packet sent form the server.

## Prerequisites
- NodeJS `>= 20.15.0`

## Result
Processing 1,000,000 packets:
```
End of Dump received
processing: 13.241s
```

## CrawlBackTCP Protocol spec
Max sized packet is 32 bytes long with a message type header of 2 bytes / message footer of 2 bytes.
The payload is padded - 28 bytes long.
```
    2 bytes                      28 bytes                             2 bytes
____________________________________________________________________________________
|               |                                               |                   |
|    header     |                 payload                       |       tail        |
|_______________|_______________________________________________|___________________|
```
### Packets

- Client to Server
  - Heartbeat Response
    - Header: `0x31 0x35`
    - Payload: Containing the last seen sequence number
    - Tail: `0x0d 0x0a`
  - Login Request
    - Header: `0x31 0x30`
    - Payload: Containing username and password separated by a `:`
    - Tail: `0x0d 0x0a`
  - Sequence Request
    - Header: `0x33 0x30`
    - Payload: Containing the start sequence number
    - Tail: `0x0d 0x0a`
- Server->Client
  - Heartbeat Request
    - Header: `0x30 0x35`
    - Payload: Static padded text
    - Tail: `0x0d 0x0a`
  - Login Response
    - Header: `0x32 0x30`
    - Payload: Static padded text
    - Tail: `0x0d 0x0a`
  - End of dump
      - Header: `0x39 0x38`
      - Payload: Static padded text
      - Tail: `0x0d 0x0a`
  - Error
    - Header: `0x39 0x39`
    - Payload: Static padded text
    - Tail: `0x0d 0x0a`
  - Move UP
    - Header: `0x31 0x31`
    - Payload: Static padded text
    - Tail: `0x0d 0x0a`
  - Move DOWN
    - Header: `0x31 0x32`
    - Payload: Static padded text
    - Tail: `0x0d 0x0a`
  - Move LEFT
    - Header: `0x31 0x33`
    - Payload: Static padded text
    - Tail: `0x0d 0x0a`
  - Move RIGHT
    - Header: `0x31 0x34`
    - Payload: Static padded text
    - Tail: `0x0d 0x0a`
