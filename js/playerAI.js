var PlayerAI = function(myTeam) {

	var self = this;
	self.team = myTeam;
	self.decisionTicks = 120 + Math.floor(Math.random() * 60);

	var count = 0;
	self.move = function() {
		g_game.teams[self.team].routePoints = [];

		for (var i in g_game.planets) {
			// look for my planets
			if (g_game.planets[i] && g_game.planets[i].team == self.team) {
				g_game.teams[self.team].routePoints = [i];

				var targets = [];
				var friendly = null;

				for (var j in g_game.routes) {
					if (g_game.routes[j].startPlanet == i || g_game.routes[j].endPlanet == i) {

						var planet = g_game.routes[j].startPlanet == i ? g_game.routes[j].endPlanet : g_game.routes[j].startPlanet;

						// is this planet available?
						if (g_game.planets[planet].team != myTeam) {
							targets.push(planet);
							break;
						}
						else if (g_game.planets[planet].population < g_game.planets[i].population) {
							friendly = planet;
						}
					}
				}

				// look for smallest target
				if (targets.length) {
					// attack!
					var target = targets[0];
					// look for weakest target
					for (var j=1;j<targets.length;j++) {
						if (g_game.planets[targets[j]].population < g_game.planets[target].population) {
							target = targets[j];
						}
					}
					// should we really attack?
					var popDiff = g_game.planets[target].population - g_game.planets[i].population;
					if (popDiff > 0) {
						if (Math.random() > popDiff/10) {
							// call off attack
							break;
						}
					}
					g_game.teams[self.team].routePoints.push(target);
					g_game.fleets.push(new Fleet(self.team, g_game.planets[i].name, target));
				}
				else if (friendly) {
					// send reinforcements
					g_game.teams[self.team].routePoints.push(friendly);
					g_game.fleets.push(new Fleet(self.team, g_game.planets[i].name, friendly));
				}
			}
		}

	};

	return self;
}
