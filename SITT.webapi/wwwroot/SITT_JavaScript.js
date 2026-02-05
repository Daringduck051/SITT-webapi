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

function updateCoreUI() {
    Coredisplay.textContent = Corecount;
    CoreMinusbutton.disabled = (Corecount === 0);
    CorePlusbutton.disabled = (Corecount === 300);
}

function updateLMSUI() {
    LMSdisplay.textContent = LMScount;
    LMSMinusbutton.disabled = (LMScount === 0);
    LMSPlusbutton.disabled = (LMScount === 300);
}

function updateCMSUI() {
    CMSdisplay.textContent = CMScount;
    CMSMinusbutton.disabled = (CMScount === 0);
    CMSPlusbutton.disabled = (CMScount === 300);
}

function updateEHSUI() {
    EHSdisplay.textContent = EHScount;
    EHSMinusbutton.disabled = (EHScount === 0);
    EHSPlusbutton.disabled = (EHScount === 300)
}

function updateOSHAUI() {
    OSHAdisplay.textContent = OSHAcount;
    OSHAMinusbutton.disabled = (OSHAcount === 0);
    OSHAPlusbutton.disabled = (OSHAcount === 300);
}

let Corecount = 0;
let LMScount = 0;
let CMScount = 0;
let EHScount = 0;
let OSHAcount = 0;


CorePlusbutton.addEventListener("click", () => {
    Corecount++;
    Coredisplay.textContent = Corecount;
    updateCoreUI();
});

CoreMinusbutton.addEventListener("click", () => {
    if (Corecount > 0) {
        Corecount--;
        Coredisplay.textContent = Corecount;
        updateCoreUI();
    }});

LMSPlusbutton.addEventListener("click", () => {
    LMScount++;
    LMSdisplay.textContent = LMScount;
    updateLMSUI();
});

LMSMinusbutton.addEventListener("click", () => {
    if (LMScount > 0) {
        LMScount--;
        LMSdisplay.textContent = LMScount;
        updateLMSUI();
    }});

CMSPlusbutton.addEventListener("click", () => {
    CMScount++;
    CMSdisplay.textContent = CMScount;
    updateCMSUI();
});

CMSMinusbutton.addEventListener("click", () => {
    if (CMScount > 0) {
        CMScount--;
        CMSdisplay.textContent = CMScount;
        updateCMSUI();
    }});

EHSPlusbutton.addEventListener("click", () => {
    EHScount++;
    EHSdisplay.textContent = EHScount;
    updateEHSUI();
});

EHSMinusbutton.addEventListener("click", () => {
    if (EHScount > 0) {
        EHScount--;
        EHSdisplay.textContent = EHScount;
        updateEHSUI();
    }});

OSHAPlusbutton.addEventListener("click", () => {
    OSHAcount++;
    OSHAdisplay.textContent = OSHAcount;
    updateOSHAUI();
});

OSHAMinusbutton.addEventListener("click", () => {
    if (OSHAcount > 0) {
        OSHAcount--;
        OSHAdisplay.textContent = OSHAcount;
        updateOSHAUI();
    }});

CustomTheme.addEventListener("click", () => {
    dialog.showModal();
});

cancelButton.addEventListener("click", () => {
    dialog.close("cancel");
    themeForm.reset();
});

dialog.addEventListener("close", () => {
    if (dialog.returnValue === "confirm") {
        const newThemeName = document.getElementById("CustomThemeName").value;

        if (newThemeName !== "") {
  
    const themeRow = document.createElement("div");
    themeRow.style.display = "flex";
    themeRow.style.alignItems = "center";
    themeRow.style.gap = "15px";

    let count = 0; 


    const themeText = document.createElement("p");
    themeText.innerHTML = `${newThemeName}: <span class="count-display">0</span>`;
    

    const countDisplay = themeText.querySelector(".count-display");


    const plusBtn = document.createElement("button");
    plusBtn.classList.add("plusBtn1");
    plusBtn.textContent = "+";
    plusBtn.onclick = () => {
        count++;
        countDisplay.textContent = count;
        updateCount();
    };


    const minusBtn = document.createElement("button");
    minusBtn.textContent = "-";
    minusBtn.classList.add("minusBtn1");
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
        }
    };

    const deleteEllipse = document.createElement("div");
    deleteEllipse.classList.add("DeleteEllipse");
    for (let i = 1; i <= 3; i++) {
        const ellipse = document.createElement("div");
        ellipse.classList.add(`Ellipse${i}`);
        deleteEllipse.appendChild(ellipse);
    }


    const deleteVar = document.createElement("button");
    deleteVar.classList.add("DeleteVar");
    deleteVar.textContent = "Delete";
    const DeleteReqText = "DELETE";

    deleteEllipse.onclick = () => {
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
                        e.preventDefault();
                        themeList.removeChild(themeRow);
                        DeleteDialoge.close("close");
                        DeleteConfirm.reset();
                    }
                    else if (DeleteInput != DeleteReqText) {
                            alert("Incorrect input. Please type 'DELETE' to confirm.");
                            DeleteConfirm.reset();
                        };
            };
        };
    };

    themeRow.appendChild(deleteEllipse);
    themeRow.appendChild(themeText);
    themeRow.appendChild(plusBtn);
    themeRow.appendChild(minusBtn);
    themeList.appendChild(themeRow);

    themeForm.reset();
}
    themeForm.reset();
}

});

HelpButton.addEventListener("click", () => {
    HelpText.showModal();
});

CloseHelp.addEventListener("click", () => {
    HelpText.close("close");
});

resetButton.addEventListener("click", () => {
    resetDialog.showModal();
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
    themeList.innerHTML = '';
});

cancelReset.addEventListener("click", () => {
    resetDialog.close("cancel");
});

summaryButton.addEventListener("click", () => {
    summaryDialog.showModal();
});

summaryClose.addEventListener("click", () => {
    summaryDialog.close("cancel")
});