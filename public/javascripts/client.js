document.addEventListener('DOMContentLoaded', function(){

    if (document.getElementById('dropTarget')){
      DragDrop('#dropTarget', function (files, pos, fileList) {
        console.log('Here are the dropped files', files)
        console.log('Dropped at coordinates', pos.x, pos.y)
        console.log('Here is the raw FileList object if you need it:', fileList)
      
        // `files` is an Array!
        files.forEach(function (file) {
          console.log(file.name)
          console.log(file.size)
          console.log(file.type)
          console.log(file.lastModifiedData)
          console.log(file.fullPath) // not real full path due to browser security restrictions
          console.log(file.path) // in Electron, this contains the actual full path
      
          // convert the file to a Buffer that we can use!
          var reader = new FileReader()
          reader.addEventListener('load', function (e) {
            // e.target.result is an ArrayBuffer
            var arr = new Uint8Array(e.target.result)
            var buffer = new Buffer(arr)
      
            // do something with the buffer!
          })
          reader.addEventListener('error', function (err) {
            console.error('FileReader error' + err)
          })
          reader.readAsArrayBuffer(file)
        })
      })
    }

    if(document.getElementById('export-btn')) {
      prepExportbutton();
    }
    
    function prepExportbutton(){
      let button = document.getElementById('export-btn');
      button.addEventListener('click', (event) => {
        event.preventDefault();
	window.location = '/api/export';
        /*$.get('/api/export', (data) => {
          console.log(data);
        })*/
      });
    }
    
})
