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
          uploadFile(csv);
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

        const file_to_send = new FormData().append('csvData', file);

        $.ajax({
          url: '/api/import',
          method: 'POST',
          data: file_to_send,
          processData: false
        })
        .done(data => console.log(data))
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
