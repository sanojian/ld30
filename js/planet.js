var Planet = function(name, myX, myY, myTeam) {
	var self = this;
	this.x = myX * g_defs.scale;
	this.y = myY * g_defs.scale;
	this.name = name;
	this.team = myTeam;
	self.bShield = false;
	this.population = 1;



	var imgPlanet = g_phaserGame.add.sprite(this.x, this.y, 'allsprites', 'planet_' + myTeam);
	imgPlanet.anchor.set(0.5);
	imgPlanet.scale.setTo(g_defs.scale, g_defs.scale);
	imgPlanet.inputEnabled = true;

	var imgShield = g_phaserGame.add.sprite(this.x, this.y, 'allsprites', 'shield');
	imgShield.visible = false;
	imgShield.anchor.set(0.5);
	imgShield.scale.setTo(3, 3);

	this.r = 9*imgPlanet.width/16;
	this.orbit = new Phaser.Circle(this.x, this.y, this.r*2);
	this.orbitLength = this.orbit.circumference();

	imgPlanet.events.onInputDown.add(function() {
		if (myTeam != 'team1') {
			return;
		}
		self.bIsAClick = true;
		g_game.bRouting = true;
		g_game.teams.team1.routePoints = [name];

	}, this);
	imgPlanet.events.onInputOut.add(function() {
		self.bIsAClick = false;
	});
	imgPlanet.events.onInputOver.add(function() {
		if (g_game.bRouting) {
			var p1 = g_game.teams.team1.routePoints[g_game.teams.team1.routePoints.length - 1];
			var p2 = self.name;
			if (p1 > p2) {
				var temp = p1;
				p1 = p2;
				p2 = temp;
			}
			var route = g_game.routes[p1 + '_' + p2];
			if (!route) {
				// no route
				return;
			}
			else {
				//  planet
				g_game.teams.team1.routePoints.push(name);
				g_game.fleets.push(new Fleet('team1', g_game.teams.team1.routePoints[g_game.teams.team1.routePoints.length-2], name));
				//g_game.bRouting = false;
				g_game.teams.team1.routePoints = [name];
			}
			/*else {
				// player planet
				g_game.teams.team1.routePoints.push(name);
			}*/
		}
	}, this);
	imgPlanet.events.onInputUp.add(function() {

		// toggle shield?
		if (self.bIsAClick) {
			self.toggleShield();
		}

		g_game.bRouting = false;
		g_game.teams.team1.routePoints = [];
	}, this);

	self.toggleShield = function() {
		self.bShield = !self.bShield;
		imgShield.visible = self.bShield;

	};

	self.setTeam = function(newTeam) {
		myTeam = self.team = newTeam;
		if (self.bShield) {
			self.toggleShield();
		}
		imgPlanet.loadTexture('allsprites', 'planet_' + myTeam);
	};

	self.attackedBy = function(attackingTeam, strength) {

		if (attackingTeam == self.team) {
			self.population = Math.min(10, self.population + strength);
		}
		else {
			self.population -= strength / (self.bShield ? 3 : 1);
			if (self.population < 0) {
				self.setTeam(attackingTeam);
				self.population = Math.min(10, 0 - self.population);
			}
		}
	};

	self.tick = function(frame) {
		var freq = self.team == 'team0' ? 240 : 120;
		if (frame % freq == 0 && !self.bShield) {
			var max = self.team == 'team0' ? 6 : 10;
			self.population = Math.min(max, self.population + 1);
		}
	};

	return this;
};