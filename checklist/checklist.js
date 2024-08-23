const addButton = document.querySelector("#add-checklist");
const checklistTable = document.querySelector("#checklist-table");
const form = document.querySelector("#formChecklist");
const saveButtonWeb = document.getElementById("save-checklist-web");
const saveButtonDevice = document.getElementById("save-checklist-device");
const loadButton = document.getElementById("load-checklist");
const fileInput = document.querySelector("#load-checklist-file");
const modalAjuda = document.querySelector("#modal-ajuda");

const tooltipTriggerList = document.querySelectorAll('[data-tt="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

let submitAction = "/";

let tupla_num = 0;

function storageAvailable(type) {
    let storage;
    try {
        storage = window[type];
        const x = "__storage_test__";
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    } catch (e) {
        return (
        e instanceof DOMException &&
        // everything except Firefox
        (e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === "QuotaExceededError" ||
            // Firefox
            e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
        // acknowledge QuotaExceededError only if there's something already stored
        storage &&
        storage.length !== 0
        );
    }
}

function getFormDataArray(submittedForm, dataID) {
    let array = [];
    for (let element of submittedForm.querySelectorAll(dataID)) {
        if (element.getAttribute("type") === "checkbox") {
            if (element.checked)
                array.push("1");
            else 
                array.push("0");
            continue;
        }
        array.push(element.value);
    }

    return array.toString();
}

function saveToStorage(submittedForm) {
    if (storageAvailable("localStorage")) {
        localStorage.setItem("blocked", getFormDataArray(submittedForm, "#blocked"));
        localStorage.setItem("datadia", getFormDataArray(submittedForm, "#datadia"));
        localStorage.setItem("caixa", getFormDataArray(submittedForm, "#caixa"));
        localStorage.setItem("galao", getFormDataArray(submittedForm, "#galao"));
        localStorage.setItem("vaso", getFormDataArray(submittedForm, "#vaso"));
        localStorage.setItem("balde", getFormDataArray(submittedForm, "#balde"));
        localStorage.setItem("garrafa", getFormDataArray(submittedForm, "#garrafa"));
        localStorage.setItem("pneu", getFormDataArray(submittedForm, "#pneu"));
        localStorage.setItem("piscina", getFormDataArray(submittedForm, "#piscina"));
        localStorage.setItem("pocas", getFormDataArray(submittedForm, "#pocas"));
        localStorage.setItem("pote", getFormDataArray(submittedForm, "#pote"));
        localStorage.setItem("entulho", getFormDataArray(submittedForm, "#entulho"));
        localStorage.setItem("calha", getFormDataArray(submittedForm, "#calha"));
    } else {
        console.log("Storage não está disponível");
    }
}

const saveFormOnWeb = async (e) => {
    const submittedForm = form.cloneNode(true);
    submittedForm.setAttribute("action", submitAction);
    submittedForm.setAttribute("method", "post");
    submittedForm.setAttribute("hidden", "");
    submittedForm.setAttribute("id", "submittedForm");
    
    console.log(form);
    for (let tuple of submittedForm.querySelectorAll("tr[name=tupla]")) {
        if (tuple.getAttribute("blocked") === "true") {
            unblockTuple(tuple);
            let blockedNode = tuple.querySelector("#blocked");
            blockedNode.setAttribute("value", "1");
        }
        
        console.log(tuple);
        for (let checkbox of tuple.querySelectorAll("input[type=checkbox]")) {
            console.log(checkbox);
            if (checkbox.checked) {
                for (let hiddenNode of tuple.querySelectorAll("input[type=hidden]")) {
                    if (hiddenNode.name == checkbox.name) {
                        console.log(hiddenNode);
                        hiddenNode.disabled = true;
                        break;
                    }
                }
            }
        }
    }
    console.log(submittedForm);
    saveToStorage(submittedForm);
    document.getElementById('submitted-form-container').appendChild(submittedForm);
    submittedForm.submit();
    setTimeout(() => {
        window.location.reload(true);
    }, 1000);
}

function unblockTuple(nodeTuple) {
    for (let input of nodeTuple.querySelectorAll("input")) {
        input.removeAttribute("disabled");
    }  
    nodeTuple.querySelector(".del").removeAttribute("disabled");
    nodeTuple.querySelector(".lock > i").setAttribute("class", "bi bi-unlock");
    nodeTuple.querySelector(".lock").classList.remove("btn-unlock");
}

function blockTuple(nodeTuple) {
    for (let input of nodeTuple.querySelectorAll("input")) {
        input.setAttribute("disabled", "");
    }
    nodeTuple.querySelector(".del").setAttribute("disabled", "");
    nodeTuple.querySelector(".lock > i").setAttribute("class", "bi bi-lock");
    nodeTuple.querySelector(".lock").classList.add("btn-unlock");
}

async function loadChecklistData(JSONData) {
    const checklistTableContent = checklistTable.querySelector("#table-content");

    while (checklistTableContent.firstChild) {
        checklistTableContent.removeChild(checklistTableContent.lastChild);
    }

    let dataLength = 0;

    if (typeof(JSONData.datadia) === "undefined") return;

    if (typeof(JSONData.datadia) === "string") {
        dataLength = 1;
    } else {
        dataLength = JSONData.datadia.length;
    }

    for (let i = 0; i < dataLength; i++) {
        let tuple = document.createElement("tr");
        tuple.setAttribute("id", "tupla-" + tupla_num);
        tuple.setAttribute("name", "tupla");
        tuple.setAttribute("class", "align-center");
        tuple.setAttribute("blocked", "false");
        tuple.innerHTML = tupleFormat.replaceAll(":tupleNum:", tupla_num);

        if (typeof(JSONData.datadia) === "string") {
            tuple.querySelector("#datadia").value = JSONData.datadia;
        } else {
            tuple.querySelector("#datadia").value = JSONData.datadia[i];
        }
        
        if (JSONData.caixa[i] === "1")
            tuple.querySelector("#caixa").checked = true;
        if (JSONData.galao[i] === "1")
            tuple.querySelector("#galao").checked = true;
        if (JSONData.vaso[i] === "1")
            tuple.querySelector("#vaso").checked = true;
        if (JSONData.balde[i] === "1")
            tuple.querySelector("#balde").checked = true;
        if (JSONData.pocas[i] === "1")
            tuple.querySelector("#pocas").checked = true;
        if (JSONData.garrafa[i] === "1")
            tuple.querySelector("#garrafa").checked = true;
        if (JSONData.pneu[i] === "1")
            tuple.querySelector("#pneu").checked = true;
        if (JSONData.piscina[i] === "1")
            tuple.querySelector("#piscina").checked = true;
        if (JSONData.pote[i] === "1")
            tuple.querySelector("#pote").checked = true;
        if (JSONData.entulho[i] === "1")
            tuple.querySelector("#entulho").checked = true;
        if (JSONData.calha[i] === "1")
            tuple.querySelector("#calha").checked = true;

        checklistTableContent.append(tuple);

        if (JSONData.blocked[i] === "1") {
            blockTuple(tuple);
            tuple.setAttribute("blocked", "true");
        }
            

        let buttonRemove = document.getElementById("deleteSemana-" + tupla_num);
        let buttonBlock = document.getElementById("blockSemana-" + tupla_num);

        const tupla_id = tupla_num;

        buttonRemove.addEventListener('click', () => {
            checklistTableContent.removeChild(document.getElementById("tupla-" + tupla_id));
        });
        buttonBlock.addEventListener('click', () => {
            if (tuple.getAttribute("blocked") === "true") {
                tuple.setAttribute("blocked", "false");
                unblockTuple(tuple);
                return;
            }
            blockTuple(tuple);
            tuple.setAttribute("blocked", "true");
        });
        tupla_num++;  
    }
} 

const fetchCookies = fetch("/cookies")
  .then((r) => r.json())
  .then((data) => {
    return data;
  });

async function fetchSaveFile(checklistDataURL) {
    return fetch(checklistDataURL)
        .then((r) => r.json())
        .then((data) => {
            return data;
        });
}

function convertLocalStorageToObject() {
    let dataJSON = JSON.stringify(localStorage);
    
    dataJSON = JSON.parse(dataJSON);
    dataJSON.balde = dataJSON.balde.split(",");
    dataJSON.blocked = dataJSON.blocked.split(",");
    dataJSON.caixa = dataJSON.caixa.split(",");
    dataJSON.calha = dataJSON.calha.split(",");
    dataJSON.datadia = dataJSON.datadia.split(",");
    dataJSON.entulho = dataJSON.entulho.split(",");
    dataJSON.galao = dataJSON.galao.split(",");
    dataJSON.garrafa = dataJSON.garrafa.split(",");
    dataJSON.piscina = dataJSON.piscina.split(",");
    dataJSON.pneu = dataJSON.pneu.split(",");
    dataJSON.pocas = dataJSON.pocas.split(",");
    dataJSON.pote = dataJSON.pote.split(",");
    dataJSON.vaso = dataJSON.vaso.split(",");

    console.log(dataJSON);

    return dataJSON;
}

window.addEventListener("DOMContentLoaded", async function (e) {
    const checklistDataJson = convertLocalStorageToObject();
    loadChecklistData(checklistDataJson);
});

form.addEventListener("submit", (e) => {
    saveFormOnWeb(e);
    e.preventDefault();
});

saveButtonWeb.addEventListener("click", (e) => {
    submitAction = "/save-checklist-web";
});

saveButtonDevice.addEventListener("click", (e) => {
    submitAction =  "/save-checklist-device";
});

loadButton.addEventListener("click", async function (e) {
    fileInput.click();
});

addButton.addEventListener("click", function (e) {
    let tuple = document.createElement("tr");
    const checklistTableContent = checklistTable.querySelector("#table-content");
    tuple.setAttribute("id", "tupla-" + tupla_num);
    tuple.setAttribute("name", "tupla");
    tuple.setAttribute("class", "align-center");
    tuple.setAttribute("blocked", "false");
    tuple.innerHTML = tupleFormat.replaceAll(":tupleNum:", tupla_num);

    checklistTableContent.append(tuple);
    let buttonRemove = document.getElementById("deleteSemana-" + tupla_num);
    let buttonBlock = document.getElementById("blockSemana-" + tupla_num);

    const tupla_id = tupla_num;

    buttonRemove.addEventListener('click', () => {
        checklistTableContent.removeChild(checklistTableContent.getElementById("tupla-" + tupla_id));
    });
    buttonBlock.addEventListener('click', () => {
        if (tuple.getAttribute("blocked") === "true") {
            tuple.setAttribute("blocked", "false");
            unblockTuple(tuple);
            return;
        }
        blockTuple(tuple);
        tuple.setAttribute("blocked", "true");
    });
    tupla_num++;    
});

fileInput.addEventListener("change", async () => {
    for (const file of fileInput.files) {
        const checklistDataURL = URL.createObjectURL(file);
        const checklistDataJson = await fetchSaveFile(checklistDataURL);
        loadChecklistData(checklistDataJson);
    }  
});

modalAjuda.querySelector("#btn-advance").addEventListener("click", () => {
    modalAjuda.querySelector("#modal-page-1").setAttribute("hidden", "");
    modalAjuda.querySelector("#btn-advance").setAttribute("disabled", "");
    modalAjuda.querySelector("#btn-advance").setAttribute("class", "btn btn-secondary");
    modalAjuda.querySelector("#btn-close").setAttribute("class", "btn btn-primary");
    modalAjuda.querySelector("#modal-page-2").removeAttribute("hidden", "");
});

modalAjuda.querySelector("#btn-close").addEventListener("click", () => {
    modalAjuda.querySelector("#modal-page-1").removeAttribute("hidden", "");
    modalAjuda.querySelector("#btn-advance").removeAttribute("disabled", "");
    modalAjuda.querySelector("#btn-advance").setAttribute("class", "btn btn-primary");
    modalAjuda.querySelector("#btn-close").setAttribute("class", "btn btn-secondary");
    modalAjuda.querySelector("#modal-page-2").setAttribute("hidden", "");
});

const tupleFormat = `
<th class="td-data text-center">
    <input type="hidden" name="blocked" id="blocked" value="0">
    <div class="form-check">
        <input class="form-control" type="date" name="datadia" id="datadia" required>
    </div>
</th>
<td class="td-check text-center">
    <div class="form-check checkbox-lg">
        <input type="hidden" name="caixa" id="caixaHidden" value="0">
        <input class="form-check-input" type="checkbox" name="caixa" id="caixa" value="1">
    </div>
</td>
<td class="td-check text-center">
    <div class="form-check checkbox-lg">
        <input type="hidden" name="galao" id="galaoHidden" value="0">
        <input class="form-check-input" type="checkbox" name="galao" id="galao" value="1">
    </div>
</td>
<td class="td-check text-center">
    <div class="form-check checkbox-lg">
        <input type="hidden" name="vaso" id="vasoHidden" value="0">
        <input class="form-check-input" type="checkbox" name="vaso" id="vaso" value="1">
    </div>
</td>
<td class="td-check text-center">
    <div class="form-check checkbox-lg">
        <input type="hidden" name="balde" id="baldeHidden" value="0">
        <input class="form-check-input" type="checkbox" name="balde" id="balde" value="1">
    </div>
</td>
<td class="td-check text-center">
    <div class="form-check checkbox-lg">
        <input type="hidden" name="garrafa" id="garrafaHidden" value="0">
        <input class="form-check-input" type="checkbox" name="garrafa" id="garrafa" value="1">
    </div>
</td>
<td class="td-check text-center">
    <div class="form-check checkbox-lg">
        <input type="hidden" name="pneu" id="pneuHidden" value="0">
        <input class="form-check-input" type="checkbox" name="pneu" id="pneu" value="1">
    </div>
</td>
<td class="td-check text-center">
    <div class="form-check checkbox-lg">
        <input type="hidden" name="piscina" id="piscinaHidden" value="0">
        <input class="form-check-input" type="checkbox" name="piscina" id="piscina" value="1">
    </div>
</td>
<td class="td-check text-center">
    <div class="form-check checkbox-lg">
        <input type="hidden" name="pocas" id="pocasHidden" value="0">
        <input class="form-check-input" type="checkbox" name="pocas" id="pocas" value="1">
    </div>
</td>
<td class="td-check text-center">
    <div class="form-check checkbox-lg">
        <input type="hidden" name="pote" id="poteHidden" value="0">
        <input class="form-check-input" type="checkbox" name="pote" id="pote" value="1">
    </div>
</td>
<td class="td-check text-center">
    <div class="form-check checkbox-lg">
        <input type="hidden" name="entulho" id="entulhoHidden" value="0">
        <input class="form-check-input" type="checkbox" name="entulho" id="entulho" value="1">
    </div>
</td>
<td class="td-check text-center">
    <div class="form-check checkbox-lg">
        <input type="hidden" name="calha" id="calhaHidden" value="0">
        <input class="form-check-input" type="checkbox" name="calha" id="calha" value="1">
    </div>
</td>
<td class="td-check text-center">
    <button name="deleteSemana-:tupleNum:" id="deleteSemana-:tupleNum:" class="btn btn-tup del" type="button">
        <i class="bi bi-trash-fill"></i>
    </button>
</td>
<td class="td-check text-center">
    <button name="blockSemana-:tupleNum:" id="blockSemana-:tupleNum:" class="btn btn-tup lock" type="button">
        <i class="bi bi-unlock"></i>
    </button>
</td>`;
