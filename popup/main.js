chrome.storage.local.get(["img", "word", "invert"])
.then((result) => {
    if(result.img != undefined){
        document.getElementById("actualImage").src = result.img
        document.getElementById("invert").removeAttribute("disabled")
    }else{
        document.getElementById("actualImage").src = "https://abs.twimg.com/favicons/twitter.3.ico"
    }
    if(result.word != undefined){
        document.getElementById('tweetWord').value = result.word
    }
    if(result.invert){
        document.getElementById("invert").checked = true
        document.getElementById('actualImage').style = "filter: invert(1)";
    }
})
document.getElementById('upload').addEventListener('click', initUpload)
document.getElementById('fileUpload').addEventListener('change', changeLogo)
document.getElementById('clear').addEventListener('click', clearLogo)
document.getElementById('saveWord').addEventListener('click', saveWord)
document.getElementById('invert').addEventListener('click', invertColors)


function initUpload(){
    document.getElementById('fileUpload').click()
}

function saveWord(){
    //FIXME: Hacer que funcione
    let word = document.getElementById('tweetWord').value
    if(word == '' || word == null)
        word = null
    chrome.storage.local.set({word: word})
    .then(() => {
        console.log("wordSaved")
    })
}

async function isGif(file) {
    if (file.name.toLowerCase().endsWith(".gif")) {
      return true;
    }
  
    const blob = file.slice(0, 4);
    const reader = new FileReader();

    return new Promise((resolve) => {
        reader.onloadend = function() {
            const arr = new Uint8Array(reader.result);
            if (arr.length >= 3 && arr[0] === 0x47 && arr[1] === 0x49 && arr[2] === 0x46) {
                resolve(true);
            } else {
                resolve(false);
            }
        };
        reader.readAsArrayBuffer(blob);
    });
}

function changeLogo(){
    let file = document.getElementById('fileUpload').files[0]
    if(!file){
        return;
    }
    isGif(file).then(function(retGif){
        if(retGif){
            chrome.storage.local.set({gif: true})
            .then(() => {
                console.log('is a gif')
            })
        }else{
            chrome.storage.local.set({gif: false})
            .then(() => {
                console.log('is not a gif')
            })
        }
    })
    let reader = new FileReader()
    reader.onload = function(ev){
        let base64 = ev.target.result
        chrome.storage.local.set({img: base64})
        .then(() => {
            document.getElementById("actualImage").src = base64
            document.getElementById("invert").removeAttribute("disabled")
        })
    }
    reader.readAsDataURL(file)
}

function clearLogo(){
    chrome.storage.local.set({img: null})
    .then(() => {
        document.getElementById("actualImage").src = "https://abs.twimg.com/favicons/twitter.3.ico"
        document.getElementById("actualImage").style = ""
        document.getElementById("invert").setAttribute("disabled", "")
        document.getElementById("invert").checked = false
        chrome.storage.local.set({invert: false});
    })
}

function invertColors(button){
    chrome.storage.local.set({invert: button.target.checked});
    document.getElementById('actualImage').style = "filter: invert("+ Number(button.target.checked) +")";
}