
//variáveis para controle de criação de colunas e linhas
var colCount = 0;
var rowNumber = 0;
var rowCount = 0;
var spellQuantity = [0, 0, 0, 0, 0, 0, 0, 0];
var graphicReady = false;
var searchBtn = document.getElementById("submit");

//função que recebe as informações referentes as spells na api
function getSpells(callBackFunction, params) {
    var xhttp;
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            // Chama a função em callback e passa a resposta da requisição
            callBackFunction(this.responseText);
        }
    };

    var url = "https://www.dnd5eapi.co/api/spells/";

    if (params != null) {
        url = url + params;
    }
    // Requisição do tipo POST
    xhttp.open("GET", url, true);
    // Definindo o tipo de cabeçalho da requisição.
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
}//Creditos ao professor Nelson que desenvolveu a versão base da função.

//recebe o resultado da busca à api, faz uma nova requisição mais filtrada e cria os cards com as informações das magias
function showInfo(resultado) {
    var spells = JSON.parse(resultado);
    for (i = 0; i < spells.count; i++) {
        getSpells(createSpellCard, spells.results[i].index);//função para criar cards

    }
    var searchBtn = document.getElementById("submit");
    searchBtn.innerHTML = "Search"; 
}

//faz a busca inicial à api baseado na opção selecionada pelo usuário/ou a opção geral.
function getResultado() {
    var filtro = document.querySelector('input[type="radio"]:checked');
    var tela = document.getElementById("tela-info");
    tela.textContent = "";

    rowCount = 0;
    colCount = 0;
    rowNumber = 0;

    if (filtro != null) {
        var searchBtn = document.getElementById("submit");
        searchBtn.innerHTML = "Searching...";
        var parametroConsulta = "?school=" + filtro.id;
        getSpells(showInfo, parametroConsulta);
    }


}


//cria os cards dinamicamente com as informações das magias retiradas da api
function createSpellCard(resultado) {
    var spell = JSON.parse(resultado);
    var tela = document.getElementById("tela-info");
    var col = document.createElement("div");
    var card = document.createElement("div");
    var cardBody = document.createElement("div");
    var spellName = document.createElement("h3");
    var spellLevel = document.createElement("h6");
    var spellDescription = document.createElement("p");
    var spellGeneral = document.createElement("p");
    var row;

    col.className = "col-12 col-sm-12 col-md-4 col-lg-4";
    card.className = "card spellcard";
    cardBody.className = "card-body";
    spellName.className = "card-header";
    spellLevel.className = "card-header";
    spellGeneral.className = "card-text";
    spellDescription.className = "card-text";

    spellName.innerHTML = spell.name;
    spellLevel.innerHTML = "Level : " + spell.level + " " + spell.school.name;
    spellDescription.innerHTML = spell.desc[0];
    spellGeneral.innerHTML = "Range :  " + spell.range + "     " + "Duration : " + spell.duration + "    " + "Casting :  " + spell.casting_time;


    card.appendChild(spellName);
    card.appendChild(cardBody);
    cardBody.appendChild(spellLevel);
    cardBody.appendChild(spellGeneral);
    cardBody.appendChild(spellDescription);
    col.appendChild(card);


    if (colCount > 2 || rowCount == 0) {
        row = document.createElement("div");
        row.className = "row";
        if (rowCount == 0) {
            row.id = "row" + rowNumber;
        } else {
            row.id = "row" + rowCount;
            rowNumber += 1;
        }
        rowCount += 1;
        colCount = 0;
    } else {
        var selectedRow = "row" + rowNumber;
        row = document.getElementById(selectedRow);
    }
    row.appendChild(col);
    tela.appendChild(row);

    colCount += 1;

}


//variaveis para armazenar as informações dos cookies

const storageType = localStorage;
const cookiesVersion = 1.1;
//função para mudança dos estados quando o usuário aceitar os cookies

function cookiesAccepted() {
    storageType.setItem("privacyPolicyStatus", "consent");
    storageType.setItem("privacyPolicyAcceptanceDate", new Date());
    storageType.setItem("privacyPolicyAcceptanceVersion", cookiesVersion);

    var cookiesWindow = document.getElementById("cookies");
    document.body.removeChild(cookiesWindow);
}

