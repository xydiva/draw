var HOST_URL = window.location.protocol + "//" + window.location.host + "/r/";

// window size
var viewWidth = view.viewSize.width;
var viewHeight = view.viewSize.height;
var windowWidth = viewWidth;
var windowHeight = viewHeight;
var windowMin = Math.min(windowWidth, windowHeight);
var windowMax = Math.max(windowWidth, windowHeight);

// component sizes
var perfectTextPosY = windowHeight / 5.5;
var perfectTextFontSize = windowHeight / 15;
var helpTextFontSize = windowHeight / 30;
var compareTextFontSize = windowHeight / 25;
var menuWidth = windowMin / 1.1;
var menuHeight = windowHeight / 2.5;
var menuStrokeWidth = windowHeight / 100;
var slideStrokeWidth = windowHeight / 200;
var replayWidth = windowHeight / 25;
var replayPosY = windowHeight / 2;
var menuButtonWidth = windowHeight / 6;
var menuButtonHeight = windowHeight / 15;
var helpWidth = windowMin / 1.2;
var helpHeight = windowHeight / 4;
var arrowWidth = windowMin / 8;
var arrowHeight = windowMin / 6;
var arrowTextFontSize = windowHeight / 30;
var maxCircleRadius = windowMin * 0.45;
var pinRadius = windowMin / 180;

// div 2 sizes
var windowWidth2 = windowWidth / 2;
var windowHeight2 = windowHeight / 2;
var viewWidth2 = viewWidth / 2;
var viewHeight2 = viewHeight / 2;
var pinRadius2 = pinRadius / 2;
var menuWidth2 = menuWidth / 2;
var menuHeight2 = menuHeight / 2;
var menuStrokeWidth2 = menuStrokeWidth / 2;
var menuButtonWidth2 = menuButtonWidth;
var menuButtonHeight2 = menuButtonHeight;
var helpWidth2 = helpWidth / 2;
var helpHeight2 = helpHeight / 2;
var arrowWidth2 = arrowWidth / 2;
var arrowHeight2 = arrowHeight / 2;

// size instances
var windowSize = new Size(windowWidth - 1, windowHeight - 1);
var menuSize = new Size(menuWidth, menuHeight);
var menuButtonSize = new Size(menuButtonWidth, menuButtonHeight);
var helpSize = new Size(helpWidth, helpHeight);

// points
var centerPoint = new Point(viewWidth2, viewHeight2);

// bias
var menuButtonBiasX = windowHeight / 5;
var menuButtonBiasY = windowHeight / 5;
var maxRandomBias = windowHeight / 20;
var minRandomBias = windowHeight / 200;
var helpBiasY = windowHeight / 3;
// var rankBiasY = 0;
// var arrowBiasX = windowMin / 20;
// var versionBiasX = windowMin / 5;
// var tutorialBiasY = windowHeight / 2.5;
var rotateFactor = 200;

var h15 = 15;

// settings
var shared = getCookie('shared').length;
var isiphone = getCookie('isiphone').length;
var circle_played = parseInt(getCookie('circle_played'));
if (!circle_played) {
    circle_played = 0;
}

// init status
var nameSubmitted = false;
var percentage = '0%';
var status = 0;
//var circleRadius = (Math.random() + 2) / 3 * maxCircleRadius;
var circleRadius = windowWidth / 4.5;
var hintLineRotated = 0;
var perfection = 1;
var positionList = Array();
var drawed = null;
var simplified = null;
var saved = false;
var intersections = [];

// log info
// components instances
try {
    var back_rect = new Path.Rectangle(new Point(1, 1), windowSize);
    back_rect.fillColor = 'white';
} catch (err) {
    alert('抱歉，本游戏暂不支持您的浏览器。');
}

// 大边框
var wrap = new Shape.Rectangle({
    point: [(viewWidth2 - circleRadius) / 2, (viewHeight2 - circleRadius) / 2 + h15],
    size: new Size(viewWidth2 + circleRadius, viewHeight2 + circleRadius - h15 * 2),
    strokeColor: 'black',
    strokeJoin: 'round',
    strokeWidth: menuStrokeWidth
});
wrap.visible = false;

