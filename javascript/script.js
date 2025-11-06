let nameScore;
let score;
let save = null;
const counter = document.getElementById('counter');
const counterFile = document.getElementById('counterFile');
const counterName = document.getElementById("counterName");
const counterScore = document.getElementById("counterScore");
const counterIncrease = document.getElementById("counterIncrease");
const counterDecrease = document.getElementById("counterDecrease");

counter.hidden = true;
counterIncrease.disabled = true;
counterDecrease.disabled = true;

async function chooseFile() {
    [save] = await window.showOpenFilePicker({
        types: [{ description: "Texte", accept: { "text/plain": [".txt"] } }],
    });

    let file = await save.getFile();
    let text = await file.text();

    if (text.trim().length < 1) {
        await updateTxt("Compteur: 0");
        file = await save.getFile();
        text = await file.text();
    }

    let [nameValue, scoreValue] = text.trim().split(":");
    nameScore = nameValue || "Compteur";
    score = parseInt(scoreValue) || 0;

    counterName.value = nameScore;
    counterScore.innerText = score;

    counter.hidden = false;
    counterIncrease.disabled = false;
    counterDecrease.disabled = false;

    console.log("Contenu du fichier :", text);
}

async function updateTxt(content) {
    if (!save) {
        console.log("⚠️ Aucun fichier choisi encore !");
        return;
    }

    const writable = await save.createWritable();
    await writable.write(content);
    await writable.close();

    console.log("✅ Fichier mis à jour !");
}

async function updateName(value) {
    nameScore = value;
    await updateTxt(`${nameScore}: ${score}`);
}


async function updateScore(value) {
    score = (parseInt(score) || 0) + value;
    const currentName = nameScore || 'Compteur';
    counterScore.innerText = score;
    updateTxt(`${currentName}: ${score}`);
}

counterFile.addEventListener('click', chooseFile);
counterName.addEventListener('input', async () => { await updateName(counterName.value) });
counterIncrease.addEventListener('click', async () => { await updateScore(1) });
counterDecrease.addEventListener('click', async () => { await updateScore(-1) });