//função para checar se os termos já foram aceitos ou não.

function checkPrivacyPolicyConsent() {
    if (storageType.getItem("privacyPolicyStatus") != "consent" || storageType.getItem("privacyPolicyAcceptanceVersion") != cookiesVersion || storageType.getItem("privacyPolicyAcceptanceDate") == null) {
        var cookiesDiv = document.createElement("div");
        var cookiesWindow = document.createElement("p");
        var buttonAccept = document.createElement("a");
        var buttonRefuse = document.createElement("a");
        cookiesWindow.innerHTML = "By using this site you accept our <a href='#'> Terms and Conditions </a><br>";

        buttonAccept.id = "accept";
        buttonAccept.className = ' btn btn-secondary';
        buttonAccept.href = "#";
        buttonAccept.innerHTML = "Accept";
        buttonAccept.setAttribute("onclick", "cookiesAccepted()");

        buttonRefuse.id = "Refuse";
        buttonRefuse.className = ' btn btn-secondary';
        buttonRefuse.href = "#";
        buttonRefuse.innerHTML = "Refuse";

        cookiesWindow.id = "cookies-window";
        cookiesDiv.id = "cookies";
        cookiesWindow.appendChild(buttonAccept);
        cookiesWindow.appendChild(buttonRefuse);
        cookiesDiv.appendChild(cookiesWindow);
        document.body.appendChild(cookiesDiv);
    }
}

//função para iniciar os recursos de graficos
function loadGraphic() {
    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(function () {
        drawChart(1, 2);
    });
}

//função para desenhar o grafico
function drawChart() {
    // Create and populate the data table.
    var position = document.getElementById('graphic')
    if(graphicReady == false){
        var graphicButton = document.getElementById("graphicBtn");
        var spinner = document.createElement("div");
        spinner.className = "spinner-border spinner-border-sm text-light";
        graphicButton.classList.add("disabled");
        graphicButton.removeAttribute("onclick");
        graphicButton.innerHTML = "Generating Graphic "
        graphicButton.appendChild(spinner);
        graphicReady = true;
        getSpells(countSpells);
    }
    
    
    var schools = ['Abjuration', 'Conjuration', 'Transmutation', 'Divination', 'Illusion', 'Enchantment', 'Evocation', 'Necromancy'];


    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Schools');
    data.addColumn('number', 'Quantity of Spells');

    for (i = 0; i < schools.length; i++)
        data.addRow([schools[i], spellQuantity[i]]);



    // Optional; add a title and set the width and height of the chart
    var options = { 'title': 'Spells by school', 'width': 365, 'height': 300, 'pieSliceText': 'value' };

    // Display the chart inside the <div> element with id="graphic"
    var chart = new google.visualization.PieChart(position);
    chart.draw(data, options);
}

function countSpells(resultado) {
    var spells = JSON.parse(resultado);
    for (i = 0; i < spells.count; i++) {
        getSpells(countSpellsbySchool, spells.results[i].index);//função para contar spells por escola de magia
    }


}
function countSpellsbySchool(resultado) {
    var spells = JSON.parse(resultado);
    switch (spells.school.name) {
        case "Abjuration":
            spellQuantity[0] += 1;
            break;
        case "Conjuration":
            spellQuantity[1] += 1;
            break;
        case "Transmutation":
            spellQuantity[2] += 1;
            break;
        case "Divination":
            spellQuantity[3] += 1;
            break;
        case "Illusion":
            spellQuantity[4] += 1;
            break;
        case "Enchantment":
            spellQuantity[5] += 1;
            break;
        case "Evocation":
            spellQuantity[6] += 1;
            break;
        case "Necromancy":
            spellQuantity[7] += 1;
            break;
    }

    checkIfFinished();
}

function checkIfFinished() {
    var sum = 0;
    for (i = 0; i < 8; i++) {
        sum += spellQuantity[i];
    }

    if (sum == 319) {
        var graphicButton = document.getElementById("graphicBtn");
        graphicButton.classList.remove("disabled");
        graphicButton.setAttribute('data-target', "#graphicModal");
        graphicButton.setAttribute('onclick', 'loadGraphic()');
        graphicButton.innerHTML = "Show Graphic";
    }
}





