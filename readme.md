# TCP Dumper JS
Nodejs server simulating realtime streaming data over TCP Socket


### Notes
Interesting observation:

Processing when using object pool:
```
avg - use-req: 0.018ms
```
Just the object factory:
```
avg - use-req: 0.025ms
spike - use-req: 0.149ms
```
A very non-indicative benchmark, but still... not using the object pool is causing
processing to spike.
<br />
(This might come in-handy when buffering up a large amount of socket messages later)