function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

function createProgramList(element, sandboxUrl, params, advancedSearch = false) {
    let searchBy = "title"; 
    let exactMatch = false; 

    /* Default params that the function was called with */
    let paramsDefault = {
        title: params.title, 
        authorUsername: params.authorUsername, 
        authorNickname: params.authorNickname
    }; 

    let optionsContainer = document.createElement("div");
    optionsContainer.classList.add("options");
    element.appendChild(optionsContainer); 

    /* Ascending / descending switch */
    let ascDescSwitch = document.createElement("div"); 
    ascDescSwitch.classList.add("asc-desc-switch"); 
    optionsContainer.appendChild(ascDescSwitch); 

    let ascDescSwitchHighlight = document.createElement("div");
    ascDescSwitchHighlight.style.left = "0"; 
    ascDescSwitchHighlight.classList.add("options-switch-highlight");
    ascDescSwitch.appendChild(ascDescSwitchHighlight);

    function acsDescSwitchSelect(index) {
        let buttons = ascDescSwitch.children;
        for (let i = 1; i < buttons.length; i++) {
            buttons[i].style.color = "black";
        }
        buttons[index + 1].style.color = "white";

        if (index + 1 === buttons.length) {
            ascDescSwitchHighlight.style.left = `${index * 120 + 5}px`;
            return;
        }
        ascDescSwitchHighlight.style.left = `${index * 120}px`;
    }

    let ascDescSwitchDesc = document.createElement("button");
    ascDescSwitchDesc.textContent = "DESC";
    ascDescSwitchDesc.style.color = "white";
    ascDescSwitchDesc.addEventListener("click", () => {
        acsDescSwitchSelect(0); 

        params.sortOrder = "descending";
        page = 0; 
        changePage(0);
    });
    ascDescSwitch.appendChild(ascDescSwitchDesc);

    let ascDescSwitchAsc = document.createElement("button");
    ascDescSwitchAsc.textContent = "ASC";
    ascDescSwitchAsc.addEventListener("click", () => {
        acsDescSwitchSelect(1);

        params.sortOrder = "ascending";
        page = 0; 
        changePage(0);
    });
    ascDescSwitch.appendChild(ascDescSwitchAsc);

    /* Space */
    let optionsSpace = document.createElement("div");
    optionsSpace.classList.add("options-space");
    optionsContainer.appendChild(optionsSpace);

    /* Hot / Recent / Top switch */
    let optionsSwitch = document.createElement("div");
    optionsSwitch.classList.add("options-switch");
    optionsSpace.appendChild(optionsSwitch);

    let optionsSwitchHighlight = document.createElement("div");
    optionsSwitchHighlight.style.left = "0"; 
    optionsSwitchHighlight.classList.add("options-switch-highlight");
    optionsSwitch.appendChild(optionsSwitchHighlight);

    function optionsSwitchSelect(index) {
        let buttons = optionsSwitch.children;
        for (let i = 1; i < buttons.length; i++) {
            buttons[i].style.color = "black";
        }
        buttons[index + 1].style.color = "white";

        if (index + 1 === buttons.length) {
            optionsSwitchHighlight.style.left = `${index * 120 + 5}px`;
            return;
        }
        optionsSwitchHighlight.style.left = `${index * 120}px`;
    }

    let optionsSwitchHot = document.createElement("button");
    optionsSwitchHot.textContent = "Hot";
    optionsSwitchHot.style.color = "white";
    optionsSwitchHot.addEventListener("click", () => {
        optionsSwitchSelect(0); 

        params.sort = "hot";
        page = 0; 
        changePage(0);
    });
    optionsSwitch.appendChild(optionsSwitchHot);

    let optionsSwitchRecent = document.createElement("button");
    optionsSwitchRecent.textContent = "Recent";
    optionsSwitchRecent.addEventListener("click", () => {
        optionsSwitchSelect(1);

        params.sort = "date";
        page = 0; 
        changePage(0);
    });
    optionsSwitch.appendChild(optionsSwitchRecent);

    let optionsSwitchTop = document.createElement("button");
    optionsSwitchTop.textContent = "Top";
    optionsSwitchTop.addEventListener("click", () => {
        optionsSwitchSelect(2);

        params.sort = "likes";
        page = 0; 
        changePage(0);
    });
    optionsSwitch.appendChild(optionsSwitchTop);

    /* Search */
    let optionsSearch = document.createElement("div");
    optionsSearch.classList.add("form-input"); 
    optionsSearch.classList.add("options-search"); 
    optionsSearch.style.marginBottom = "0"; 
    optionsSearch.style.overflow = "visible"; 
    optionsContainer.appendChild(optionsSearch);

    let optionsSearchIconContainer = document.createElement("div");
    optionsSearchIconContainer.classList.add("form-input-icon-container");
    optionsSearch.appendChild(optionsSearchIconContainer);

    let optionsSearchIcon = document.createElement("img");
    optionsSearchIcon.classList.add("form-input-icon");
    optionsSearchIcon.src = "/cdn/images/search.svg";
    optionsSearchIconContainer.appendChild(optionsSearchIcon);

    let searchInput = document.createElement("input");
    searchInput.classList.add("form-input-text");
    searchInput.classList.add("options-search-input"); 
    searchInput.type = "text";
    searchInput.placeholder = "Search...";
    searchInput.addEventListener("input", () => {
        /* Reset all other search params */
        params.title = paramsDefault.title;  
        params.titleExactMatch = false; 
        params.authorUsername = paramsDefault.authorUsername; 
        params.authorUsernameExactMatch = false; 
        params.authorNickname = paramsDefault.authorNickname; 
        params.authorNicknameExactMatch = false; 

        params[searchBy] = searchInput.value; 
        params[searchBy + "ExactMatch"] = exactMatch; 

        page = 0; 
        changePage(0);
    });
    searchInput.addEventListener("click", (e) => {
        e.stopPropagation(); 

        if (advancedSearch) {
            searchPopup.style.transform = "translateY(0)"; 
            searchPopup.style.opacity = "1"; 
            searchPopup.style.pointerEvents = ""; 
        }
    }); 
    window.addEventListener("click", () => {
        searchPopup.style.transform = "translateY(-10px)"; 
        searchPopup.style.opacity = "0"; 
        searchPopup.style.pointerEvents = "none"; 
    }); 
    optionsSearch.appendChild(searchInput);

    let searchPopup = document.createElement("div"); 
    searchPopup.classList.add("search-popup"); 
    searchPopup.style.transform = "translateY(-10px)"; 
    searchPopup.style.opacity = "0"; 
    searchPopup.style.pointerEvents = "none"; 
    optionsSearch.appendChild(searchPopup); 

    searchPopup.addEventListener("click", (e) => {
        e.stopPropagation(); 
    }); 

    let searchPopupTitle = document.createElement("span"); 
    searchPopupTitle.innerHTML = `
        <b>Search by:</b><br>
        <br>
    `; 
    searchPopup.appendChild(searchPopupTitle); 

    let searchPopupForm = document.createElement("form"); 
    searchPopupForm.innerHTML = `
        <input type="radio" name="searchBy" value="title" checked>Title<br>
        <input type="radio" name="searchBy" value="authorUsername">Author's username<br>
        <input type="radio" name="searchBy" value="authorNickname">Author's nickname<br>
        <br>
        <input type="checkbox" name="exactMatch" value="1">Exact match
    `; 
    searchPopup.appendChild(searchPopupForm); 

    searchPopupForm.addEventListener("click", () => {
        if (searchBy !== searchPopupForm.searchBy.value || exactMatch !== searchPopupForm.exactMatch.checked) { // If search option was changed or exactMatch was changed
            previousSearch = params[searchBy]; // Get the previous search query

            exactMatch = searchPopupForm.exactMatch.checked; 
            searchBy = searchPopupForm.searchBy.value; 

            /* Reset all other search params */
            params.title = paramsDefault.title;  
            params.titleExactMatch = false; 
            params.authorUsername = paramsDefault.authorUsername; 
            params.authorUsernameExactMatch = false; 
            params.authorNickname = paramsDefault.authorNickname; 
            params.authorNicknameExactMatch = false; 
        
            params[searchBy] = previousSearch; // Apply the previous search query to the new query
            params[searchBy + "ExactMatch"] = exactMatch; 

            page = 0; 
            loadPrograms(0); // Reload the programs 
        }
    }); 

    let programsDiv = document.createElement("div");
    programsDiv.classList.add("programs");
    element.appendChild(programsDiv);

    let programPagination = document.createElement("div");
    programPagination.classList.add("pagination");
    element.appendChild(programPagination);

    let previousPageButton = document.createElement("button");
    previousPageButton.style.cursor = "pointer";
    previousPageButton.textContent = "← Previous";
    previousPageButton.addEventListener("click", () => changePage(-1));
    programPagination.appendChild(previousPageButton);

    let pageInfo = document.createElement("span");
    programPagination.appendChild(pageInfo);

    let pageCaption = document.createElement("span");
    pageCaption.textContent = "Page ";
    pageInfo.appendChild(pageCaption);

    let pageElement = document.createElement("span");
    pageElement.textContent = "";
    pageInfo.appendChild(pageElement);

    let pageCaption2 = document.createElement("span");
    pageCaption2.textContent = " of ";
    pageInfo.appendChild(pageCaption2);

    let totalPagesElement = document.createElement("span");
    totalPagesElement.textContent = "";
    pageInfo.appendChild(totalPagesElement);

    let nextPageButton = document.createElement("button");
    nextPageButton.style.cursor = "pointer";
    nextPageButton.textContent = "Next →";
    nextPageButton.addEventListener("click", () => changePage(1));
    programPagination.appendChild(nextPageButton);      

    let page = 0; 
    let totalPages = 0;

    function loader() {
        const loaderCount = 30; 

        for (let i = 0; i < loaderCount; i ++) {
            let programElement = document.createElement("div");
            programElement.classList.add("program");
            programElement.innerHTML = `
                <div class="loader image"></div>
                <h2 class="center small-title loader">---------------</h2>
                <p class="small-subtitle" style="display: flex">Author:&nbsp;<span class="loader" style="flex: 1">-</span></p>
            `;
            programsDiv.appendChild(programElement);
        }
    }

    function loadPrograms(page) {
        programsDiv.innerHTML = ""; // Clear the programs div before loading new programs

        loader(); 

        params.page = page;
        pageElement.innerText = page + 1;

        api.programList(params, (response) => {
            programsDiv.innerHTML = ""; 

            let programs = response.programs;
            totalPages = response.totalPages;
            
            totalPagesElement.innerText = totalPages;

            programs.forEach(program => {
                let programElement = document.createElement("a");
                programElement.href = `${sandboxUrl}/${program.author.username}/${program.url_title}/files/`; 
                programElement.classList.add("program");
                programElement.innerHTML = `
                    <img class="image" src="${ sandboxUrl }/${ program.author.username }/${ program.url_title }/thumbnail.png" alt="${ escapeHtml(program.title) }">
                    <h2 class="center small-title">${ escapeHtml(program.title) }</h2>
                    <p class="small-subtitle">Author: <a href="/profile/${ program.author.username }">${ escapeHtml(program.author.nickname) }</a></p>
                `;
                programsDiv.appendChild(programElement);
            });

            if (page === totalPages - 1) {
                nextPageButton.disabled = true;
                nextPageButton.style.cursor = "not-allowed";
            }

            if (!programs[0] && totalPages === 0) {
                programsDiv.innerHTML = "No programs found.";
                programsDiv.className = "center";
                programPagination.style.display = "none";
            }
            else {
                programsDiv.className = "programs"; 
                programPagination.style.display = "block";
            }
        }); 
    }

    function changePage(change) {
        page += change; 
        loadPrograms(page);

        if (page === 0) {
            previousPageButton.disabled = true;
            previousPageButton.style.cursor = "not-allowed";
        } else {
            previousPageButton.disabled = false;
            previousPageButton.style.cursor = "pointer";
        }

        if (page === totalPages - 1) {
            nextPageButton.disabled = true;
            nextPageButton.style.cursor = "not-allowed";
        } else {
            nextPageButton.disabled = false;
            nextPageButton.style.cursor = "pointer";
        }
    }

    changePage(0);
}