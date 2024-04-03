let lastUrl = location.href
new MutationObserver(() => {
    let url = location.href
    if (url !== lastUrl){
        lastUrl = url
        onUrlChange()
    }
}).observe(document, {subtree: true, childList: true})

async function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

async function waitForElmAll(selector) {
    return new Promise(resolve => {
        const observer = new MutationObserver(() => {
            if (document.querySelector(selector)) {
                resolve(document.querySelectorAll(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function onUrlChange(){
    chrome.storage.local.get(["img", "gif"])
    .then((result) => {
        if(result.img != undefined){
            modifyIcons(result.img, result.gif)
        }
    })
    chrome.storage.local.get(["word"])
    .then((result) => {
        if(result.word != undefined){
            modifyTweetWord(result.word)
        }
    })
}

function modifyTweetWord(word){
    waitForElmAll('div[dir="ltr"]').then((elems)=>{
        elems.forEach(elem => {
            if(elem.querySelector('spam') == null)
                return;
            elem.querySelector('spam').innerHTML = elem.querySelector('spam').innerHTML.replace('Posts', word) 
        });
    })
}   

function modifyIcons(image, isGif){
    //change home button icon
    waitForElm('a[href="/home"]').then((elem) => {
        elem.querySelector('div').innerHTML = 
        "<img style='height: 100%' src='"+ image +"' class='r-4qtqp9 r-yyyyoo r-16y2uox r-8kz0gk r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-lrsllp'>"    
    })

    //change the favicon
    waitForElm("link[rel='shortcut icon']").then(() => {
        editHeader(image, isGif)
    })

    //loading screen icon
    waitForElm('div[aria-label="Loading…"]').then((elem) => {
        elem.parentElement.innerHTML = 
        "<img src='"+ image +"' class='r-1p0dtai r-16ek5rh r-4qtqp9 r-yyyyoo r-wy61xf r-1d2f490 r-ywje51 r-dnmrzs r-u8s1d r-zchlnj r-1plcrui r-ipm5af r-lrvibr r-1blnp2b'>"    
    })
    
    //"verified" logo change
    waitForElm('a[href="/i/verified-choose"]').then((elem) =>{
        elem.querySelector('svg').parentElement.innerHTML = 
        "<img src='"+ image +"' class='r-1nao33i r-4qtqp9 r-yyyyoo r-lwhw9o r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-cnnz9e'>"
    })
}

function editHeader(image, isGif){
    let newFaviconLink = document.createElement("link");
    newFaviconLink.rel = "icon";
    newFaviconLink.href = image; 
    
    let currentFaviconLink = document.querySelector("link[rel='shortcut icon']") || document.createElement("link");
    
    document.head.removeChild(currentFaviconLink);
    document.head.appendChild(newFaviconLink);
}

onUrlChange();