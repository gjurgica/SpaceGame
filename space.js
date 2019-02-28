let currentShip, hidenDiv;
let inputs = {
    spaceShips: document.getElementById("ships"),
    planets: document.getElementById("planets"),
}
inputs.planets.style.display = "none";
let price = {
    fuel: 50,
    repair: 60,
    crew: 80
}
class Ship {
    constructor(name, crew, fuel, hull, speed, img) {
        this.name = name;
        this.crew = crew;
        this.fuel = fuel;
        this.fuelMax = fuel;
        this.hull = hull;
        this.hullMax = hull;
        this.speed = speed;
        this.img = img;
        this.credits = 500;
        this.isWorking = false;
        this.isDamaged = false;
        this.dockedPlanet = null;
    }
    async start(planet) {
        if (!planet instanceof Planet) {
            hidenDiv.style.backgroundColor = "red";
            hidenDiv.innerHTML = `${planet} is not a planet!`
            return;
        }
        if (planet.shipsDocked.includes(this)) {
            hidenDiv.style.backgroundColor = "red";
            hidenDiv.innerHTML = `You are already on planet ${planet.name}.`
            return;
        }
        if (this.isDamaged === false && this.crew > 0 && this.fuel >= planet.distance * 20) {
            this.isWorking = true;
            if (this.dockedPlanet instanceof Planet) {
                this.dockedPlanet.shipsDocked.pop();
            }
            hidenDiv.innerHTML = `Everything set and ready to go...`
        } else {
            hidenDiv.style.backgroundColor = "red";
            hidenDiv.innerHTML = `The ship is not ready to go yet.`
            return;
        }
        let events = SpaceEvent.generateEvent(planet.distance * 1000 / this.speed, game.events);
        for (const event of events) {
            await event.startEvent(this);
        }
        let that = this;
        setTimeout(function () {
            hidenDiv.innerHTML = `
            Heading to ${planet.name}...
            `
            that.fuel = that.fuel - planet.distance * 20;
            that.dock(planet);
        }, planet.distance * 1000 / that.speed)
    }
    dock(planet) {
        let that = this;
        hidenDiv.innerHTML = `Docking on planet ${planet.name}...`
        setTimeout(function () {
            hidenDiv.innerHTML = `${that.name} docked on the ${planet.name} planet.`
            planet.shipsDocked.push(that);
            that.isWorking = false;
            that.dockedPlanet = planet;
        }, 2000)
    }
    shipStat() {
        hidenDiv.style.backgroundColor = "rgb(3, 12, 94)";
        hidenDiv.innerHTML = `
        <h2>-----SHIP STATUS-----</h2>
        <p>CREW: ${this.crew}</p>
        <p>FUEL: ${this.fuel}</p>
        <p>HULL: ${this.hull}</p>
        <p>CREDITS: ${this.credits}</p>
        `
    }
}
let ship1 = new Ship("StarFighter", 3, 380, 500, 0.5, "https://github.com/sedc-codecademy/sedc7-04-ajs/blob/master/g2/Workshop/Game/img/StarFighter.png?raw=true");
let ship2 = new Ship("Crushinator", 5, 540, 400, 0.2, "https://github.com/sedc-codecademy/sedc7-04-ajs/blob/master/g2/Workshop/Game/img/Crushinator.png?raw=true");
let ship3 = new Ship("Scouter", 1, 300, 300, 0.9, "https://github.com/sedc-codecademy/sedc7-04-ajs/blob/master/g2/Workshop/Game/img/Scouter.png?raw=true");

