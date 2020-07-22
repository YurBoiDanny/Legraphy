$(document).ready(function(){
  
             
    //On Click Event for Export Button
    $("#export").click(function(){
        console.log("Button clicked!");
        alert("The export button was clicked!");
        // var tmpData = [["SN", "Name", "Contribution"],
        // [1, "Linus Torvalds", "Linux Kernel"],
        // [2, "Tim Berners-Lee", "World Wide Web"],
        // [3, "Guido van Rossum", "Python Programming"]]
        console.log(glinks);
        var allData = []
        allData.push(glinks);
        allData.push(glinks)
        //Ajax Command to export visualization data as a csv file
        $.ajax({
            url:"/createCsvExport",
            //data: JSON.stringify({tmpData}),
            data: JSON.stringify({glinks}),
            datatype: 'json',
            contentType:"application/json;charset=utf-8",
            type: 'POST',
            success: function(response){
                alert("Export Post Request Sent!");
            },
            error: function(error){
                alert("Export Post Request FAILED");
            }
        });
    })
});