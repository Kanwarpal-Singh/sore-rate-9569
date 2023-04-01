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
            <h1>${element.title}</h1>
            <h3><span>localhost:9090/url/${element.shortId}</span></h3>
            <p> <i class="fa-solid fa-arrow-turn-up fa-rotate-90"></i> ${element.redirectURL}</p>
            <p><i class="fa-regular fa-calendar"></i> ${targetDateString} by Kamlesh das</p>
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
            <h1>${element.title}</h1>
            <h3><span>localhost:9090/url/${element.shortId}</span></h3>
            <p> <i class="fa-solid fa-arrow-turn-up fa-rotate-90"></i> ${element.redirectURL}</p>
            <p><i class="fa-regular fa-calendar"></i> ${targetDateString} by Kamlesh das</p>
        </div>
      `;
    });
}

// function randomSearch(data) {
//     let main = document.getElementById("right");
//     main.innerHTML = null;

//     if (!Array.isArray(data)) {
//         console.error("Data is not an array");
//         return;
//     }

//     data.forEach((element) => {

//         main.innerHTML += `
//         <div class="card">
//           <div class="face front">
//             <div>
//               <img src="${element.image}" alt="">
//             </div><br>
//             <div>
//               <h4 style="color:rgb(210, 0, 0)">Sales Starts at INR <span>${element.price}</span></h4>
//             </div>
//           </div>
//           <div class="face back">
//             <div>
//               <img src="${element.image}" alt="">
//             </div>
//             <div>
//               <div>
//                 <h3>Price: <span class="price">${element.price}</span></h3>
//                 <h3>Flat 25% off</h3>
//               </div><br>
//               <h3>
//                 <i style="color:orangered;" class="fa-solid fa-star"></i>
//                 <i style="color:orangered;" class="fa-solid fa-star"></i>
//                 <i style="color:orangered;" class="fa-solid fa-star"></i>
//                 <i style="color:orangered;" class="fa-solid fa-star"></i>
//                 <i style="color:orangered;" class="fa-solid fa-star-half-stroke"></i>
//                 <span class="rating">${element.rating}</span>
//               </h3>
//               <p style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;">${element.description}</p><br>
//               <button class="card-backside-btn">Add to cart <i class="fa-solid fa-cart-plus"></i></button>
//             </div>
//           </div>
//         </div>
//       `;
//     });
// }