class Planet {
    constructor(name, size, population, distance, development, img) {
        this.name = name;
        this.size = size;
        this.population = population;
        this.distance = distance;
        this.development = development;
        this.img = img;
        this.shipsDocked = [];
    }
    getMarketPrice(price) {
        return this.development * price - (Math.floor(this.population / this.size));
    }
    repair(ship) {
        if (!ship instanceof Ship) {
            hidenDiv.style.backgroundColor = "red";
            hidenDiv.innerHTML = `${ship} is not a ship.`;
            return;
        }
        if (!this.shipsDocked.includes(ship)) {
            hidenDiv.style.backgroundColor = "red";
            hidenDiv.innerHTML = `You are not docked on this planet!`;
            return;
        }
        if (ship.hull === ship.hullMax) {
            hidenDiv.style.backgroundColor = "red";
            hidenDiv.innerHTML = `Your ship is in great shape already!`;
            return;
        }
        let priceRepair = this.getMarketPrice(price.repair)
        if (ship.credits < priceRepair) {
            hidenDiv.style.backgroundColor = "red";
            hidenDiv.innerHTML = `You need ${priceRepair - ship.credits} more credits.`;
            return;
        } else {
            ship.isDamaged = false;
            ship.hull = ship.hullMax;
            ship.credits = ship.credits - priceRepair;
            hidenDiv.style.backgroundColor = "rgb(3, 12, 94)";
            hidenDiv.innerHTML = `Hulls repaired!`;
        }

    }
    refuel(ship) {
        if (!ship instanceof Ship) {
            hidenDiv.style.backgroundColor = "red";
            hidenDiv.innerHTML = `${ship} is not a ship.`;
            return;
        }
        if (!this.shipsDocked.includes(ship)) {
            hidenDiv.style.backgroundColor = "red";
            hidenDiv.innerHTML = `You are not docked on this planet!`;
            return;
        }
        if (ship.fuel === ship.fuelMax) {
            hidenDiv.style.backgroundColor = "red";
            hidenDiv.innerHTML = `Your fueltank is already full!`;
            return;
        }
        if (this.ship)
            hidenDiv.innerHTML = `${price.fuel}`;
        let priceRefuel = this.getMarketPrice(price.fuel);
        if (ship.credits >= priceRefuel) {
            ship.fuel = ship.fuelMax;
            ship.credits = ship.credits - priceRefuel;
            hidenDiv.style.backgroundColor = "rgb(3, 12, 94)";
            hidenDiv.innerHTML = `Ship refuled!`;
        } else {
            hidenDiv.style.backgroundColor = "red";
            hidenDiv.innerHTML = `You need ${priceRefuel - ship.credits} more credits.`;
        }

    }
    hireCrewMember(ship) {
        if (!ship instanceof Ship) {
            hidenDiv.style.backgroundColor = "red";
            hidenDiv.innerHTML = `${ship} is not a ship.`;
            return;
        }
        if (!this.shipsDocked.includes(ship)) {
            hidenDiv.style.backgroundColor = "red";
            hidenDiv.innerHTML = `You are not docked on this planet!`;
            return;
        }
        let priceCrew = this.getMarketPrice(price.crew);
        if (ship.credits > priceCrew) {
            ship.crew++;
            ship.credits = ship.credits - priceCrew;
            hidenDiv.style.backgroundColor = "rgb(3, 12, 94)";
            hidenDiv.innerHTML = `A new crew member boarded the ship!`;
        }else{
            hidenDiv.style.backgroundColor = "red";
            hidenDiv.innerHTML = `You need ${priceCrew - ship.credits} more credits.`;
        }
    }
}

