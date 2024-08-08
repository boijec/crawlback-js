import { parseIncoming } from "../message_parser.mjs";

const sampleGET = `GET / HTTP/1.1\r\n
Host: localhost:8080\r\n
Connection: keep-alive\r\n
Cache-Control: max-age=0\r\n
sec-ch-ua: "Opera GX";v="109", "Not:A-Brand";v="8", "Chromium";v="123"\r\n
sec-ch-ua-mobile: ?0\r\n
sec-ch-ua-platform: "Windows"\r\n
Upgrade-Insecure-Requests: 1\r\n
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 OPR/109.0.0.0\r\n
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7\r\n
Sec-Fetch-Site: none\r\n
Sec-Fetch-Mode: navigate\r\n
Sec-Fetch-User: ?1\r\n
Sec-Fetch-Dest: document\r\n
Accept-Encoding: gzip, deflate, br, zstd\r\n
Accept-Language: en-US,en;q=0.9\r\n
Cookie: SLG_G_WPT_TO=en; SLG_GWPT_Show_Hide_tmp=undefined; SLG_wptGlobTipTmp=undefined\r\n`

describe('Parse messages', () => {
  test('Parse standard message', () => {
    const s = parseIncoming('test');
    expect(s).toBe('test');
  });
});

// todo: write some additional artillery tests to send parralel requests to the server
// I'm guessing I'm gonna have to write the TCP socket client in here to test the thing, lol