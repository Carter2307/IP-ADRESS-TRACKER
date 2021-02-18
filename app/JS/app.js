//MANAGE DATA
//Call to action BTN
let btn = document.querySelector(".btn");
let inputIp = document.querySelector(".input__control");

//All HTML element who receive fetching Datas
let storeArr = document.querySelectorAll(".data__value__items");

//Fetch data on click || onload
window.onload = fetchData();
btn.addEventListener("click", fetchData);

function fetchData(e) {
	let urlValue, urls, options;

	//Get IP adress submit by user
	urlValue =
		"https://geo.ipify.org/api/v1?apiKey=at_Ega9n42PiIfgfOeXoWATKJjnPKas7&ipAddress=";
	urls = urlValue.concat(inputIp.value);

	//Request API options
	options = {
		method: "GET",
		url: urls,
	};
	getData(options.url, options.method);
}

//Submit data to the UI interface in à right place
/**
 * Manage data receive from API
 *
 * @param {objet} data - content all geolocation data
 */
function manageData(data) {
	let location = data.location;

	let ip = getClass("ip");
	let iPlocation = getClass("location");
	let timeZone = getClass("timezone");
	let isp = getClass("isp");

	//Send data body
	ip.innerHTML = data.ip;
	iPlocation.innerHTML = `${location.city}, ${location.country}, ${location.postalCode}`;
	timeZone.innerHTML = `UTC ${location.timezone}`;
	isp.innerHTML = `${data.isp}`;

	defineMap(location.lat, location.lng);
}

//Configure Map
/**
 * Configure and set the Map API
 *
 * @param {string} lat - latitude
 * @param {stirng} lng - longitude
 */
function defineMap(lat, lng) {
	//unset map value
	let container = L.DomUtil.get("map");
	if (container != null) {
		container._leaflet_id = null;
	}

	//Map Config
	let map = L.map("map", {
		center: [lat, lng],
		zoom: 13,
	});

	let myIcon = L.icon({
		iconUrl: "/images/icon-location.svg",
		iconSize: [46, 56],
		popupAnchor: [-3, -76],
	});

	let latlng = L.latLng(lat, lng);
	console.log(latlng);

	L.tileLayer(
		"https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY2FydGVyLWJ5IiwiYSI6ImNrbGFibGRxdDJhZXkybmxhdWM3ZnVrNTEifQ.QncUIlfp0w2AVc63mKgG5A",
		{
			attribution:
				'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
			maxZoom: 18,
			id: "mapbox/streets-v11",
			tileSize: 512,
			zoomOffset: -1,
			accessToken:
				"pk.eyJ1IjoiY2FydGVyLWJ5IiwiYSI6ImNrbGFibGRxdDJhZXkybmxhdWM3ZnVrNTEifQ.QncUIlfp0w2AVc63mKgG5A",
		}
	).addTo(map);

	L.marker(latlng, { icon: myIcon }).addTo(map);
}

/**
 * Bind the DIV HTMLELEMENT  to variable
 *
 * @param {string} elem - substring class element
 */
function getClass(elem) {
	for (let i = 0, l = storeArr.length; i < l; i++) {
		const element = storeArr[i];
		if (element.classList.contains(`data__${elem}`)) {
			return element;
		}
	}
}

/**
 * Get Data to geo.ipify API
 *
 * @param {url} string - geo.ipify URL whith apiKey
 * @param {method} string - method use to Resquest data (GET)
 */
async function getData(url = "", method = "") {
	try {
		let data = await fetch(url, { method: method })
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				manageData(data);
			});
	} catch (error) {
		console.error({ message: error });
	}
}
