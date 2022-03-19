// var input_text  = "OLE OLE OLE.......";



importModalCss();
// https://kit.fontawesome.com/a076d05399.js
function importModalCss() {

    var formCss1 = document.createElement("link");
    formCss1.setAttribute("rel", "stylesheet");
    formCss1.setAttribute("type", "text/css");
    formCss1.setAttribute("href", 'https://videopiper.com/userui/assets/css/videopiperiframecss.css');
    document.getElementsByTagName("head")[0].appendChild(formCss1);

}
console.log(video_piper);

var buttontype = video_piper.widgetType;
var input_text = video_piper.text;
var postiontype = video_piper.position;
var videopiper_video_url = video_piper.video_url;
var videopiper_color = video_piper.backgroundColor;



// var videosource = "https://vod-progressive.akamaized.net/exp=1587029060~acl=%2A%2F1641285447.mp4%2A~hmac=b84f4dec5da7f77307112e44928ace1fab4e8ec8cbfcaf8c9758eedbd37320fd/vimeo-prod-skyfire-std-us/01/2753/15/388769744/1641285447.mp4";

var videosource = videopiper_video_url;

var btn = document.createElement("BUTTON");
var body = document.getElementsByTagName("body")[0];
btn.setAttribute("id", "clicksidebarnew");
// btn.setAttribute("style", "width:20px;height:20px")
body.insertBefore(btn, body.firstChild);


// CHECK DEVICE
window.$classproWE = window.$classproWE || {};

