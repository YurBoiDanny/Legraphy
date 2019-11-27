$('[data-toggle="sidebar"]').click(function(e) {
    e.preventDefault();
    $("#wrapperRightSidebar").toggleClass("toggled");
});