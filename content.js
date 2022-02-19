console.log("Script loaded")

if(document.URL.includes("welcome")){
    var ar = getSubjectsArray()
    chrome.storage.local.set({'courses': ar}, ()=>{
        console.log("Saved Courses successfully")
    })
}

if(document.URL.includes("mytimetable")){
    var [table, ar] = getTimetable()
    setNewTimetable(table,ar)
}

function getSubjectsArray(){
    var table = document.getElementById('ContentPlaceHolder1_GridView2')
    var dom = new DOMParser().parseFromString(table.innerHTML, "text/xml")
    var rows = dom.getElementsByTagName('tr')
    var ar = []
    for (element of rows) {
        var d = new DOMParser().parseFromString(element.innerHTML, "text/xml")
        var subCode = d.getElementsByTagName('h4')[0].textContent
        var subName = d.getElementsByTagName('h6')[0].textContent
        ar.push([subCode, subName])
    }
    return ar
}

function getTimetable(){
    var table = document.getElementById('ContentPlaceHolder1_grd1')
    var dom = new DOMParser().parseFromString(table.innerHTML, "text/xml")
    var td = dom.getElementsByTagName('td')
    var ar = []
    for(element of td){
        ar.push(element.textContent)
    }
    return [table, ar]
}

function setNewTimetable(table, ar){
    storedData((result)=>{
        for(element of result){
            ar.forEach(subcode => {
                if(subcode.includes(element[0])){
                    table.innerHTML = table.innerHTML.replace(subcode,element[1])
                }
            })
        }
        console.log("Accessed Courses successfully")
    })
}

function storedData(callback){
    chrome.storage.local.get(['courses'], (result) => {
        callback(result.courses)
      }
    )
}