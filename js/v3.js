/**
 * Created by MewX on 12/29/2017.
 */


// set event listeners
document.getElementById('main').addEventListener('scroll', function () {
    scrollMainContent();
});


const translucentStart = 70; // percent
const translucentEnd = 95; // percent
const scrollMaxRange = 30; // percent of 100vh
function scrollMainContent() {
    let mainLayout = document.getElementById("main");
    let mainContentLayout = document.getElementById("main-content");
    // console.log(mainLayout.scrollTop);

    const ratio = mainLayout.scrollTop / window.innerHeight / (scrollMaxRange / 100);
    let translucentCurrent = ratio < 1 ? translucentStart + (translucentEnd - translucentStart) * (ratio) : translucentEnd;
    if (translucentCurrent !== translucentEnd) {
        // set translucent to the main layout
        // TODO: remove this line
        console.log("New: " + translucentCurrent);
        mainContentLayout.style["opacity"] = "" + translucentCurrent / 100;

        // an anime.js solution
        // var easing = anime({
        //     targets: '#main',
        //     opacity: translucentCurrent / 100,
        //     easing: 'easeInOutQuart'
        // });
    }

}


const lineDrawing = anime({
    targets: '#main-logo .lines path',
    strokeDashoffset: [anime.setDashoffset, 0],
    easing: 'easeInOutSine',
    duration: 1500,
    delay: function(el, i) { return i * 250 },
    direction: 'alternate',
    loop: false,
    complete: function(anim) {
        // TODO: make it with animation
        document.getElementById("svg-m").style["fill"] = "#FFFFFF";
        document.getElementById("svg-e").style["fill"] = "#FFFFFF";
        document.getElementById("svg-w").style["fill"] = "#FFFFFF";
        document.getElementById("svg-x").style["fill"] = "#FFFFFF";

        // typingSubtitle();
    }
});


const subtitle = '- who keeps exploring new worlds!';
const subtitleElement = document.getElementById("main-subtitle-p");
function typingSubtitle() {
    if (subtitleElement.innerHTML.length < subtitle.length) {
        subtitleElement.innerHTML += subtitle.charAt(subtitleElement.innerHTML.length);
        setTimeout(typingSubtitle, 40);
    }
}


function test() {
    // replace each letter with a span tag
    let newHTML = "";
    for (let i = 0; i < subtitleElement.innerHTML.length; i ++) {
        let c = subtitleElement.innerHTML[i];
        if (c === ' ') c = "&nbsp;";
        newHTML += "<span class='letter'>" + c + "</span>";
    }
    subtitleElement.innerHTML = newHTML;

    anime.timeline({loop: false})
        .add({
            targets: '#main-subtitle',
            opacity: 1,
            duration: 1000,
            easing: "easeInOutExpo",
        })
        .add({
            targets: '#main-subtitle .line',
            scaleX: [0,1],
            opacity: [0.5,1],
            easing: "easeInOutExpo",
            duration: 900
        }).add({
        targets: '#main-subtitle .letter',
        opacity: [0,1],
        translateX: [40,0],
        translateZ: 0,
        scaleX: [0.3, 1],
        easing: "easeOutExpo",
        duration: 800,
        offset: '-=600',
        delay: function(el, i) {
            return 150 + 25 * i;
        }
    });
}
test();