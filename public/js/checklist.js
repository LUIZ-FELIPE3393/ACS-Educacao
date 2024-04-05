const addButton = document.querySelector("#add-checklist");
const checklistTable = document.querySelector("#checklist-table");
const form = document.querySelector("#formChecklist");
const saveButtonWeb = document.getElementById("save-checklist-web");
const saveButtonDevice = document.getElementById("save-checklist-device");
const loadButton = document.getElementById("load-checklist");
const fileInput = document.querySelector("#load-checklist-file");

let tupla_num = 0;

const saveFormOnWeb = (e) => {
    for (let tuple of document.querySelectorAll("tr[name=tupla]")) {
        console.log(tuple);
        for (let checkbox of tuple.querySelectorAll("input[type=checkbox]")) {
            console.log(checkbox);
            if (!checkbox.checked) {
                checkbox.value = 0;
            } else {
                for (let hiddenNode of tuple.querySelectorAll("input[type=hidden]")) {
                if (hiddenNode.name == checkbox.name) {
                    console.log(hiddenNode);
                    hiddenNode.disabled = true;
                }
                }
            }
        }
      }
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
        tupla_num++;
        tuple.innerHTML = tupleFormat;

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

window.addEventListener("DOMContentLoaded", async function (e) {
    checklistDataJson = await fetchCookies;
    loadChecklistData(checklistDataJson);
});

form.addEventListener("submit", saveFormOnWeb);

saveButtonWeb.addEventListener("click", (e) => {
    form.setAttribute("action", "/save-checklist-web")
});

saveButtonDevice.addEventListener("click", (e) => {
    form.setAttribute("action", "/save-checklist-device")
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
    tupla_num++;
    tuple.innerHTML = tupleFormat;
    checklistTableContent.append(tuple);
});

fileInput.addEventListener("change", async () => {
    for (const file of fileInput.files) {
        const checklistDataURL = URL.createObjectURL(file);
        const checklistDataJson = await fetchSaveFile(checklistDataURL);
        loadChecklistData(checklistDataJson);
    }  
});

const tupleFormat = `
<th class="td-data text-center">
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
</td>`;
