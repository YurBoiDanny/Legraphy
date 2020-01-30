const cm = document.getElementById('custom-cm');
var graphSVG = document.getElementsByTagName('svg')[0]
    
function showContextMenu(show = true)
{
    cm.style.display = show ? 'block' : 'none';
}

window.addEventListener('click',() => {
    showContextMenu(false);
});

graphSVG.addEventListener("scroll", (e) =>{
    console.log(zoom.scale())
});