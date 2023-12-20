# このリポジトリについて

中国製の格安 IP セキュリティ・カメラのCGI APIを呼び出す、node jsのサンプルコードです。Typescriptで書いています。


このコードの動作確認したのは、[SV3Cというメーカーのモデル](https://www.amazon.co.jp/dp/B07YY29HBK?tag=picsist-22&linkCode=ogi&th=1&psc=1)。
スマホのCamHiアプリを使えるモデルです。

他のメーカーのモデルでも同様の機能を搭載している物があるようなので、そちらでも動作する可能性があります。

参考にしているのは、ネットで見つけた以下のドキュメント。

[FI9821W-CGI-Commands.pdf](https://www.themadhermit.net/wp-content/uploads/2013/03/FI9821W-CGI-Commands.pdf)

ただし、細かいところでパラメータや出力が異なるので、私が所有しているカメラの実装に合わせています。

カメラのIPアドレスの80ポートでブラウザからアクセスできるWebベースの設定画面が搭載されています。
CGIは基本的に、この設定画面の中で使われているインターフェースです。したがって、Web設定画面のHTMLソースコードを解析することで使い方がわかります。このリポジトリのコードも、上記のドキュメントと合わせて、HTMLソースを解析して実装したものです。

全ての機能を実装したものではないのでご注意下さい。


# サンプルの実行方法

まずは、カメラのIPアドレスやユーザID等を設定します。

```typescript
export const hostname = "xxx.xxx.xxx.xxx";
export const username = "admin";
export const password = "*****";
```

*src/cam-cgi-api.config-sample.ts*の中身を記載して、*src/cam-cgi-app.config.ts*にして下さい。

以下で必要なパッケージのインストールをして、実行ができます。

```bash
npm install
npm run start
```

実行すると、カメラからデータを取得し、ターミナルにJSON形式のオブジェクをテキストとして出力します。

現在、実験的な実装であることもあり、一部のデータの取得のみの実装になっています。

取得できるのは、以下の項目のみです。
- CCApiVideoAttr
- CCApiNetAttr
- CCApiOverlayAttr
- CCApiUserAttr
- CCApiFtpAttr
- CCApiServerInfo
- CCApiNtpAttr
- CCApiMdAlarm
- CCApiSearchWireless


# 呼び出し方法

例えば、Network設定を取得する場合は、以下のように呼び出します。(*src/index.ts*より)

```typescript
  const netattr = await getCCApi<CCApiNetAttr>("CCApiNetAttr");
  console.log(JSON.stringify(netattr, null, " "));
```

結果は以下のようなJSONです。

```json
{
 "dhcpflag": "on",
 "ip": "192.168.0.101",
 "netmask": "255.255.255.0",
 "gateway": "192.168.0.1",
 "dnsstat": 1,
 "fdnsip": "192.168.0.1",
 "sdnsip": "",
 "macaddress": "00:C2:31:8F:C0:DB",
 "networktype": "LAN"
}
```

# 仕組みの説明

カメラのCGIのインターフェースは出力がJavaScriptの変数を記述した形式になっています。例えば、以下のような呼び出しを実行すると...

```bash
% curl "http://username:password@192.168.0.101/web/cgi-bin/hi3510/param.cgi?cmd=getnetattr" 
```

以下のようなテキストが返ってきます。

```javascript
var dhcpflag="on";
var ip="192.168.0.101";
var netmask="255.255.255.0";
var gateway="192.168.0.1";
var dnsstat="1";
var fdnsip="192.168.0.1";
var sdnsip="";
var macaddress="00:C2:31:8F:C0:DB";
var networktype="LAN";
```

ザ・JavaScriptです。JSON(JavaScript Object Notation)でもないのです。

そこで、nodejs のfetch関数を使って、サーバーからテキストを取得し、これをJSとして実行します。そのため、以下のようにサーバーから受け取ったコードを含めたテキストを実行します。（説明のためのサンプルです）

```javascript
  const func = new Function(`
        ${serverText}
        return {dhcpflag, ip, netmask, gateway, dnsstat: parseInt(dnsstat), fdnsip, sdnsip, macaddress, networktype}
      `);
  
  const obj = func();
```

ここで、serverTextは、CGIのAPIが返すテキストです。結果のobjにはJSON形式のデータが入ります。

```json
{
 "dhcpflag": "on",
 "ip": "192.168.0.101",
 "netmask": "255.255.255.0",
 "gateway": "192.168.0.1",
 "dnsstat": 1,
 "fdnsip": "192.168.0.1",
 "sdnsip": "",
 "macaddress": "00:C2:31:8F:C0:DB",
 "networktype": "LAN"
}
```

# 制約

- 値の更新、つまり、setはできません。
- *fetch()* を使うので、nodeのバージョンは、 v18以降が必要です。

