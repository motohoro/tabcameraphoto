/*
スクリーン・ウインドウ・画面サイズをjavascriptで取得する方法まとめ | WEMO
https://wemo.tech/470
長方形の画像データをcanvasで回転させるのにぐだった話 - Qiita
https://qiita.com/ameryu716/items/ac57f5714cf256f73bf2
Canvasで回転する方法
https://lab.syncer.jp/Web/JavaScript/Canvas/9/
スマホ・タブレット( iPhone/Android ) での縦・横向き判定方法と画面回転時の発動イベントのまとめ。+組み合わせの考察 | WEMO
https://wemo.tech/402

*/
window.onload = () => {
    const video = document.querySelector("#camera");
    const canvas = document.querySelector("#picture");
    const se = document.querySelector('#se');
    //アスペクト比 https://tech.arc-one.jp/asepct-ratio
    /* 最大公約数を求める */
    function gcd(x, y) {
        if (y === 0) return x
        return gcd(y, x % y)
    }
    //iPhoneSE2の場合
    // iPhone/iPad/Apple Watch解像度(画面サイズ)早見表 - Qiita
    // https://qiita.com/tomohisaota/items/f8857d01f328e34fb551
    // 縦横関わらずwindow.screen.width=375,window.screen.height=667 単位はpx
    let device_screenwidth = window.screen.availWidth;//window.screen.width 
    let device_screenheight= window.screen.availHeight;//window.screen.height
    var device_angle = window.orientation;// "tate";
    // let screenwidth=window.screen.width
    // let screenheight=window.screen.height
    // if(Math.abs(orientCheck)==90){
    let screenwidth = window.screen.width;
    let screenheight = window.screen.height;
    let camerawidth = screenwidth * 0.8;
    let cameraheight = screenheight * 0.8;
    let ggg = gcd(screenwidth, screenheight);
    let ratio_w = screenwidth / ggg;
    let ratio_h = screenheight / ggg;
    let cameraratio = ratio_w / ratio_h;
    let camerawidth_real = null;
    let cameraheight_real = null;

    let curSTREAM = null;
    /** カメラ設定 */
    let constraints = {
        audio: false,
        video: {
            height: `${camerawidth}`,
            width: `${cameraheight}`,
            aspectRatio: 1.414,//`${cameraratio}`,
            // facingMode: "user"   // フロントカメラを利用する
            facingMode: { exact: "environment" }  // リアカメラを利用する場合
        }
    };

    var initfunc = function(){
        const angle = orientCheck()
        $("#deviceangle").html(angle + ":initfunc");
        if(Math.abs(angle)===90){
            //yoko
            constraints.video.height=camerawidth;
            constraints.video.width = cameraheight;
        }else{
            //tate
            constraints.video.height=cameraheight;
            constraints.video.width = camerawidth;
            constraints.video.height=camerawidth;
            constraints.video.width = cameraheight;

        }
        console.log("screen:"+screenwidth+"="+ screenheight)
        console.log("camera:"+camerawidth+"="+cameraheight)
        $("#log").html(consoleExt.result);
        SyncCamera()


    }
    /*
    jQueryで幅や高さを取得できる７つのメソッドまとめ | PisukeCode - Web開発まとめ
  https://pisuke-code.com/jquery-width-height-get-methods/
  ディスプレイ(画面)やウインドウの横幅・高さを得る方法 - JavaScript TIPSふぁくとりー
  https://www.nishishi.com/javascript-tips/screen-size.html
    */

    //【Javascript】Canvasに何かしら描画されているかどうか判定する方法を考えてみた https://www.doraxdora.com/2019/07/04/post-9009/
    var getRGBASummary = function (elemid) {
        var canvas = document.querySelector(elemid);//$("#sign").get(0);
        var image = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
        var data = image.data;
        var sum = data.reduce(function (prev, current, i, arr) { return prev + current; });
        return sum;
    };
    //端末の向きを調べる、iphoneは180は無いがipadは180あり
    var orientCheck = function () {
        //画面の向きを 0,90,180,-90 のいずれかで取得
        var orientation = window.orientation;
        if (orientation === 0) {
            /*  縦画面時の処理  */
        } else {
            /*  横画面時の処理  */
        }
        return orientation;
    };

    function SyncCamera() {
        // /** カメラ設定 */
        // const constraints = {
        //     audio: false,
        //     video: {
        //         height: `${camerawidth}`,
        //         width: `${cameraheight}`,
        //         aspectRatio: 1.414,//`${cameraratio}`,
        //         // facingMode: "user"   // フロントカメラを利用する
        //         facingMode: { exact: "environment" }  // リアカメラを利用する場合
        //     }
        // };
        /**
         * カメラを<video>と同期
         */
        // httpsのみgetUserMesia使える
        // https://www.lifewithpython.com/2021/03/python-https-server.html
        //[HTML5] カメラのフロントとリアを切り替える
        //https://blog.katsubemakito.net/html5/camera-toggle
        //getUserMedia()で指定できるMediaTrackConstraintsのよもやま - console.lealog();
        //https://lealog.hateblo.jp/entry/2017/08/21/155211
        if(curSTREAM !== null){
            curSTREAM.getVideoTracks().forEach((beforecamera)=>{
                beforecamera.stop();
            });
        }
        navigator.mediaDevices.getUserMedia(constraints)
            .then((stream) => {
                /* MediaStreamオブジェクトからメディアの詳細(解像度とフレームレート)を取得する - CODE Q&A
            https://jpcodeqa.com/q/3c8132571f1d03e9026b7225fff7b865
                */
                curSTREAM = stream;
                console.log("angle:"+orientCheck());
                console.log(window.screen.width +"="+window.screen.height);
                console.log("constraints")
                console.log(constraints)
                // console.log(window.screen.availWidth +"="+window.screen.availHeight);
                console.log(stream.getVideoTracks()[0].getSettings());
                cameraheight_real = stream.getVideoTracks()[0].getSettings().height
                camerawidth_real = stream.getVideoTracks()[0].getSettings().width
                console.log("camera_real"+camerawidth_real+"="+cameraheight_real)
                // orientationchangefunction();
                // video.height = camerawidth_real
                // video.width = cameraheight_real
                video.height = cameraheight_real
                video.width = camerawidth_real
                const angle = orientCheck()
                $("#deviceangle").html(angle + ":synccamera1");
                $("#log").html(consoleExt.result);

/*                 if(Math.abs(angle)===90){
    
                }else{
                    video.height = camerawidth_real
                    video.width = cameraheight_real
                }
                
 */

                let ret = orientationchangefunction()

                video.srcObject = stream;
                video.onloadedmetadata = (e) => {
                    video.play();
                };
            })
            .catch((err) => {
                console.log(err.name + ": " + err.message);
            });

    }

    // SyncCamera();

    // シャッターボタン
    document.querySelector("#shutter").addEventListener("click", () => {
        let angle = orientCheck();
        document.getElementById("deviceangle").innerHTML = angle;

        const ctx = canvas.getContext("2d");
        // 演出的な目的で一度映像を止めてSEを再生する
        video.pause();  // 映像を停止
        //    se.play();      // シャッター音
        setTimeout(() => {
            video.play();    // 0.5秒後にカメラ再開
        }, 500);

        //JavaScript/canvas - drawImageで描くcanvasの画像を左右反転させる
        //http://kimoota.wiki.fc2.com/wiki/JavaScript%2Fcanvas
        // インカメラでは左右が逆になる
        // scale(x, y)－Canvasリファレンス
        // http://www.htmq.com/canvas/scale.shtml
        // ctx.translate(video.width/2,video.height/2)
        // //90度回転
        // ctx.rotate(90*Math.PI/180)
        // ctx.translate(-1 * video.width/2,-1 * video.height/2)
        ctx.save()
//        ctx.translate(parseInt(video.width / 2), parseInt(video.height / 2))
        // alert( parseInt(video.width/2)+"=="+parseInt(video.height/2) )
        var drawwidth = canvas.width;
        var drawheight = canvas.height;
        if (Math.abs(orientCheck()) == "90") {
            var drawwidth = canvas.height;
            var drawheight = canvas.width;
        }

        ctx.translate(parseInt(drawwidth / 2), parseInt(drawheight / 2))
        console.log("draw:"+drawwidth+"="+drawheight+"video:"+video.width+"="+video.height)
        if (orientCheck() === 90) {
            ctx.rotate(90 * Math.PI / 180)
        } else if (orientCheck() === -90) {
            ctx.rotate(270 * Math.PI / 180)
        }
        //   ctx.translate(parseInt(-1 * video.width/2),parseInt(-1 * video.height/2))
        ctx.translate(parseInt(-1 * drawheight / 2), parseInt(-1 * drawwidth / 2))
        // canvasに画像を貼り付ける
        // ctx.drawImage(video, 0, 0, drawwidth, drawheight);
        ctx.drawImage(video, 0, 0, drawheight, drawwidth);
        ctx.restore()

        $(".imgs").each(function (index) {
            console.log($(this).attr("src"));
            if ($(this).attr("src").startsWith("image")) {
                // Canvasをimg要素に変換 https://kurage.ready.jp/jhp_g/html5/cvs-save.html
                // console.log(canvas.toDataURL())
                $(this).attr("src", canvas.toDataURL());
                return false

            }
        });
    });

    var orientationchangefunction = function () {
        let angle = screen && screen.orientation && screen.orientation.angle;
        if (angle === undefined) {
            angle = window.orientation;    // iOS用
        }
        let camerawidth_local = cameraheight;
        let cameraheight_local = camerawidth;
        if (cameraheight_real != null) {
            console.log("camera_real notnull")
            camerawidth_local = cameraheight_real
            cameraheight_local = camerawidth_real
        }
        document.getElementById("deviceangle").innerHTML = angle;
        if (angle === 0) {
            console.log("縦向き");
            dev_orientation = "tate";
            // $("#camera").attr("width", camerawidth_local);
            // $("#camera").attr("height", cameraheight_local);
            console.log(cameraheight_real+"=="+camerawidth_real)
            // $("#camera").attr("width", cameraheight_local);
            // $("#camera").attr("height", camerawidth_local);
            video.height = camerawidth_real
            video.width = cameraheight_real

            $("#picture").attr("width", camerawidth_local);
            $("#picture").attr("height", cameraheight_local);
            // $(".imgs").attr("width", camerawidth_local);
            // $(".imgs").attr("height", cameraheight_local);
            $("#carouselarea").css("width", camerawidth_local);
            $("#carouselarea").css("height", cameraheight_local);


        }
        else {
            console.log("横向き");
            dev_orientation = "yoko"
            $("#camera").attr("height", camerawidth_local);
            $("#camera").attr("width", cameraheight_local);
            $("#picture").attr("height", cameraheight_local);
            $("#picture").attr("width", camerawidth_local);
            // $(".imgs").attr("height",camerawidth);
            // $(".imgs").attr("width",cameraheight);
            $("#carouselarea").css("height", camerawidth_local);
            $("#carouselarea").css("width", cameraheight_local);

        }
        if (camerawidth > cameraheight) {
            $("#picture").attr("width", camerawidth_local)
            $("#picture").attr("height", camerawidth_local)
        } else {
            $("#picture").attr("width", cameraheight_local)
            $("#picture").attr("height", cameraheight_local)

        }
//        SyncCamera();
return true;
    }
    //[HTML5] スマホの縦向き/横向きを検知する https://blog.katsubemakito.net/html5/orientation-angle
    window.addEventListener("orientationchange", () => {
        //向きが変わるたびに呼び出される
        orientationchangefunction();

    });

    $("#clearbtn").click(function(){
        $(".imgs").attr("src","imageA.png")
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0,0,$("#picture").attr("width"),$("#picture").attr("height"))
    });

    // $(window).trigger("orientationchange");
    //orientationchangefunction();
    consoleExt.hook()
    consoleExt.result = '';
    consoleExt.logOutput = true;

    initfunc();

};