class SpaceEvent{
    constructor(name,description,crewModifier,fuelModifier,hullmodifier){
        this.name =  name;
        this.description = description;
        this.crew = crewModifier;
        this.fuel = fuelModifier;
        this.hull = hullmodifier;
    }
    startEvent(ship){
        if (!ship instanceof Ship) {
            hidenDiv.style.backgroundColor = "red";
            hidenDiv.innerHTML = `${ship} is not a ship.`;
            return;
        }
        let that = this;
        setTimeout(function(){
            ship.crew += that.crew;
            ship.fuel += that.fuel;
            ship.hull += that.hull;
            hidenDiv.innerHTML = `
            -----EVENT-----</br>
            ${that.name}</br>
            ${that.description}</br>
            ${that.modifiedStats()}
            `
        },4000);

    }
    modifiedStats(){
        let result = "";
        if(this.crew > 0){
            result += `${this.crew} boarded your ship and is part of your crew now.\n`;
        }else if(this.crew < 0){
            result += `You lost ${Math.abs(this.crew)} of your crew.\n`;
        }
        if(this.fuel> 0){
            result += `You got ${this.fuel} extra fuel!\n`;
        }else if(this.fuel < 0){
            result += `You lost ${Math.abs(this.fuel)} fuel!\n`;
        }
        if(this.hull > 0){
            result += `Your ship got ${this.hull} repair supplies!\n`;
        }else if(this.hull < 0){
            result += `Your ship took ${Math.abs(this.hull)} damage!\n`;
        }
        return result;
    }
    static generateEvent(time,array){
        let result = [];
        let randomNumber = Math.round(Math.random() * 13);
        let eventNumber = 1;
        if(time > 26000){
            eventNumber = 4;
        }else if(time > 18000){
            eventNumber = 3;
        }else if(time > 8000){
            eventNumber = 2;
        }
        for(let i=0;i<eventNumber;i++){
            result.push(array[randomNumber]);
        }
        return result;
    }
}
let game = {
    events: [
        new SpaceEvent("Fuel Leak", "Due to low maintenance of the ship, the fuel tank leaked. The leak was patched, but we lost some fuel.", 0, -50, 0 ),
        new SpaceEvent("Pirates!", "Space pirates attacked the ship! We escaped, but our hull took some damage!", 0, -20, -150 ),
        new SpaceEvent("Unknown substance", "An unknown substance was found on the cargo ship. A crew member touched it and died on the spot.", -1, 0, 0 ),
        new SpaceEvent("Asteroid field", "We entered an asteroid field. It was hard, but our captain managed to go out of it.", 0, -30, -100 ),
        new SpaceEvent("Fire on deck", "The main system overheated and fire broke from one of the panels. The crew quickly extinguished it.", 0, 0, -70 ),
        new SpaceEvent("Bad stop", "You stop at a nearby station for a pit-stop. They give you repair supplies.", 0, -50, +50 ),
        new SpaceEvent("Captains Birthday", "It's the captain's birthday. Everybody got drunk. Nobody remembers what happened the last 12 hours.", -1, -60, -100 ),
        new SpaceEvent("Space Shark", "Your ship is attacked by a space shark. After killing it, you watch a tutorial on how to turn shark blood in to fuel.", 0, +80, -120 ),
        new SpaceEvent("Alien in need", "An alien is stranded on it's broken ship. It took some time and effort but you save him and board him on your ship.", 1, -50, -50 ),
        new SpaceEvent("Hail the federation", "A federation cruiser hails you. They help you with supplies and fuel.", 0, +100, +100 ),
        new SpaceEvent("Destroyed Transport Ship", "You encounter a destroyed transport ship. It's dangerous, but you try salvaging its fuel tank.", 0, +150, -80 ),
        new SpaceEvent("Angry Spider", "An angry spider appears on the deck. The captain stomps on it. Everything is fine", 0, 0, 0 )
    ]
}

