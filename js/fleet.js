/**
 * Created by jonas on 8/23/2014.
 */

var Fleet = function(team, planet1, planet2) {

	var self = this;
	self.x = g_game.planets[planet1].x;
	self.y = g_game.planets[planet1].y;

	var dx = g_game.planets[planet2].x - g_game.planets[planet1].x;
	var dy = g_game.planets[planet2].y - g_game.planets[planet1].y;
	var angle = Math.atan2(dy, dx);
	var distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
	var travelled = 0;
	var speed = 1;

	var route = g_game.teams[team].routePoints;
	var strength = 0;
	for (var i=0;i<route.length-1;i++) {
		var power = Math.floor(g_game.planets[route[i]].population/2);
		strength += power;
		g_game.planets[route[i]].population -= power;
	}


	//var imgFleet = g_phaserGame.add.sprite(g_game.planets[planet1].x, g_game.planets[planet1].y, 'allsprites', 'fleet_' + team);
	var texName = 'texture_fleet_' + team + '_' + strength;
	if (!g_phaserGame[texName]) {
		var img = g_phaserGame.make.image(0, 0, 'allsprites', 'fleet_' + team);
		g_phaserGame[texName] = g_phaserGame.add.renderTexture(img.width + (img.width-2)*strength, img.height, texName, true);
		g_phaserGame[texName].renderXY(img, 0, 0, true);
		for (var i=1;i<strength;i++){
			g_phaserGame[texName].renderXY(img, (img.width-2)*i, 0, false);
		}

	}
	var imgFleet = g_phaserGame.add.sprite(g_game.planets[planet1].x, g_game.planets[planet1].y, g_phaserGame[texName]);

	imgFleet.anchor.set(0.5);
	//var size = Math.max(g_defs.scale, strength);
	imgFleet.scale.setTo(g_defs.scale, g_defs.scale);


	self.tick = function(frame) {
		imgFleet.x += speed * Math.cos(angle);
		imgFleet.y += speed * Math.sin(angle);
		//imgFleet.x = self.x - self.x % g_defs.scale;
		//imgFleet.y = self.y - self.y % g_defs.scale;

		travelled++;
		if (travelled >= distance) {
			self.destroy();
			g_game.planets[planet2].attackedBy(team, strength);
		}
	};

	self.destroy = function() {
		g_game.fleets.splice(g_game.fleets.indexOf(self), 1);
		imgFleet.destroy();
	};

	return this;

};
