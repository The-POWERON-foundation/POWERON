let parentElement = document.getElementById("editor"); 
let editor = new MonacoLiveEditor(parentElement); 

editor.joinWorkspace("1"); 
editor.onJoinWorkspace = () => {
    console.log("a"); 
    editor.authenticate(getCookie("auth_token")); 
};

editor.onError = (error) => {
    alert(error); 
}; 