let clientsView = {
    makeShip: function (ship) {
        inputs.spaceShips.innerHTML += `
        <div class="card ship" style="width:350px">
            <a href="#"><img src="${ship.img}" alt="${ship.name}"/></a>
                <div class="card-body">
                    <h2 class="card-title">Name: ${ship.name}</h2>
                    <p class="card-text">Crew: ${ship.crew}</p>
                    <p class="card-text">Fuel: ${ship.fuel}</p>
                    <p class="card-text" >Hull: ${ship.hull}</p>
                    <p class="card-text">Speed: ${ship.speed}</p>
                    </div>
                </div>
        `
    },
    makePlanets: function (planet) {
        let image = document.createElement("a");
        image.innerHTML = `<img src="${planet.img}" alt="${planet.name}"/>`;
        let firstDiv = document.createElement("div");
        firstDiv.setAttribute("class", "card-body first");
        let firstHeader = document.createElement("h2");
        firstHeader.setAttribute("class", "card-title");
        firstHeader.innerHTML = `Name: ${planet.name}`;
        let size = document.createElement("p");
        size.setAttribute("class", "card-text");
        size.innerHTML = `Size: ${planet.size}`;
        let population = document.createElement("p");
        population.setAttribute("class", "card-text");
        population.innerHTML = `Population: ${planet.population}`;
        let distance = document.createElement("p");
        distance.setAttribute("class", "card-text");
        distance.innerHTML = `Distance: ${planet.distance}`;
        let development = document.createElement("p");
        development.setAttribute("class", "card-text");
        development.innerHTML = `Development: ${planet.development}`;
        let secondDiv = document.createElement("div");
        secondDiv.setAttribute("class", "card-body second");
        let repairShip = document.createElement("a");
        repairShip.setAttribute("class", "card-link");
        repairShip.innerHTML = `Repair`;
        let refuelShip = document.createElement("a");
        refuelShip.setAttribute("class", "card-link");
        refuelShip.innerHTML = `Refuel`;
        let hire = document.createElement("a");
        hire.setAttribute("class", "card-link");
        hire.innerHTML = `Hire`;
        let thirdDiv = document.createElement("div");
        thirdDiv.setAttribute("class", "card-body third");
        let startShip = document.createElement("a");
        startShip.setAttribute("class", "card-link");
        startShip.innerHTML = `Go to`;
        let shipStatus = document.createElement("a");
        shipStatus.setAttribute("class", "card-link");
        shipStatus.innerHTML = `Ship Status`;
        hidenDiv = document.createElement("div");
        hidenDiv.setAttribute("class", "card-body hiden");
        let mainDiv = document.getElementById("main");
        mainDiv.appendChild(image);
        mainDiv.appendChild(firstDiv);
        firstDiv.appendChild(firstHeader);
        firstDiv.appendChild(size);
        firstDiv.appendChild(population);
        firstDiv.appendChild(distance);
        firstDiv.appendChild(development);
        firstDiv.appendChild(secondDiv);
        secondDiv.appendChild(repairShip);
        secondDiv.appendChild(refuelShip);
        secondDiv.appendChild(hire);
        firstDiv.appendChild(thirdDiv);
        thirdDiv.appendChild(startShip);
        thirdDiv.appendChild(shipStatus);
        repairShip.addEventListener("click", function () {
            planet.repair(currentShip);
        });
        refuelShip.addEventListener("click", function () {
            planet.refuel(currentShip);
        });
        hire.addEventListener("click", function () {
            planet.hireCrewMember(currentShip);
        });
        startShip.addEventListener("click", function () {
            thirdDiv.appendChild(hidenDiv);
            currentShip.start(planet);
        });
        shipStatus.addEventListener("click", function (e) {
            thirdDiv.appendChild(hidenDiv);
            currentShip.shipStat();
        })
    }
}

let planet1 = new Planet("Rubicon9", 300000, 2000000, 4, 2, "https://github.com/sedc-codecademy/sedc7-04-ajs/blob/master/g2/Workshop/Game/img/Rubicon9.png?raw=true");
let planet2 = new Planet("R7", 120000, 4000000, 7, 3, "https://github.com/sedc-codecademy/sedc7-04-ajs/blob/master/g2/Workshop/Game/img/R7.png?raw=true");
let planet3 = new Planet("Magmus", 500000, 10000000, 6, 1, "https://github.com/sedc-codecademy/sedc7-04-ajs/blob/master/g2/Workshop/Game/img/Magmus.png?raw=true");
let planet4 = new Planet("Dextriaey", 50000, 500000, 9, 3, "https://github.com/sedc-codecademy/sedc7-04-ajs/blob/master/g2/Workshop/Game/img/Dextriaey.png?raw=true");
let planet5 = new Planet("B18-1", 250000, 4000000, 12, 2, "https://github.com/sedc-codecademy/sedc7-04-ajs/blob/master/g2/Workshop/Game/img/B18-1.png?raw=true");
clientsView.makeShip(ship1);
clientsView.makeShip(ship2);
clientsView.makeShip(ship3);
clientsView.makePlanets(planet1);
clientsView.makePlanets(planet2);
clientsView.makePlanets(planet3);
clientsView.makePlanets(planet4);
clientsView.makePlanets(planet5);

inputs.spaceShips.addEventListener("click", function (e) {
    e.preventDefault();
    if (e.target.alt === "StarFighter") {
        currentShip = ship1;
    } else if (e.target.alt === "Crushinator") {
        currentShip = ship2;
    } else if (e.target.alt === "Scouter") {
        currentShip = ship3;
    }
    inputs.spaceShips.style.display = "none";
    inputs.planets.style.display = "block";
});
