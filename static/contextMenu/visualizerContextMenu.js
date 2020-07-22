

$(document).ready(function () {
    const cm = document.getElementById('custom-cm');
    var graphSVG = document.getElementsByTagName('svg')[0]

    function showContextMenu(show = true) {
        cm.style.display = show ? 'block' : 'none';
    }


    graphSVG.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        if (cmListenerToggler) showContextMenu();
        cm.style["top"] = e.y + "px";
        cm.style["left"] = e.x + "px";
        cm.style.zIndex = 100;
        console.log('right click!')
        //log ('cm.style.top= ', cm.style, 'cm.style.left = ', cm.style.left);
    });

    // graphSVG.addEventListener('click',() => {
    //     showContextMenu(false);
    // });

    window.addEventListener('click', () => {
        showContextMenu(false);
    });
});