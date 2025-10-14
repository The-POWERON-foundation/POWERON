let parentElement = document.getElementById("editor"); 
let editor = new MonacoLiveEditor(parentElement); 

editor.joinWorkspace("1.txt"); 

editor.onError = (error) => {
    alert(error); 
}; 