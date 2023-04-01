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
    fetch("http://localhost:4500/url/data", {
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
