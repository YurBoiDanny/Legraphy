$(document).ready(function(){

    $('form').on('submit', function(event){
        event.preventDefault();
        // var formData = new FormData($('file')[0]);
    
        //Check 
        if ($('#uploadFile').val()) {
            var formData = new FormData($('#uploadForm')[0]);
            $('#progressBarDiv').css('display', 'block');

            $.ajax({
                xhr : function(){
                    var xhr = new window.XMLHttpRequest();
                    xhr.upload.addEventListener('progress', function(e){      
                        if(e.lengthComputable)
                        {
                            console.log('Bytes Loaded: ' + e.loaded);
                            console.log('Total Size: ' + e.total);
                            console.log('Percentage Uploaded: ' + (e.loaded / e.total));
    
                            var percent = Math.round(((e.loaded/e.total * 100)));
    
                            $('#progressBar').attr('aria-valuenow', percent).css('width', percent + '%').text(percent + '%');
                        }
                    });
                    return xhr;
                },//xml http request
                type : 'POST',
                url : "/upload",
                data : formData,
                processData : false,
                contentType : false,
                success : function() {
                    // $('#uploadSubmitBtn').attr('class', 'btn btn-success').text("Confirm")
                    $('#uploadSubmitBtn').css("display","none");
                    $('#uploadModalCloseBtn').attr("class","btn btn-success").text("Confirm");
                    
                    //alert('File uploaded!');
                
                }
            });
        } else {
            alert('NO FILE SELECTED!');
        }

    });

    $(':file').on('fileselect', function(event, numFiles, label) {
        console.log(numFiles);
        console.log(label);
    });


    $('#uploadModal').on('show.bs.modal', function (e) {
        //Reset Upload Modal to default
        $('#uploadFilenameTF').attr('value','No File Selected');
        $('#uploadSubmitBtn').attr('class','btn btn-primary').css('display','block').text('Upload');
        $('#uploadModalCloseBtn').attr("class","btn btn-danger").text("Cancel");
        $('#progressBarDiv').css('display','none');
        $('#progressBar').attr('aria-valuenow','0').css("width", '0%').text('0%');
        $('#uploadFile').val("")
        //console.log($('#uploadFile').val)
     });
});


$(document).on('change',':file', function(){
    var input = $(this),
        numFiles = input.get(0).files ? input.get(0).files.length : 1,
        label = input.val().replace(/\\/g,'/').replace(/.*\//, '');
    $('#uploadFilenameTF').attr('value', label);
    input.trigger('fileselect',[numFiles,label]);
});