// 谁画的比我圆
var aText = new PointText({
    point: [viewWidth2 - compareTextFontSize * 1.5, viewHeight2 - circleRadius - compareTextFontSize * 2 + h15],
    justification: 'center',
    fillColor: 'black',
    fontSize: compareTextFontSize,
    content: '七夕'
});
var bText = new PointText({
    point: [viewWidth2, viewHeight2 - circleRadius - compareTextFontSize * 2 + h15],
    justification: 'center',
    fillColor: 'red',
    fontSize: compareTextFontSize,
    content: '画'
});
var cText = new PointText({
    point: [viewWidth2 + compareTextFontSize, viewHeight2 - circleRadius - compareTextFontSize * 2 + h15],
    justification: 'center',
    fillColor: 'black',
    fontSize: compareTextFontSize,
    content: '爱'
});
var dText = new PointText({
    point: [viewWidth2 + compareTextFontSize * 2, viewHeight2 - circleRadius - compareTextFontSize * 2 + h15],
    justification: 'center',
    fillColor: 'red',
    fontSize: compareTextFontSize,
    content: '心'
});
var compareGroup = new Group(aText, bText, cText, dText);
compareGroup.visible = false;

// circle related 圆心
var center = new Shape.Circle(centerPoint, pinRadius);
center.fillColor = 'grey';

// 参考正圆
// var hintCircle = new Path.Circle(centerPoint, circleRadius);
var hintCircle;
// var jacky1 = new Point(100, 150);
// var jacky2 = new Point(150, 150);
// var jacky3 = new Point(200, 200);

var jacky = new Array(
    466, 285, 481, 261, 496, 241, 511, 222, 525, 205, 540, 190, 558, 176,
    576, 163, 596, 150, 617, 140, 639, 132, 665, 126, 687, 123, 708, 122, 727, 124,
    751, 128, 768, 133, 783, 139, 797, 147, 811, 155, 824, 165, 836, 176,
    848, 187, 861, 203, 872, 219, 880, 234, 888, 251, 894, 275, 899, 296, 901, 314,
    903, 332, 902, 350, 899, 371, 895, 391, 890, 413, 881, 431, 870, 450, 861, 465,
    849, 482, 832, 501, 817, 518, 798, 539, 781, 557, 765, 574, 749, 589,
    734, 605, 716, 621, 697, 641, 680, 658, 661, 676, 638, 699, 620, 718, 599, 739,
    581, 755, 562, 773, 543, 790, 526, 809, 504, 833, 481, 860, 463, 876, 455, 884,

    433, 857, 412, 833, 387, 804, 364, 780, 345, 759, 325, 739, 304, 716, 280, 693,
    259, 672, 237, 650, 207, 620, 177, 588, 146, 555, 114, 513, 91, 479, 77, 455,
    66, 430, 58, 411, 49, 382, 42, 349, 39, 317, 39, 283, 44, 252,
    53, 226, 69, 196, 86, 177, 102, 161, 120, 148, 139, 137, 163, 126, 190, 117,
    212, 113, 234, 110, 259, 112, 282, 114, 303, 118, 324, 126, 343, 135, 364, 148,
    386, 166, 405, 187, 423, 208, 434, 229, 445, 248, 455, 269, 466, 285, 467, 285);

hintCircle = new Path({
    segments: [new Point(parseInt(viewWidth * 0.6 / 1000 * (jacky[0] - 466) + viewWidth2), parseInt(viewWidth * 0.6 / 1000 * (jacky[1] - 500) + viewHeight2))]
});
for (var i = 1; i < jacky.length / 2; i++) {
    hintCircle.add(new Point(parseInt(viewWidth * 0.6 / 1000 * (jacky[i * 2] - 466) + viewWidth2), parseInt(viewWidth * 0.6 / 1000 * (jacky[i * 2 + 1] - 500) + viewHeight2)));
}
/*****************************************************************/



// 参考正圆的边框颜色
hintCircle.strokeColor = 'pink';
hintCircle.strokeWidth = 5;
// 参考正圆的半径
var hintRadiusLine = new Path.Line(new Point(viewWidth2 + circleRadius * 0.6, viewHeight2), new Point(viewWidth2 - circleRadius, viewHeight2));
hintRadiusLine.strokeColor = 'black';
hintRadiusLine.rotate(270, centerPoint);
var hintLongLine = new Path.Line(centerPoint, new Point(viewWidth2 - windowMax, viewHeight2));
hintLongLine.rotate(270, centerPoint);
var perfectText = new PointText({
    point: [viewWidth2, perfectTextPosY],
    justification: 'center',
    fillColor: 'black',
    fontSize: perfectTextFontSize
});
// help part
var helpBox = new Shape.Rectangle({
    point: [viewWidth2 - helpWidth2, helpBiasY - helpHeight2 * 1.8],
    size: helpSize,
    strokeColor: 'black',
    fillColor: 'white',
    strokeJoin: 'round',
    strokeWidth: menuStrokeWidth
});
var helpText = new PointText({
    point: [viewWidth2, helpBiasY / 2],
    justification: 'center',
    fillColor: 'black',
    fontSize: helpTextFontSize
});
helpText.content = '画个爱心\n\n喏,圆心给你了,半径给你了。\n\n点此开始';

