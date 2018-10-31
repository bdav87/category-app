document.addEventListener('DOMContentLoaded', function(){
    $.get('/api/progress', (data) => {
      if (!data.started) {
        $('#dropTarget').css({display: 'flex'});
        $('#importProgressArea').hide();
      } 
      if (data.started) {
        prepareImportUI();
      }
    });

    function prepareImportUI() {
      $('#dropTarget').hide();
      $('#importProgressArea').css({'display':'flex'});
      $('#cancelBtn').click(e => {
        e.preventDefault();
        $.get('/api/cancel');
        $('#cancelAlert').show();
      });
      $('#importErrorLink').click(function(e) {
        e.preventDefault();
        $('#importErrors').toggleClass('visible');
      });

      return importPollingCycle();
    }

    function importPollingCycle(){
      setTimeout(pollProgress, 1000);
    }

    function pollProgress(){
      $.get('/api/progress', (data) => {
        $('#importProgress > .progress-bar').css({'width': `${data.progress[1]}%`}).text(`${data.progress[1]}%`);
        $('#importCount').text(data.progress[0]);
        $('#importProcessed').text(data.created.count);
        $('#importErrorCount').text(data.failed.count);
        $('#importErrors').val(parseErrors(data.failed.messages));
        if (data.complete == false) {
          return importPollingCycle();
        }
        if (data.complete == true) {
          $('#progressHeading').text('Completed');
          $('#cancelBtn').hide();
          $('#restartLink').show().click(() => {
            $.get('/api/restart', (data) => {
              if (data.acknowledged) {
                window.location.reload();
              } else {
                alert('Server not responding')
              }
            })
          });
        }
      })
    }

    function parseErrors(errors) {
      return errors.join('\n');
    }

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
        $('#dropTarget').removeAttr('id');
        $('#importButtonArea').css({'display': 'flex', 'flex-direction': 'column'});
        $('#dropInstructions').hide();
        $('#cancelImport').click((e) => {
          e.preventDefault();
          window.location.reload();
        });
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
        $('.dropzone').hide();
        $('#importButtonArea').hide();
        $('#importAlert').text('Import started, please wait...').show();

        return (
          $.ajax({
          url: '/api/import',
          method: 'POST',
          data: file,
          processData: false,
          contentType: false
        })
        .done((data) => {
          swapUI(data);
        })
        .fail(err => {
          alert(err.responseText);
          window.location.reload();
        }))
      }

      function swapUI(data) {
        if (data['import'] == "started"){
          window.location.reload();
        } else {
          console.log(data);
        }
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
