/**
 * Created by Five on 2016/3/16.
 */
;(function($,doc,win){
    /**
     * formatNumber(12345.999,'#,##0.00');
     *  //out: 12,34,5.99
     * formatNumber(12345.999,'0');
     *  //out: 12345
     * formatNumber(1234.888,'#.0');
     *  //out: 1234.8
     * formatNumber(1234.888,'000000.000000');
     *  //out: 001234.888000
     */
    var formatNumber = function(num, pattern) {
        var strarr = num ? num.toString().split('.') : ['0'];
        var fmtarr = pattern ? pattern.split('.') : [''];
        var retstr = '';

        // 整数部分
        var str = strarr[0];
        var fmt = fmtarr[0];
        var i = str.length - 1;
        var comma = false;
        for (var f = fmt.length - 1; f >= 0; f--) {
            switch (fmt.substr(f, 1)) {
                case '' :
                    if (i >= 0)
                        retstr = str.substr(i--, 1) + retstr;
                    break;
                case '0' :
                    if (i >= 0)
                        retstr = str.substr(i--, 1) + retstr;
                    else
                        retstr = '0' + retstr;
                    break;
                case ',' :
                    comma = true;
                    retstr = ',' + retstr;
                    break;
            }
        }
        if (i >= 0) {
            if (comma) {
                var l = str.length;
                for (; i >= 0; i--) {
                    retstr = str.substr(i, 1) + retstr;
                    if (i > 0 && ((l - i) % 3) == 0)
                        retstr = ',' + retstr;
                }
            } else
                retstr = str.substr(0, i + 1) + retstr;
        }

        retstr = retstr + '.';
        // 处理小数部分
        str = strarr.length > 1 ? strarr[1] : '';
        fmt = fmtarr.length > 1 ? fmtarr[1] : '';
        i = 0;
        for (var f = 0; f < fmt.length; f++) {
            switch (fmt.substr(f, 1)) {
                case '' :
                    if (i < str.length)
                        retstr += str.substr(i++, 1);
                    break;
                case '0' :
                    if (i < str.length)
                        retstr += str.substr(i++, 1);
                    else
                        retstr += '0';
                    break;
            }
        }
        return retstr.replace(/^,+/, '').replace(/\.$/, '');
    };

    var isTiming = false,
        timer,
        planTime,
        startTime,
        stopTime,
        sTime = 1,//1分钟
        text = {
            siteTitle: "5zplus timer 之 100天1分钟笔记法",
            timeUp: "时间到了哦~"
        };

    var remainTimeEl = $('#remainTime'),
        progressBar = $('#progressBar'),
        startWorkBtn = $('#startWorkButton'),
        stopBtn = $('#stopButton'),
        audio = doc.getElementById('audio');


    var getTime = function(t){
        return t*60*1000;
    }


    var startTiming = function(t){
        if(!isTiming){
            isTiming=true;

            planTime = getTime(sTime);
            startTime = +new Date();
            stopTime = startTime + planTime;

            progressBar.addClass('active');
            remainTimeEl.addClass('remainTimeActive');

            startWorkBtn.addClass('disabled');
            stopBtn.removeClass('disabled');
            updateProgress();
            timer = setInterval(updateProgress, 1000);
        }
    };

    var updateProgress = function(){
        var now = +new Date();
        var remainTime = Math.round((stopTime-now)/1000);
        var nH = formatNumber(Math.floor(remainTime/(60*60)) % 24,"00");
        var nM = formatNumber(Math.floor(remainTime/(60)) % 60,"00");
        var nS = formatNumber(Math.floor(remainTime) % 60,"00");

        if(remainTime >= 0){
            var progress = remainTime/ ( planTime / 1000);
            var remainTimeText = ( nH === "00" ? "" : (nH + ":")) + nM + ":" + nS;

            remainTimeEl.text(remainTimeText).attr('title',"剩余时间："+ remainTimeText );
            progressBar.css('width', function(){
                return progress*100+"%";
            });

            doc.title = remainTimeText + "倒计时：" + text.siteTitle;

            if(remainTime === 0){
                timeComing();
            }
        }

    };

    var timeComing = function(){
        stopTiming();
        timeCall();
    };

    var timeCall = function(t){
        audio.play();
        alert(text.timeUp);
    };

    var stopTiming = function(){
        clearTimeout(timer);

        progressBar.removeClass('active');
        remainTimeEl.removeClass('remainTimeActive');

        startWorkBtn.removeClass('disabled');
        stopBtn.addClass('disabled');

        doc.title = text.siteTitle;

        isTiming = false;
    };

    startWorkBtn.on('click', function(e){
        startTiming();

    });

    stopBtn.on('click', function(e){
        timeComing();
    });


})(jQuery,document,window)