window.$classproWE.mobile_check = function() {
    var check = false;
    (function(a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
            check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};



var finalpopupstyle;
if (postiontype == "right") {

    console.log('is mobile: ', window.$classproWE.mobile_check());

    // var is_mobile = window.$classproWE.mobile_check();
    // if (is_mobile) {
    //     var width = "100%";
    //     openNav(width);
    //     document.getElementById('clicksidebar').style.display = 'none';

    // } else {
    //     var width = "400px";
    //     openNav(width);
    //     document.getElementById('clicksidebar').style.display = 'none';

    // }

    ///////////////////////
    // btn.setAttribute("style", `  position: fixed;
    // bottom: 3%;
    // right: 20px;
    // z-index: 999999;
    // cursor:pointer;border-color:${videopiper_color}`);

    if (buttontype == "btn-text") {
        btn.setAttribute("style", `  position: fixed;
        bottom: 3%;
        right: 20px;
        z-index: 999999;cursor:pointer;background-color:${videopiper_color}`);
    } else {
        btn.setAttribute("style", `position: fixed;
        bottom: 3%;
        right: 20px;
        z-index: 999999;cursor:pointer;`);
    }
    // ////////////////////////

    finalpopupstyle = "video-popup-right";

} else if (postiontype == "left") {


    if (buttontype == "btn-text") {
        btn.setAttribute("style", `  position: fixed;
        bottom: 3%;
        left: 20px;
        z-index: 999999;cursor:pointer;background-color:${videopiper_color}`);
    } else {
        btn.setAttribute("style", `  position: fixed;
        bottom: 3%;
        left: 20px;
        z-index: 999999;cursor:pointer;`);
    }
    // /////////////////////////////
    finalpopupstyle = "video-popup-left";


}
var final_html;

if (buttontype == "circle") {
    { /* <div style="color:#fff">${call_to_action}</div> */ }
    var is_mobile = window.$classproWE.mobile_check();

    var widthdata = "140px";
    // var widthdata = "140px";



    final_html = `
    <div class="overlay" style="width:${widthdata};height:${widthdata};background:linear-gradient(rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 100%);border-radius:50%
    ">
  ${input_text}
  </div>
<video preload="auto" playsinline autoplay muted loop class="cv_float_video_circle" src="${videosource}" style="border: 6px solid ${videopiper_color};

">
</video>
    `;
    btn.setAttribute("class", 'cv_float_button circle-btn');

    // btn.setAttribute("class", 'circle-btn');

} else if (buttontype == "square") {
    var widthdata = "140px";
    btn.setAttribute("class", 'cv_float_button circle-btn');

    var widthdata = "226px";
    var heightdata = "154px";
    // background:linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 100%);
    // dark overlay

    final_html = `    <div class="overlay" id="square-video-click" style="width:${widthdata};height:${heightdata};">
  ${input_text}

    </div>
    <video preload="auto" playsinline autoplay muted loop class="cv_float_video_square"   src="${videosource}" style="border: 6px solid ${videopiper_color}; ">


    </video>


    `;
    // <div class="square-button-outer-layer" id="square-button-outer-layer-id" onclick='removeclick()' >

    // <div class="square-button-inner-layer"> </div>
    // </div>

} else if (buttontype == "btn-text") {

    var widthdata = "226px";
    var heightdata = "154px";
    final_html = `
     <div style="padding-top:5px;padding-bottom:5px;">
    <video preload="auto" playsinline autoplay muted loop class="hot-dog-video-button" src="${videosource}">


    </video>
<div class="hot-dog-button-text">
${input_text}

</div>


</div>
    `;
    btn.setAttribute("class", 'cv_float_button hot-dog-button');
    // btn.setAttribute("style", `background-color:${videopiper_color}`);
    // var all = document.getElementsByClassName('hot-dog-button');
    // all.style.backgroundColor = videopiper_color;

}


document.getElementById('clicksidebarnew').innerHTML = final_html;
////////////////////////

var divelement = document.createElement("div");

divelement.setAttribute("id", "divelemetn");
body.insertBefore(divelement, body.firstChild);

if (buttontype == "squarevideo") {
    document.getElementById('square-video-click').onclick = function() {
        // console.log('is mobile: ', window.$classproWE.mobile_check());

        printsidebarandopen();
        document.getElementById("clicksidebarnew").style.display = "none";

    };

    function removeclick() {
        document.getElementById("clicksidebarnew").style.display = "none";

    }
} else {
    document.getElementById('clicksidebarnew').onclick = function() {
        // console.log('is mobile: ', window.$classproWE.mobile_check());

        printsidebarandopen();
        document.getElementById("clicksidebarnew").style.display = "none";

    };

}





function printsidebarandopen() {

    // var myobj = document.getElementById("mySidenav");
    // if (myobj) {

    //     myobj.remove();

    // }



    var url = `https://videopiper.com/form/${video_piper.product_id}`;


    console.log('is mobile: ', window.$classproWE.mobile_check());
    var is_mobile = window.$classproWE.mobile_check();


    // var url = `http://marketing.org.in/tribeloop/videopiper.html`;
    var desktop_videopiper = ` <div id="videopipier-popup" class="${finalpopupstyle} " >
    <div>
        <div class="piper-close"><span style="position:relative;z-index:9999" id="video-piper-popup-close" onClick="popupshow()">
        <p class="close-vp-x">x</p>
        </span>
        </div>
            <iframe id="preview-frame" frameborder="0" allowtransparency="yes" style="position:absolute;height:100%;border-radius:10px;width:100%" src="${url}"></iframe>

        <div  class="video_powered_byff">Powered by VideoPiper</div>
    </div>
</div>`;
    //     var desktop_videopiper = ` <div id="videopipier-popup" class="${finalpopupstyle} " style="height:400px">
    //     <div>
    //         <div class="piper-close"><span style="position:relative;" id="video-piper-popup-close" onClick="popupshow()">
    //         <p class="close-vp-x">x</p>
    //         </span>
    //         </div>

    //         <iframe id="preview-frame" frameborder="0" allowtransparency="yes" style="width:100%;height:400px;border-radius:10px" src="${url}"></iframe>

    //         <div  class="video_powered_byff">Powered by VideoPiper</div>
    //     </div>
    // </div>`;
    var mobile_videopiper = ` <div id="videopipier-popup"  style="height:100vh; position: fixed;  width: 377px;
    bottom: 5px;
    border-radius: 15px;
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
    z-index: 21474830001!important;
    display: block">
<div>
    <div class="piper-close-mobile"><span style="position:relative;" id="video-piper-popup-close" onClick="popupshow()">
    <p class="close-vp-x">x</p>
    </span>
    </div>
  
    <iframe id="preview-frame" frameborder="0" allowtransparency="yes" style="width:100%;height:100vh;" src="${url}"></iframe>

    <div  class="video_powered_by_mobile">Powered by VideoPiper</div>
</div>
</div>`;


    // document.body.innerHTML += all;
    if (is_mobile) {
        document.getElementById("divelemetn").innerHTML += mobile_videopiper;

    } else {

        document.getElementById("divelemetn").innerHTML += desktop_videopiper;

    }
    // document.getElementById("videopipier-popup").style.display = "block";
    // callthis();
}

// function callthis() {

//     var height = document.getElementById('preview-frame').offsetHeight;
//     alert(height);
//     document.getElementById("preview-frame").style.height = height;

// }

function popupshow() {

    var myobj = document.getElementById("videopipier-popup");

    myobj.remove();
    document.getElementById("clicksidebarnew").style.display = "block";

}