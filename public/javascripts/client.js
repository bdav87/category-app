document.addEventListener('DOMContentLoaded', function(){

    //Prepare the import area when it is present.
    if (document.getElementById('dropTarget')) {
      const fileForm = $('#fileUploadForm');
      const fileInputElement = $('#fileSelect');

      function initDragDrop(){
        return DragDrop('#dropTarget', files => prepareFileData(files[0]))
      }
      initDragDrop()

      fileInputElement.change((event)=> {
        const csv_to_send = event.target.files[0];
        return readyImportButton(fileForm, csv_to_send);
      })

      function readyImportButton(form, csv) {
        $('#importButtonArea').show();
        $('#dropInstructions').hide();
        form.submit((event) => {
          event.preventDefault();
          event.stopPropagation();
          const file_to_send = new FormData();
          file_to_send.append('csvFile', csv);
          return uploadFile(file_to_send);
        });
      }
      
      function prepareFileData(file_data){
          return readyImportButton(fileForm, file_data);
      }

      function uploadFile(file) {
        $('#dropInstructions').show();
        $('#importButtonArea').hide();
        $('#resultsArea').show().text(file.name);
        console.log('Submitting this file',file.values().next().value);

        return (
          $.ajax({
          url: '/api/import',
          method: 'POST',
          data: file,
          processData: false,
          contentType: false
        })
        .done(data => {
          return console.log(data);
        })
        .fail(err => {
          return console.log(err.responseText);
        }))
      }

    }
    
    //Prepare the export area when it is present
    if(document.getElementById('exportBtn')) {
      return prepExportbutton();
    }
    
    function prepExportbutton(){
      const button = document.getElementById('exportBtn');
      button.addEventListener('click', (event) => {
        event.preventDefault();
	      return window.location = '/api/export';

      });
    }
    
})
