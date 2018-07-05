let randomPetButton = document.querySelector('.pet-button');
let petDiv = document.querySelector('.pet-div');

randomPetButton.addEventListener('click', function(e) {
	getPet()
		.then(pet => { createPetHTML(pet) })

});

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

function getPetDetails(randomPetId) { //gets the pet details and format for template to take in
	return $.getJSON(`http://api.petfinder.com/pet.get?format=json&key=30813f445b233300ac28d89179cd71c7&id=${randomPetId}&callback=?`)	
		.then(response => {
			let pet = response.petfinder.pet;
			console.log(pet)
			if (!pet) {
				return 
			}
			return {
				age: pet.age['$t'],
				name: pet.name['$t'],
				breed: pet.breeds.breed['$t'],
				description: pet.description['$t'],
				picture: pet.media.photos.photo[1]['$t'],
				sex: pet.sex['$t']

			}
		}) 
}

function createTemplate(pet) {
	let template = `
	<div class="pet-card">
		<h1>${pet.name}</h1>
		<ul>
			<li>${pet.breed}</li>
			<li>${pet.age}</li>
			<li>${pet.sex}</li>
			<p>${pet.description}</p>
		</ul>
		<div><img src="${pet.picture}"></div>
	</div>`

		return template
}

function createPetHTML(pet) {
	petDiv.insertAdjacentHTML('beforeend', createTemplate(pet))
}