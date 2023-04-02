// display all data
const showdata = () => {
    fetch("http://localhost:9090/url/", {
        headers: {
            "Content-type": "application/json",
            Authorization: localStorage.getItem("token"),
        },
    })
        .then((res) => res.json())
        .then((res) => {
            displaydata(res);
            // console.log(res);
        })
        .catch((err) => console.log(err));
};

showdata();

function displaydata(data) {
    let main = document.querySelector(".url-view");
    main.innerHTML = null;
    data.forEach((element) => {
        //   console.log(element);
        let inputDate = new Date(element.createdAt)
        // define the target time zone identifier
        const targetTimeZone = 'Asia/Kolkata';

        // convert the input date to the target time zone
        const targetDate = new Date(inputDate.toLocaleString('en-US', {
            timeZone: targetTimeZone
        }));

        // format the target date string
        const targetDateString = targetDate.toLocaleString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            timeZoneName: 'short',
            timeZone: targetTimeZone
        });

        console.log(targetDateString);
        main.innerHTML += `
        <div class="url-child">
            <h1 class="title">${element.title}</h1>
            <h3><span>localhost:9090/url/${element.shortId}</span></h3>
            <p> <i class="fa-solid fa-arrow-turn-up fa-rotate-90"></i> ${element.redirectURL}</p>
            <p><i class="fa-regular fa-calendar"></i> ${targetDateString} by Kamlesh das</p>
            <i class="fa-solid fa-trash delete-btn"></i>
           
        </div>
      `;
    });
}

//..............search functionality.................
const debounce = (fn, delay) => {
    let timeoutId;
    return (...args) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            fn(...args);
        }, delay);
    };
};

const search = () => {
    let searchbox = document.querySelector(".searchText");
    let payload = {
        key: searchbox.value,
    };
    let url = new URL("http://localhost:9090/url/data/search");
    url.search = new URLSearchParams(payload).toString();
    fetch(url, {
        headers: {
            "Content-type": "application/json",
            // Authorization: localStorage.getItem("token"),
        },
    })
        .then((res) => res.json())
        .then((res) => {
            console.log(res);
            displaySearchData(res);
        })
        .catch((err) => console.log(err));
};


const debouncedSearch = debounce(search, 500); // 500ms delay

document.querySelector(".searchText").addEventListener("keyup", () => {
    debouncedSearch();
});

function displaySearchData(data) {
    let main = document.querySelector(".url-view");
    main.innerHTML = null;
    if (!Array.isArray(data)) {
        console.error("Data is not an array");
        return;
    }
    data.forEach((element) => {
        //   console.log(element);
        let inputDate = new Date(element.createdAt)
        // define the target time zone identifier
        const targetTimeZone = 'Asia/Kolkata';

        // convert the input date to the target time zone
        const targetDate = new Date(inputDate.toLocaleString('en-US', {
            timeZone: targetTimeZone
        }));

        // format the target date string
        const targetDateString = targetDate.toLocaleString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            timeZoneName: 'short',
            timeZone: targetTimeZone
        });

        console.log(targetDateString);
        main.innerHTML += `
        <div class="url-child">
            <h1 class="title">${element.title}</h1>
            <h3><span>localhost:9090/url/${element.shortId}</span></h3>
            <p> <i class="fa-solid fa-arrow-turn-up fa-rotate-90"></i> ${element.redirectURL}</p>
            <p><i class="fa-regular fa-calendar"></i> ${targetDateString} by Kamlesh das</p>
            <i class="fa-solid fa-trash delete-btn"></i>
        </div>
      `;

    });

}


//.................Delete document by clicking the button............
let main = document.querySelector(".url-view");
main.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete-btn")) {
   
    const cardElement = event.target.closest(".url-child");
    console.log(cardElement)
    const payload= {
      title: cardElement.querySelector(".url-child h1").textContent,
    };
    
    fetch("http://localhost:9090/url/delete",{
      method:"DELETE",
      headers:{
        "Content-type":"application/json",
        // Authorization:localStorage.getItem("token")
      },
      body:JSON.stringify(payload)
    })
    .then(res=>res.json())
    .then((res)=>{
      console.log(res)
       displayDelete(res)
    })
    .catch((err)=>console.log(err))
    
  }
});

function displayDelete(data) {
    let main = document.querySelector(".url-view");
    main.innerHTML = null;
    if (!Array.isArray(data)) {
        console.error("Data is not an array");
        return;
    }
    data.forEach((element) => {
        //   console.log(element);
        let inputDate = new Date(element.createdAt)
        // define the target time zone identifier
        const targetTimeZone = 'Asia/Kolkata';

        // convert the input date to the target time zone
        const targetDate = new Date(inputDate.toLocaleString('en-US', {
            timeZone: targetTimeZone
        }));

        // format the target date string
        const targetDateString = targetDate.toLocaleString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            timeZoneName: 'short',
            timeZone: targetTimeZone
        });

        // console.log(targetDateString);
        main.innerHTML += `
        <div class="url-child">
            <h1 class="title">${element.title}</h1>
            <h3><span>localhost:9090/url/${element.shortId}</span></h3>
            <p> <i class="fa-solid fa-arrow-turn-up fa-rotate-90"></i> ${element.redirectURL}</p>
            <p><i class="fa-regular fa-calendar"></i> ${targetDateString} by Kamlesh das</p>
            <i class="fa-solid fa-trash delete-btn"></i>
        </div>
      `;

    });

}