// https://qiita.com/k_ui/items/6f2ae599207fa9af323a#%E3%83%96%E3%83%A9%E3%82%A6%E3%82%B6%E4%BA%92%E6%8F%9B%E3%81%A8%E3%81%8B%E8%80%83%E3%81%88%E3%82%8B%E3%81%A8
/*
var methods = ['log', 'warn', 'error', 'info', 'debug', 'dir'];
for (var i in methods){
(function(m) {
    if (console[m]) {
    window[m] = console[m].bind(console);
    } else {
    window[m] = log;
    }
})(methods[i]);
}
*/

// JavaScript console.log を書き換えて出力内容を横取りする。 - Qiita
// https://qiita.com/standard-software/items/5636cc69970a5be00bc0

var isObject = function(value) {
    if (
      (Object.prototype.toString.call(value) === '[object Object]')
      && (!Array.isArray(value))
      && (value !== null)
      && (typeof value !== 'undefined')
    ) {
      return true;
    }
    return false;
  };

  //オブジェクトを文字列化する関数
  //JSON.stringify を利用して
  //  {valueA: 123, valueB: "123"}
  //という形式の文字列を作成する
  var objToString = function(obj) {
    var items = JSON.stringify(obj).split(',');
    items = items.map(function(element, index, array) {
      return element.replace(/(.+:)(.*)/,
        function(string, capture1, capture2) {
          return capture1.replace(/\"/g, '') + capture2;
        }).replace(/:/g, ': ');
      //[:]の前後でcapture1/2に分割して、
      //その後に[:]の前だけ["]を削除して
      //[:]は[: ]に置換
    });
    return items.join(', ');
    //[,]は[, ]に置換
  };

  var consoleExt = {};
  consoleExt.originalConsoleLog = console.log;
  consoleExt.result = '';
  consoleExt.delimiter = ';';
  consoleExt.logOutput = true;

  consoleExt.log = function(message) {
    if (consoleExt.logOutput) {
      consoleExt.originalConsoleLog(message);
    }
    if (isObject(message)) {
      consoleExt.result += objToString(message) + consoleExt.delimiter;
    } else {
      consoleExt.result += message + consoleExt.delimiter;
    }
  };

  consoleExt.hook = function() {
    if (consoleExt.originalConsoleLog === console.log) {
      console.log = consoleExt.log;
    }
  };
  consoleExt.unhook = function() {
    if (consoleExt.originalConsoleLog !== console.log) {
      console.log = consoleExt.originalConsoleLog;
    }
  };


//ServiceWorker
//僕の考えた最強のService Workerキャッシュ戦略で爆速サービスを作った - Qiita
//https://qiita.com/tiwu_dev/items/47e8a7c3e6f2d57816d7
/* 
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(() => {
        console.log('登録成功');
        },() => {
        console.log('登録失敗');
        });
    });
}
 */