var helpGroup = new Group(helpBox, helpText);

helpBox.onMouseUp = function (event) {
    event.preventDefault();
    helpGroup.visible = false;
    status = 1;
};
helpText.onMouseUp = function (event) {
    event.preventDefault();
    helpGroup.visible = false;
    status = 1;
};

// 二维码
var qrGroup;
$.ajax({
    url: HOST_URL + 'batchH5/getUrl?type=2',
    success: function (r) {
        if (r.success) {
            $('#qrcode').qrcode({
                render: "image",
                text: r.value
            });

            var qrcodeUrl = $('#qrcode img').attr('src');
            var qrcode = new Raster({
                source: qrcodeUrl,
                position: [viewWidth2, viewHeight2 + circleRadius * 1.3 - h15]
            });
            qrcode.scale(0.3);

            // 你行你上
            var ucanuup = new PointText({
                point: [viewWidth2, viewHeight2 + circleRadius * 1.8 - h15],
                justification: 'center',
                fillColor: 'black',
                fontSize: helpTextFontSize / 1.5,
                fontWeight: 'bold',
                content: '秀出你的真爱'
            });

            qrGroup = new Group(qrcode, ucanuup);
            qrGroup.visible = false;
        }
        else {
            alert(r.message);
        }
    }
});

var u = navigator.userAgent;
var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);

// 操作按钮
var replayButton = new Raster('retry');
replayButton.position.x = viewWidth2 - menuButtonBiasX / 1.7;
replayButton.position.y = viewHeight2 + menuButtonWidth2 / 1.15 + menuButtonBiasY;
if (isAndroid) {
    replayButton.scale(0.7);
}

var shareButton = new Raster('share');
shareButton.position.x = viewWidth2 + menuButtonBiasX - menuButtonWidth2 / 2;
shareButton.position.y = viewHeight2 + menuButtonWidth2 / 1.15 + menuButtonBiasY;
if (isAndroid) {
    shareButton.scale(0.7);
}

var menuGroup = new Group(replayButton, shareButton);
menuGroup.visible = false;

// menu related events
replayButton.onMouseDown = function (event) {
    replayButton.id = 'retryInActive';
};

replayButton.onMouseUp = function (event) {
    replayButton.id = 'retry';
    event.preventDefault();
    init();
};

shareButton.onMouseDown = function (event) {
    event.preventDefault();

    //loading
    $('#loading').removeClass('hide');

    // 更新画布内容
    // 谁画的比我圆
    wrap.visible = true;
    compareGroup.visible = true;
    // 参考圆
    hintCircle.visible = false;
    hintRadiusLine.visible = false;
    hintLongLine.visible = false;
    // 比例
    perfectText.bringToFront();
    perfectText.position.y = viewHeight2 - h15;
    perfectText.fillColor = 'white';
    perfectText.fontWeight = 'bold';
    perfectText.fontSize = perfectTextFontSize / 1.5;
    // 用户画的圆
    simplified.fillColor = 'red';
    simplified.strokeColor = '#5c0905';
    simplified.strokeWidth = 5;
    simplified.scale(0.8);
    simplified.position.y -= h15;
    // 用户画圆时的轨迹
    drawed.visible = false;
    // 粉色线
    intersections.forEach(function (x) {
        x.remove();
    });
    intersections = [];
    // 按钮
    replayButton.visible = false;
    shareButton.visible = false;

    // 二维码
    qrGroup.bringToFront();
    qrGroup.visible = true;

    setTimeout(function () {
        saveImg();
    }, 500);

    if (!saved) {
        saved = true;
    }
};

