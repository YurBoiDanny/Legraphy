$(document).ready(function(){
    $('#sidebarCollapse').on('click', function(){
        $('#sidebar').toggleClass('active');
    })    
})

$("#botNavBarMenu").click(function(e) {
    e.preventDefault();
    $('#sidebar').toggleClass('active');
   
});