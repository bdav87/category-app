document.addEventListener('DOMContentLoaded', function(){

    //Prepare the import area when it is present.
    if (document.getElementById('dropTarget')) {
      const fileForm = $('#fileUploadForm');
      const fileInputElement = $('#fileSelect');

      function initDragDrop(){
        DragDrop('#dropTarget', files => prepareFileData(files[0]))
      }
      initDragDrop()

      fileInputElement.change((event)=> {
        let csv_to_send = event.target.files[0];
        readyImportButton(fileForm, csv_to_send);
      })

      function readyImportButton(form, csv) {
        $('#importButtonArea').show();
        $('#dropInstructions').hide()
        form.submit((event) => {
          event.preventDefault();
          let file_to_send = new FormData();
          file_to_send.append('csvFile', csv);
          uploadFile(file_to_send);
        })
      }
      
      function prepareFileData(file_data){
          return readyImportButton(fileForm, file_data);
      }

      function uploadFile(file) {
        $('#dropInstructions').show()
        $('#importButtonArea').hide();
        $('#resultsArea').show().text(file.name);
        console.log('Submitting this file',file);

        /*
        const file_to_send = new FormData();
        file_to_send.append('csvData', file);
        console.log(file_to_send);
        */
        $.ajax({
          url: '/api/import',
          method: 'POST',
          data: file,
          processData: false,
          contentType: 'false'
        })
        .done(data => console.log(data))
        .fail(err => console.log(err.responseText))
      }

    }
    
    //Prepare the export area when it is present
    if(document.getElementById('exportBtn')) {
      prepExportbutton();
    }
    
    function prepExportbutton(){
      let button = document.getElementById('exportBtn');
      button.addEventListener('click', (event) => {
        event.preventDefault();
	      window.location = '/api/export';

      });
    }
    
})
