/**
 * Created by MewX on 12/29/2017.
 */

// FIXME: not working for MDL
window.onscroll = function() {
    scrollMainContent();
    console.log('ok?');
};

document.getElementById('main').addEventListener('scroll', function () {
    console.log('wow scroll');
    scrollMainContent();
});

function scrollMainContent() {
    let mainLayout = document.getElementById("main");
    console.log(mainLayout.scrollTop);
}
