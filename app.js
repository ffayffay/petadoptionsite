let randomPetButton = document.querySelector('.pet-button');
let petDiv = document.querySelector('.pet-div');
let petCard = document.querySelector('pet-card');
let loading = document.querySelector('.loading');

randomPetButton.addEventListener('click', petButtonClickHandler);

function petButtonClickHandler(e) {
	e.preventDefault()
	toggleLoading()
	makeSearchRequest()
		.then(pet => insertPetHTML(pet))
}

function getPet() {
	return getRandomPetId()
		.then(randomPetId => {
			return getPetDetails(randomPetId)
		})
}

function getRandomPetId() { 
	return $.getJSON('http://api.petfinder.com/pet.getRandom?format=json&key=30813f445b233300ac28d89179cd71c7&callback=?')
		.then(response => {
			return response.petfinder.petIds.id['$t']
		}) 
};

function getPetDetails(randomPetId) { 
	return $.getJSON(`http://api.petfinder.com/pet.get?format=json&key=30813f445b233300ac28d89179cd71c7&id=${randomPetId}&callback=?`, {
		complete: toggleLoading
	})	
		.then(response => {
			return formatPetResponse(response)
		}) 
}

function formatPetResponse(response) {
	let pet = response.petfinder.pet;
			console.log(pet)
			if (!pet) {
				return getPet
			}
			return {
				age: pet.age['$t'] || "Not known.",
				name: pet.name['$t'] || "very lovable!",
				breed: pet.breeds.breed['$t'] || pet.animal['$t'],
				description: pet.description['$t'] || "",
				picture: pet.media.photos.photo[2]['$t'] || "Photo Coming Soon",
				sex: pet.sex['$t'] || "N/A",
				city: pet.contact.city['$t'] || "N/A",
				state: pet.contact.state['$t'] || "N/A",
				zip: pet.contact.zip['$t'] || "",
				phone: pet.contact.phone['$t'] || "N/A",
				email: pet.contact.email['$t'] || "N/A",

			}
}

function createTemplate(pet) {
	let template = `
<div class="pet-card">
	<div class="card-img"><img src="${pet.picture}"></div>
	<div class="card-info">
		<h1><small>Hi, I'm </small>${pet.name}</h1>
		<ul>
			<li>I am a ${pet.breed}</li>
			<li>My age is ${pet.age}</li>
			<li>Sex: ${pet.sex}</li>
			<li>I am located in ${pet.city}, ${pet.state} ${pet.zip}</li>
		</ul>
		<div class="contact-wrap"><p>To adopt me please call: ${pet.phone} or email: ${pet.email}
	<div class="description-wrap"><p>${pet.description}</p></div>
	</div>
</div>`

		return template
}

function insertPetHTML(pet) {
	petDiv.innerHTML = createTemplate(pet)
}

function makeSearchRequest(pet) {
	const form = document.getElementById('search-form');
	const animal = form.animal.value;
	const zipCode = form.zipcode.value;
	const url = `http://api.petfinder.com/pet.getRandom?format=json&key=30813f445b233300ac28d89179cd71c7&animal=${animal}&location=${zipCode}&callback=?`;

	return $.getJSON(url)
		.then(response => response.petfinder.petIds.id['$t'])
		.then(id => getPetDetails(id))
}


function toggleLoading() {
	loading.classList.toggle('hidden');
}