const CorePlusbutton = document.getElementById("HSICorePlusButton");
const CoreMinusbutton = document.getElementById("HSICoreMinusButton");
const LMSPlusbutton = document.getElementById("LMSPlusButton");
const LMSMinusbutton = document.getElementById("LMSMinusButton");
const CMSPlusbutton = document.getElementById("CMSPlusButton");
const CMSMinusbutton = document.getElementById("CMSMinusButton");
const EHSPlusbutton = document.getElementById("EHSPlusButton");
const EHSMinusbutton = document.getElementById("EHSMinusButton");
const OSHAPlusbutton = document.getElementById("OSHAPlusButton");
const OSHAMinusbutton = document.getElementById("OSHAMinusButton");

const Coredisplay = document.getElementById("HSICorePlusDisplay");
const LMSdisplay = document.getElementById("LMSDisplay");
const CMSdisplay = document.getElementById("CMSDisplay");
const EHSdisplay = document.getElementById("EHSDisplay");
const OSHAdisplay = document.getElementById("OSHADisplay");
const shiftDisplay = document.getElementById("shiftCounter");

const CustomTheme = document.getElementById("CustomTheme");
const dialog = document.getElementById("CustomThemeInput");
const cancelButton = document.getElementById("CancelCustomTheme");
const themeList = document.getElementById("CustomThemeList1");
const themeForm = dialog.querySelector("form");

const HelpButton = document.getElementById("Help");
const HelpText = document.getElementById("HelpButton2");
const HelpDialoge = HelpText.querySelector("form");
const CloseHelp = document.getElementById("CloseHelp");

const DeleteEllipse = document.getElementById("DeleteEllipse");
const DeleteDialoge = document.getElementById("DeleteReq");
const DeleteConfirm = DeleteDialoge.querySelector("form");
const deleteRow = document.getElementById("DeleteRow");

const resetButton = document.getElementById("ResetButton");
const resetDialog = document.getElementById("resetDialog");
const resetConfirm = resetDialog.querySelector("form");
const confirmReset = document.getElementById("ConfirmReset");
const cancelReset = document.getElementById("CancelReset");

const summaryButton = document.getElementById("summaryView");
const summaryDialog = document.getElementById("summaryDialog");
const summaryConfirm = summaryDialog.querySelector("form");
const summaryClose = document.getElementById("closeSummary");
const emailSummary = document.getElementById("emailSummary");
const emailDialog = document.getElementById("emailDialog");
const emailConfirm = emailDialog.querySelector("form");
const emailClose = document.getElementById("closeEmail");
const emailSend = document.getElementById("sendEmail");
const emailForm = emailDialog.querySelector("form");

const navBar = document.querySelector("#navbarDropdown");
const navMenu = document.querySelector(".dropdown-menu");

const ellipseSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" fill="currentColor" class="bi bi-three-dots-vertical" viewBox="0 0 16 16">
  <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
</svg>`;

const agentBar = document.querySelector("#agentDropdown");
const agentMenu = document.querySelector(".agentMenu");

const signout = document.getElementById("logout");

let containerCount = 3;

function exportTableToCSV(filename) {
    const agentIdentifier = document.getElementById("agentID");
    const table = document.getElementById("data-table");
    let csv = [];
    const rows = table.querySelectorAll("tr");

    for (const row of rows) {
        const cols = row.querySelectorAll("td, th");
        const rowData = [];
        
        for (const col of cols) {
            let data = col.innerText.replace(/"/g, '""'); 
            rowData.push(`"${data}"`);
        }
        csv.push(rowData.join(","));
    }

    csv.push("Shift End:");
    csv.push(time + ", " + dateString);
    csv.push("Shift Number:" + "," + shiftCount);
    csv.push(agentIdentifier.innerText);

    const csvFile = new Blob([csv.join("\n")], { type: "text/csv" });

    const csvString = csv.join("\n");

    const base64Content = btoa(csvString);

    return base64Content;
}

const now = new Date();
const dateString = now.toLocaleDateString();
const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

function updateSpreadsheet() {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = "";

    summaryList.forEach((theme, index) => {
        const row = `
            <tr>
                <td>${theme.name}</td>
                <td>${theme.count}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
};

