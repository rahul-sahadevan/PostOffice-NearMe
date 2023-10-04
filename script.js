const getStartBtn = document.querySelector(".get-started");
const mainDiv = document.querySelector(".main-div");
const mainDivTwo = document.querySelector(".major-div-two");

const searchInput = document.getElementById("search-input");

const searchBtn = document.getElementById("search-btn");
const searchDiv = document.querySelector(".search-details-div");

// retriving the IP Address of the user 

$.getJSON("https://api.ipify.org?format=json", function(data) {
    console.log(data);
    getStartBtn.addEventListener("click",()=>{
        getUserLocation(data.ip);
    })
    
        $("#current-ip").html(`Your Current IP Address is ${data.ip}`);
    })

  
    // function to fetch the datas of user using IP Address
async function getUserLocation(IP){
    try{
        const response = await fetch(`https://ipapi.co/${IP}/json/`);
        const result = await response.json();
        console.log(result)
        getIPDetails(result,IP);
        getMoreInformation(result);
        renderPostoffice1(result.postal);
        searchBtn.addEventListener("click",()=>{
            searchDiv.style.display = "none";
            renderPostOffice(result.postal,searchInput.value)
            searchDiv.style.display = "flex";
        })
        let latitude = result.latitude;
        let longitude = result.longitude;
        getMap(latitude,longitude);
        mainDiv.style.display = "none";
        mainDivTwo.style.display = "block"; 
    }
    catch(e){
        console.log(e);
    }
}

// Map to show the user location using google map it is not showing the exact location of person only the location corresponding to the lat and lon from the IP
function getMap(latitude,longitude){
    var coord = new google.maps.LatLng(latitude,longitude);

    var mapOptions = {
        zoom:14,
        center:coord,
        mapTypeId:google.maps.MapTypeId.ROADMAP

    }

    var map = new google.maps.Map(document.getElementById('map'),mapOptions);
    var marker = new google.maps.Marker({map:map,position:coord})

}

// function for more details of the user 
function getIPDetails(result,IP){
    const ipAddress = document.querySelector(".ip-address");
    ipAddress.innerText = `IP Address : ${IP}`
    const otherDetails = document.querySelector(".other-details");
    otherDetails.innerHTML = `
        <div class="location-details">
            <p class="lat">Lat: ${result.latitude} </p>
            <p class="lat">Long: ${result.longitude}</p>
        </div>
        <div class="city-region">
            <p class="city">City: ${result.city}</p>
            <p class="reg">Region: ${result.region}</p>
        </div>
        <div class="org-host">
            <p class="org">Organization: ${result.org}</p>
            <p class="host">Host: ${result.asn}</p>
        </div>
    `
}

// function to get the more information timezone,date&time,postal etc
function getMoreInformation(result){
    
    const value = getPinCodes(result.postal)
    .then((data)=>{
        console.log(data)
       let val = getPostOfficeDetails( data)
       let message = val[0].Message;
       post = val[0].PostOffice;
        console.log(message)
        const moreInfo = document.querySelector(".more-information-div");
        moreInfo.innerHTML = `
            <h1 class="more">More information About You</h1>
            <br>
            <br>
            <p class="Time-Zone">Time Zone: ${result.timezone}</p>
            <p class="date">Date And Time: ${getCurrentTime(result.timezone)} </p>
            <p class="pin">Pincode: ${result.postal}</p>
            <p class="message">Message: ${message}  </p>
        ` 
       
    });
    

   
}

function getPostOfficeDetails(data){
    return  data;
}

// function to get the current date and time of the user with timezone
function getCurrentTime(timezone){
    let currrentTimeZone = new Date().toLocaleString("en-US", { timeZone: timezone });
    let currentDate = new Date(currrentTimeZone);
    let currentYear = currentDate.getFullYear();

    let month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
    let date = ("0" + currentDate.getDate()).slice(-2);

    let date_time = currentYear + "-" + month + "-" + date;
    let ts = 1581338765000;

    let currentTime = new Date(ts).toLocaleString("en-US", { timeZone: timezone });

   return date_time+" & "+ currentTime.split(",")[1];
 }

//  function to fetch the pincode post office details
 async function getPinCodes(pincode){
    try{
        const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`)
        const result = await response.json();
        return result;
    }
    catch(e){
        console.log(e)
    }
   
 }

//  function to render the all post office near the user location
 async function renderPostoffice1(pincode){
    try{
        const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const result = await response.json();
        console.log(result)
        const postOffice = result[0].PostOffice;
        postOffice.forEach(element =>{
            const searchValDiv= document.createElement("div");
            searchValDiv.classList.add("search-values");
            searchValDiv.innerHTML = `
                <p>Name: ${element.Name}</p>
                <p>Branch Type: ${element.BranchType}</p>
                <p>Delivery Status: ${element.DeliveryStatus}</p>
                <p>Distrit: ${element.District}</p>
                <p>Divivsion: ${element.Division}</p>
            `
            searchDiv.append(searchValDiv)

        })

    }
    catch(e){
        console.log(e);
    }


 }
// function to render the search results (there is no specific section for this after clicking the button search result appear at the last of the div)
 async function renderPostOffice(pincode,search){
    
    try{
        const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const result = await response.json();
        console.log(result)
        const postOffice = result[0].PostOffice;
        postOffice.forEach(element => {
            if(element.Name.toLowerCase().includes(search) || element.BranchType.toLowerCase().includes(search) ){
                console.log(search,element.Name.toLowerCase())  
                const searchValDiv = document.createElement("div");
                searchValDiv.classList.add("search-values");
                searchValDiv.innerHTML = `
                    <p>Name: ${element.Name}</p>
                    <p>Branch Type: ${element.BranchType}</p>
                    <p>Delivery Status: ${element.DeliveryStatus}</p>
                    <p>Distrit: ${element.District}</p>
                    <p>Divivsion: ${element.Division}</p>
                `
                searchDiv.append(searchValDiv);
            }
        });
        console.log(postOffice)


    }
    catch(e){
        console.log(e)
    }


 }


