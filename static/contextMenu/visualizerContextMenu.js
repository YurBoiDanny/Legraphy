const cm = document.getElementById('custom-cm');
var graphSVG = document.getElementsByTagName('svg')[0]
    
function showContextMenu(show = true)
{
    cm.style.display = show ? 'block' : 'none';
}

graphSVG.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    showContextMenu();
    cm.style["top"] = e.y + "px";
    cm.style["left"] = e.x + "px";
    console.log('right click!')
    console.log(e);
    //console.log ('e.y = ', e.y, 'and e.x = ', e.x);
    //console.log ('cm.style.top= ', cm.style, 'cm.style.left = ', cm.style.left);
});

window.addEventListener('click',() => {
    showContextMenu(false);
});

graphSVG.addEventListener("scroll", (e) =>{
    console.log(zoom.scale())
});