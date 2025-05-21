let parentElement = document.getElementById("editor"); 
let editor = new MonacoLiveEditor(parentElement); 

editor.joinWorkspace("markusprograms"); 

editor.onError = (error) => {
    alert(error); 
}; 