function saveImg() {
    var $canvas = $('#canvas');
    var $imgWrap = $('#imgWrap');

    // 重绘到redraw canvas
    var n = $canvas.attr('width') / $canvas.width();
    var $redrawCanvas = $('#redrawCanvas');
    var $redrawCtx = $redrawCanvas[0].getContext('2d');
    $redrawCanvas[0].width = n * (viewWidth2 + circleRadius);
    $redrawCanvas[0].height = n * (viewHeight2 + circleRadius - h15 * 2);
    $redrawCtx.drawImage(
        $canvas[0],
        n * ((viewWidth2 - circleRadius) / 2),
        n * ((viewHeight2 - circleRadius) / 2 + h15),
        n * (viewWidth2 + circleRadius),
        n * (viewHeight2 + circleRadius - h15 * 2),
        0,
        0,
        n * (viewWidth2 + circleRadius),
        n * (viewHeight2 + circleRadius - h15 * 2)
    );
    $redrawCanvas.css({
        width: viewWidth2 + circleRadius,
        height: viewHeight2 + circleRadius - h15 * 2
    });

    var params = {
        base64Url: $redrawCanvas[0].toDataURL(),
        suffix: 'png'
    };
    $.ajax({
        type: 'POST',
        url: HOST_URL + 'uploadBase64',
        contentType: 'application/json;charset=utf-8',
        dataType: "json",
        data: JSON.stringify(params),
        success: function (r) {
            if (r.success) {
                var $img = $('<img>'),
                    $p1 = $('<p>'),
                    $p2 = $('<p>');
                var src = getImgUrl(r.value);
                $img.attr('src', src);
                $img.load(function () {
                    $imgWrap.removeClass('hide');
                    $canvas.addClass('hide');
                    $('#loading').addClass('hide');
                });
                $p1.text('长按 爱心 保存图片!')
                    .css({
                        color: '#C00000',
                        fontSize: 20,
                        fontWeight: 'bold',
                        paddingTop: 5
                    });
                $p2.text('据说转发朋友圈就会有对象')
                    .css({
                        color: 'black',
                        fontSize: 14,
                        fontWeight: 'bold',
                        paddingTop: 2
                    });
                $imgWrap.css({
                    height: viewHeight2 + circleRadius - h15 * 2,
                    top: $('#dlBar').height() * 2
                }).append($img, $p1, $p2);

                // 下载ad
                $('#dlBar').removeClass('hide');
            }
            else {
                alert(r.message);
            }
        }
    });
}

function getImgUrl(fileId) {
    return 'http://jump.word1k.com/r/download/files?fileId=' + fileId;
}

function init() {
    perfection = 1;
    //circleRadius = (Math.random() + 2) / 3 * maxCircleRadius;
    circleRadius = windowWidth / 4.5;
    hintLineRotated = 0;
    percentage = '0%';
    status = 1;
    menuGroup.visible = false;
    hintLineRotated = 0;
    drawed.remove();
    drawed = null;
    intersections.forEach(function (x) {
        x.remove();
    });
    intersections = [];
    hintCircle.remove();
    /*
     hintCircle = new Path.Circle(centerPoint, circleRadius);
     var jacky1 = new Point(100, 150);
     var jacky2 = new Point(150, 150);
     var jacky3 = new Point(200, 150);
     hintCircle = new Path.Curve(jacky1, jacky2, jacky3);
     */
    hintCircle = new Path({
        segments: [new Point(parseInt(viewWidth * 0.6 / 1000 * (jacky[0] - 466) + viewWidth2), parseInt(viewWidth * 0.6 / 1000 * (jacky[1] - 500) + viewHeight2))]
    });
    for (i = 1; i < jacky.length / 2; i++) {
        hintCircle.add(new Point(parseInt(viewWidth * 0.6 / 1000 * (jacky[i * 2] - 466) + viewWidth2), parseInt(viewWidth * 0.6 / 1000 * (jacky[i * 2 + 1] - 500) + viewHeight2)));
    }
    hintCircle.strokeColor = 'pink';
    hintCircle.strokeWidth = 5;
    hintRadiusLine.remove();
    hintRadiusLine = new Path.Line(new Point(viewWidth2 + circleRadius * 0.6, viewHeight2), new Point(viewWidth2 - circleRadius, viewHeight2));
    hintRadiusLine.strokeColor = 'black';
    hintRadiusLine.rotate(270, centerPoint);
    hintLongLine.remove();
    hintLongLine = new Path.Line(centerPoint, new Point(viewWidth2 - windowMax, viewHeight2));
    hintLongLine.rotate(270, centerPoint);
    simplified.remove();
    simplified = null;
    perfectText.content = '';
    document.title = '画个圆';
}