function incrementTheme(idx) {
    summaryList[idx].count++;
    updateSpreadsheet();
}

function updateCoreUI() {
    Coredisplay.textContent = Corecount;
    CoreMinusbutton.disabled = (Corecount === 0);
    CorePlusbutton.disabled = (Corecount === 300);
    persistence();
}

function updateLMSUI() {
    LMSdisplay.textContent = LMScount;
    LMSMinusbutton.disabled = (LMScount === 0);
    LMSPlusbutton.disabled = (LMScount === 300);
    persistence();
}

function updateCMSUI() {
    CMSdisplay.textContent = CMScount;
    CMSMinusbutton.disabled = (CMScount === 0);
    CMSPlusbutton.disabled = (CMScount === 300);
    persistence();
}

function updateEHSUI() {
    EHSdisplay.textContent = EHScount;
    EHSMinusbutton.disabled = (EHScount === 0);
    EHSPlusbutton.disabled = (EHScount === 300);
    persistence();
}

function updateOSHAUI() {
    OSHAdisplay.textContent = OSHAcount;
    OSHAMinusbutton.disabled = (OSHAcount === 0);
    OSHAPlusbutton.disabled = (OSHAcount === 300);
    persistence();
}

function loadCoreUI() {
    Coredisplay.textContent = Corecount;
}

function loadLMSUI() {
    LMSdisplay.textContent = LMScount;
}

function loadCMSUI() {
    CMSdisplay.textContent = CMScount;
}

function loadEHSUI() {
    EHSdisplay.textContent = EHScount;
}

function loadOSHAUI() {
    OSHAdisplay.textContent = OSHAcount;
}

function updateShift() {
    shiftDisplay.textContent = shiftCount;
}

let Corecount = 0;
let LMScount = 0;
let CMScount = 0;
let EHScount = 0;
let OSHAcount = 0;
let shiftCount = 1;


CorePlusbutton.addEventListener("click", () => {
    Corecount++;
    Coredisplay.textContent = Corecount;
    summaryList[0].count = Corecount;
    updateSpreadsheet();
    updateCoreUI();
});

CoreMinusbutton.addEventListener("click", () => {
    if (Corecount > 0) {
        Corecount--;
        Coredisplay.textContent = Corecount;
        summaryList[0].count = Corecount;
        updateSpreadsheet();
        updateCoreUI();
    }});

LMSPlusbutton.addEventListener("click", () => {
    LMScount++;
    LMSdisplay.textContent = LMScount;
    summaryList[1].count = LMScount;
    updateSpreadsheet();
    updateLMSUI();
});

LMSMinusbutton.addEventListener("click", () => {
    if (LMScount > 0) {
        LMScount--;
        summaryList[1].count = LMScount;
        LMSdisplay.textContent = LMScount;
        updateSpreadsheet();
        updateLMSUI();
    }});

CMSPlusbutton.addEventListener("click", () => {
    CMScount++;
    CMSdisplay.textContent = CMScount;
    summaryList[2].count = CMScount;
    updateSpreadsheet();
    updateCMSUI();
});

CMSMinusbutton.addEventListener("click", () => {
    if (CMScount > 0) {
        CMScount--;
        summaryList[2].count = CMScount;
        CMSdisplay.textContent = CMScount;
        updateSpreadsheet();
        updateCMSUI();
    }});

EHSPlusbutton.addEventListener("click", () => {
    EHScount++;
    EHSdisplay.textContent = EHScount;
    summaryList[3].count = EHScount;
    updateSpreadsheet();
    updateEHSUI();
});

EHSMinusbutton.addEventListener("click", () => {
    if (EHScount > 0) {
        EHScount--;
        EHSdisplay.textContent = EHScount;
        summaryList[3].count = EHScount;
        updateSpreadsheet();
        updateEHSUI();
    }});

OSHAPlusbutton.addEventListener("click", () => {
    OSHAcount++;
    OSHAdisplay.textContent = OSHAcount;
    summaryList[4].count = OSHAcount;
    updateSpreadsheet();
    updateOSHAUI();
});

OSHAMinusbutton.addEventListener("click", () => {
    if (OSHAcount > 0) {
        OSHAcount--;
        OSHAdisplay.textContent = OSHAcount;
        summaryList[4].count = OSHAcount;
        updateSpreadsheet();
        updateOSHAUI();
    }});

