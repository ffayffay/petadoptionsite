let randomPetButton = document.querySelector('.pet-button');
let petDiv = document.querySelector('.pet-div');
let petCard = document.querySelector('pet-card');

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
				picture: pet.media.photos.photo[2]['$t'],
				sex: pet.sex['$t']

			}
		}) 
}

function createTemplate(pet) {
	let template = `
	<div class="pet-card">
		<div class="card-img"><img src="${pet.picture}"></div>
		<div class="card-info"></div>
		<h1><small>Hi, I'm </small>${pet.name}</h1>
		<ul>
			<li>I am a ${pet.breed}</li>
			<li>My age is ${pet.age}</li>
			<li>Sex: ${pet.sex}</li>
		</ul>
		<div class="description-wrap"><p>${pet.description}</p></div>
	</div>`

		return template
}

function createPetHTML(pet) {
	petDiv.insertAdjacentHTML('beforeend', createTemplate(pet))
}
 
//NEED TO WRITE FUNCTION THAT DISPLAYS NOTHING IF THERE IS NO DISCRIPTION/NAME/AGE/SEX/PICTURE