function onFrame(event) {
    if (event.delta > 0.2) {
        event.delta = 0.2;
    }
    if (status === 0) {
        if (!helpText.visible) {
            helpText.bringToFront();
            helpText.visible = true;
        }
        if (loading) {
            loading = false;
        }
    } else if (status === 1) {
        if (hintCircle.visible) {
            opacity = hintCircle.opacity - 2 * event.delta;
            if (opacity < 0) {
                opacity = 0;
                hintCircle.visible = false;
            }
            hintCircle.opacity = opacity;
        }
    } else if (status === 2) {
        if (!hintCircle.visible) {
            hintCircle.visible = true;
        }
        if (hintCircle.opacity < 1) {
            opacity = hintCircle.opacity + 2 * event.delta;
            if (opacity > 1) {
                opacity = 1;
            }
            hintCircle.opacity = opacity;
        } else {

            if (hintLineRotated < 359.9) {
                rotation = event.delta * rotateFactor;
                hintLineRotated += rotation;
                if (hintLineRotated > 360) {
                    rotation = 360 - hintLineRotated + rotation;
                    hintLineRotated = 360;
                }

                hintRadiusLine.rotate(rotation, new Point(viewWidth2, viewHeight2));
                hintLongLine.rotate(rotation, new Point(viewWidth2, viewHeight2));

                var intersectionsDraw = hintLongLine.getIntersections(drawed);
                var intersectionsCircle = hintLongLine.getIntersections(hintCircle);
                var inter1 = centerPoint;
                if (intersectionsDraw.length) {
                    inter1 = intersectionsDraw[0].point;
                }
                var inter2 = inter1;
                if (intersectionsCircle.length) {
                    inter2 = intersectionsCircle[0].point;
                }
                if (!simplified) {
                    simplified = new Path();
                    simplified.visible = false;
                }
                simplified.add(inter1);
                var intersectionLine = new Path.Line(inter1, inter2);
                intersections.push(intersectionLine);
                intersectionLine.strokeWidth = 2;
                intersectionLine.strokeColor = 'pink';
                var distance = inter1.getDistance(inter2);
                perfection -= distance / circleRadius * rotation / 360;
                if (perfection < 0) {
                    perfection = 0;
                }
                perfectText.content = (perfection * 100).toFixed(2) + '%';
            } else {
                if (!simplified.visible) {
                    simplified.closed = true;
                    simplified.smooth();
                    simplified.strokeColor = '#5c0905';
                    simplified.strokeWidth = 5;
                    simplified.opacity = 0;
                    simplified.visible = true;
                } else if (simplified.opacity < 0.8) {
                    opacity = simplified.opacity + event.delta;
                    if (opacity > 1) {
                        opacity = 1;
                    }
                    simplified.opacity = opacity;
                    drawed.opacity = 1 - opacity;
                } else {
                    circle_played = parseInt(getCookie('circle_played'));
                    if (!circle_played) {
                        circle_played = 0;
                    }

                    setCookie('circle_played', circle_played + 1);
                    status = 4;
                }
            }
        }
    } else if (status === 4) {
        if (!menuGroup.visible) {
            menuGroup.bringToFront();
            menuGroup.opacity = 0;
            menuGroup.visible = true;
        }
        if (menuGroup.opacity < 1) {
            opacity = menuGroup.opacity += 5 * event.delta;
            if (opacity > 1) {
                opacity = 1;
            }
            menuGroup.opacity = opacity;
        }
    }
}

function onMouseDown(event) {
    if (status === 1) {
        if (!drawed) {
            drawed = new Path({
                segments: [event.point],
                strokeColor: 'brown',
                strokeWidth: 5
            });
        }
    } else if (status === 3) {
        status = 4;
    }
}

function onMouseDrag(event) {
    if (status === 1) {
        drawed.add(event.point);
    }
}

function onMouseUp(event) {
    if (status === 1) {
        if (drawed) {
            status = 2;
            hintRadiusLine.remove();
            hintRadiusLine = new Path.Line(centerPoint, new Point(viewWidth2 - circleRadius, viewHeight2));
            hintRadiusLine.strokeColor = 'black';
            hintRadiusLine.rotate(270, centerPoint);
        }
    }
}

