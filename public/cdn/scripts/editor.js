buffer.getParentElementInterval = setTimeout(() => {
    buffer.parentElement = document.getElementById("editor"); 

    if (buffer.parentElement) {
        clearInterval(buffer.getParentElementInterval);
        onLoad(); 
    }
}, 1000);

function onLoad() {
    buffer.editor = new MonacoLiveEditor(buffer.parentElement); 
    buffer.editor.joinWorkspace("markusprograms"); 
    buffer.editor.onError = (error) => {
        alert(error); 
    }; 
}