CustomTheme.addEventListener("click", () => {
    dialog.showModal();
    navMenu.classList.toggle("show");
});

cancelButton.addEventListener("click", () => {
    dialog.close("cancel");
    themeForm.reset();
    
});

dialog.addEventListener("close", () => {
    const themeName = document.getElementById("CustomThemeName").value;
    createCustomTheme(themeName, 0);
    themeForm.reset();
});

function createCustomTheme(customName, customCount) {
        const namePlaceholder = customName;
        const countPlaceholder = customCount;

        const newThemeName = namePlaceholder;

        if (newThemeName !== "") {
  
    const themeRow = document.createElement("div");
    // themeRow.classList.add("col");
    themeRow.setAttribute("class", "d-flex justify-content-between align-items-center");
    // themeRow.style.display = "flex";
    // themeRow.style.alignItems = "center";
    // themeRow.style.gap = "15px";

    let count = countPlaceholder;

    const themeText = document.createElement("p");
    themeText.setAttribute("class", "boxes");
    themeText.innerHTML = `${newThemeName}: <span class="count-display">${count}</span>`;
    

    const countDisplay = themeText.querySelector(".count-display");

    let uniqueID = crypto.randomUUID();
    const summaryNew = {
        id: uniqueID,
        name: newThemeName,
        count: count
    };

    const plusBtn = document.createElement("button");
    plusBtn.classList.add("plusBtn1");
    plusBtn.setAttribute("class", "btn btn-outline-dark plusBtn1");
    plusBtn.textContent = "+";
    plusBtn.onclick = () => {
        count++;
        countDisplay.textContent = count;
        updateCount();

        let themeIndex = summaryList.findIndex(item => item.id === uniqueID);
        if (themeIndex !== 1) {
            summaryList[themeIndex].count = count;
        };
        updateSpreadsheet();
        persistence();
    };

    const minusBtn = document.createElement("button");
    minusBtn.textContent = "-";
    minusBtn.classList.add("minusBtn1");
    minusBtn.setAttribute("class", "btn btn-outline-dark minusBtn1");
    minusBtn.disabled = true;
    function updateCount() {
        countDisplay.textContent = count;
        minusBtn.disabled = (count === 0);
        plusBtn.disabled = (count === 300);
    }
    minusBtn.onclick = () => {
        if (count > 0) {
            count--;
            countDisplay.textContent = count;
            updateCount();
            let themeIndex = summaryList.findIndex(item => item.id === uniqueID);
            if (themeIndex !== 1) {
                summaryList[themeIndex].count = count;
            };
            updateSpreadsheet();
            persistence();
        }
    };

    const deleteEllipse = document.createElement("div");
    deleteEllipse.classList.add("DeleteEllipse");
    deleteEllipse.insertAdjacentHTML('beforeend', ellipseSVG);

    const rightSide = document.createElement("div");
    rightSide.setAttribute("class", "right-side d-flex justify-content-between align-items-center")
    rightSide.appendChild(plusBtn);
    rightSide.appendChild(minusBtn);
    rightSide.appendChild(deleteEllipse);

    const deleteVar = document.createElement("button");
    deleteVar.classList.add("DeleteVar");
    deleteVar.setAttribute("class", "btn btn-danger btn-sm buttons");
    deleteVar.textContent = "Delete";
    const DeleteReqText = "DELETE";

    deleteEllipse.onclick = () => {
        if (deleteVar.isConnected === true) {
                deleteEllipse.removeChild(deleteVar);
        }
        else {
            deleteEllipse.appendChild(deleteVar);
            const cancelDelete = document.getElementById("CancelDelete");
                    deleteVar.onclick = () => {
                        DeleteDialoge.showModal();
                        cancelDelete.onclick = () => {
                            DeleteDialoge.close("close");
                            DeleteConfirm.reset();
                        }
                        DeleteConfirm.onsubmit = (e) => {
                            const DeleteInput = document.getElementById("Deletion").value;
                            if (DeleteInput === DeleteReqText) {
                                if (container.childElementCount === 0) {
                                    containerDelete = document.querySelector(`[data-id="${uniqueID}"]`);
                                    console.log(containerDelete.closest(".container"));
                                    containerDelete.closest(".container").remove()
                                }
                                console.log(uniqueID);
                                e.preventDefault();
                                const test = document.querySelector(`[data-id="${uniqueID}"]`);
                                themeRow.removeChild(rightSide);
                                themeRow.removeChild(themeText);
                                console.log(test);
                                test.closest(".col").remove();
                                DeleteDialoge.close("close");
                                DeleteConfirm.reset();
                                updateSpreadsheet();
                                // persistence();
                            }
                            else if (DeleteInput != DeleteReqText) {
                                    alert("Incorrect input. Please type 'DELETE' to confirm.");
                                    DeleteConfirm.reset();
                            };
            };
        };
    };
};
    const container = document.getElementById(`container${containerCount}`);
    let count1 = container.childElementCount;

    if (container.childElementCount == 2) {
        containerCount++;
    }

    if (count1 == 2) {
        const newContainer = document.createElement("div");
        newContainer.setAttribute("class", "container");
        newContainer.setAttribute("id", `container${containerCount}.1`);
        const newRow = document.createElement("div");
        newRow.setAttribute("class", "row");
        newRow.setAttribute("id", `container${containerCount}`);
        const newCol = document.createElement("div");
        newCol.setAttribute("class", "col");
        newCol.setAttribute("data-id", uniqueID);

        themeRow.appendChild(themeText);
        themeRow.appendChild(rightSide);
        newCol.appendChild(themeRow);
        newRow.appendChild(newCol);
        newContainer.appendChild(newRow);
        document.body.appendChild(newContainer);
    }
    else {
        newCol = document.createElement("div");
        newCol.setAttribute("class", "col");
        newCol.setAttribute("data-id", uniqueID);

        themeRow.appendChild(themeText);
        themeRow.appendChild(rightSide);
        newCol.appendChild(themeRow);
        container.appendChild(newCol);
    }

    summaryList.push(summaryNew);

    updateSpreadsheet();
}
};

