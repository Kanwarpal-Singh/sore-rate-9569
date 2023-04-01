let url_input = document.querySelector(".main-url");
let title_input = document.querySelector(".title")
let url_form = document.querySelector(".urlform")
let url_btn=document.querySelector(".urlbtn")

url_form.addEventListener("submit", (e) => {
    e.preventDefault()
    let payload = {
        url: url_input.value,
        title: title_input.value

    }
    fetch("http://localhost:9090/url/data", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(payload)
    }).then(res => res.json())
        .then((res) => {
            if(res){
                setTimeout(() => {
                    window.open("link.html");
                  }, 1000)

                  url_input.innerText="";
                  title_input.innerText=""
            }
        })
        .catch(err => console.log(err))

})


//...........manthann code................
let url = document.querySelector(".qr-input");
let title = document.querySelector(".qr-title")
let form = document.querySelector(".qr-form")
let btn = document.querySelector("qrbtn")

let arr=[]
form.addEventListener("submit",(e)=>{
    e.preventDefault()
    let obj={
        URL:url.value,
        title:title.value
    }
    async function getQrcode(){
        let getqr = await fetch("http://localhost:9090/qr/scan",{
            method:"POST",
            body:JSON.stringify(obj),
            headers:{
                "Content-type":"application/json",
            }
        })
        if(getqr.ok==true){
            let code = await getqr.json()
            arr.push(code)
            renderCode(arr)
        }
      }
      getQrcode()
})

function renderCode(arr){
    let con = document.querySelector(".qr")
    con.innerHTML=""
     
     let newarr = arr.map((item)=>{
        return `
        <div class="qr-code-view">
            <h2> ${item.title} </h2>
            <div class="img">
            <img src="${item.src}"> 
             </div>
            </div>
        `
     })
     con.innerHTML = newarr.join(" ")  
     arr.pop(arr[0])
    }