HelpButton.addEventListener("click", () => {
    HelpText.showModal();
    navMenu.classList.toggle("show");
});

CloseHelp.addEventListener("click", () => {
    HelpText.close("close");
});

resetButton.addEventListener("click", () => {
    resetDialog.showModal();
    navMenu.classList.toggle("show");
});

confirmReset.addEventListener("click", () => {
    resetDialog.close("close");    
    Corecount = 0;
    updateCoreUI();
    LMScount = 0;
    updateLMSUI();
    CMScount = 0;
    updateCMSUI();
    EHScount = 0;
    updateEHSUI();
    OSHAcount = 0;
    updateOSHAUI();
    summaryList = [
        {name: "HSI Core", count: Corecount},
        {name: "LMS HSI", count: LMScount},
        {name: "CMS", count: CMScount},
        {name: "EHS", count: EHScount},
        {name: "OSHA", count: OSHAcount}
    ];
    updateSpreadsheet();
    persistence();
    CustomTheme.disabled = false;
    location.reload();
    // shiftCount++;
    // updateShift();
});

cancelReset.addEventListener("click", () => {
    resetDialog.close("cancel");
});

function disableButtons() {
                const plusBtn = document.querySelectorAll(".plusBtn1");
                const minusBtn = document.querySelectorAll(".minusBtn1");
                CorePlusbutton.disabled = true;
                CoreMinusbutton.disabled = true;
                LMSPlusbutton.disabled = true;
                LMSMinusbutton.disabled= true;
                CMSPlusbutton.disabled = true;
                CMSMinusbutton.disabled = true;
                EHSPlusbutton.disabled = true;
                EHSMinusbutton.disabled = true;
                OSHAPlusbutton.disabled = true;
                OSHAMinusbutton.disabled = true;
                CustomTheme.disabled = true;
                plusBtn.forEach(btn => {btn.disabled = true});
                minusBtn.forEach(btn => {btn.disabled = true});
                };

summaryButton.addEventListener("click", () => {
    summaryDialog.showModal();
    navMenu.classList.toggle("show");

    emailSummary.addEventListener("click", () => {
        emailDialog.showModal();
                    document.getElementById('emailForm').addEventListener('click', async (e) => {
                    const base64Content = exportTableToCSV();
                    e.preventDefault();
                    
                    const data = {
                        Subject: document.getElementById('subject').value,
                        HtmlBody: document.getElementById('body').value,
                        Attachments: [
                            {
                                Filename: (`data_export_${dateString}.csv`),
                                Content: base64Content,
                                ContentType: "text/csv"
                            }
                        ]
                    };
                    try {
                        const response = await fetch('/api/email/send', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(data)
                        });
                        if (response.ok){
                            alert('Email Sent!');
                        }
                        else {
                            alert("Error sending email.");
                        };
                    } 
                    catch (error) {
                        console.log("Error: ", error)
                    }

                    disableButtons();
                    emailDialog.close("close");
                    summaryDialog.close("cancel");
                    emailForm.reset();
        });
});
});

cancelEmail.addEventListener("click", () => {
    emailDialog.close("close");
    emailForm.reset();
});

summaryClose.addEventListener("click", () => {
    summaryDialog.close("cancel")
});

let summaryList = [
    {id: 1, name: "HSI Core", count: Corecount},
    {id: 2, name: "LMS HSI", count: LMScount},
    {id: 3, name: "CMS", count: CMScount},
    {id: 4, name: "EHS", count: EHScount},
    {id: 5, name: "OSHA", count: OSHAcount}
];
updateSpreadsheet();

async function persistence() {
    const tableData = document.getElementById("table-body");
    const allNotes = []
    for (let i = 0; i < tableData.rows.length; i++) {
        let rowData = {
            Id: i + 1,
            Name: tableData.rows[i].cells[0].innerText,
            Count: parseInt(tableData.rows[i].cells[1].innerText)
        };
        allNotes.push(rowData);
        };

    try {
    const persistence = await fetch('/notes', {
        method: 'POST',
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify(allNotes)
    });
    if (persistence.ok) {
        
    }
}    catch (error) {
    console.log("Error persisting data: ", error);
}
};

async function dataRetrieval() {
    try{
        const response = await fetch('/notes');
        if (response.ok) {
            const data = await response.json();

            data.forEach( item => {
                const theme = summaryList.find(theme => theme.id === item.id);
                    
                    function persistVars() {
                        if (item.id === 1) {
                            Corecount = theme.count;
                        };
                        if (item.id === 2) {
                            LMScount = theme.count;
                        };
                        if (item.id === 3) {
                            CMScount = theme.count;
                        };
                        if (item.id === 4) {
                            EHScount = theme.count;
                        };
                        if (item.id === 5) {
                            OSHAcount = theme.count;
                        };
                    };

                if (theme) {
                    theme.count = item.count;

                    persistVars(theme);
                }
                else {
                    createCustomTheme(item.name, item.count);
                }
            });
            updateSpreadsheet();
            loadCoreUI();
            loadLMSUI();
            loadCMSUI();
            loadEHSUI();
            loadOSHAUI();
        };
    }
    catch (error) {
        console.log("Error retrieving data: ", error);
    }
};

document.addEventListener('DOMContentLoaded', function() {
    dataRetrieval();
    const loggedIn = localStorage.getItem("isLoggedIn");

    if (!loggedIn && window.location.pathname.includes("Webpage.html")) {
        window.location.href = "Login.html";
    };
    createID();
});

signout.addEventListener("click", () => {
    logout();
})

function createID() {
    const agentId = document.getElementById("agentUsername");
    const agentName = document.createElement("div");
    const agentLogin = localStorage.getItem("currentUser");

        // const themeText = document.createElement("h1");
        // themeText.innerHTML = `Agent ID: ${agentID}`;
        // themeText.setAttribute("class", "agentStyle");
        // themeText.setAttribute("id", "agentID");

        agentName.innerText = agentLogin;
        agentName.setAttribute("id", "agentID");

        // agentId.appendChild(themeText);
        agentId.appendChild(agentName);
        // console.log(themeText);

    return agentId.innerHTML;
};

function logout() {
    localStorage.clear();
    window.location.href = "Login.html";
}

navBar.addEventListener("click", (e) => {
    e.preventDefault();

    navMenu.classList.toggle("show");

});

agentBar.addEventListener("click", (e) => {
    e.preventDefault();

    agentMenu.classList.toggle("show");

});