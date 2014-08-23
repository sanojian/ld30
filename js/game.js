/**
 * Created by jonas on 8/23/2014.
 */


var g_game = {
	planets: {},
	routes: {},
	teams: {},
	fleets: [],
	frame: 1
}

var GameState = function(game) {
};

// Load images and sounds
GameState.prototype.preload = function() {
	this.game.load.atlasJSONHash('allsprites', './images/spritesheet.png', null, g_spriteAtlas);
	this.game.load.bitmapFont('pressStart2p', 'images/pressStart2p_0.png', 'images/pressStart2p.xml');

};

// Setup the example
GameState.prototype.create = function() {

	var graphicOverlay = new Phaser.Graphics(this.game, 0 , 0);
	for (var y=0;y<g_defs.screen.height;y+=4) {
		for (var x=0;x<g_defs.screen.width;x+=4) {
			graphicOverlay.beginFill(0xffffff, 0.1);
			graphicOverlay.drawRect(x, y, 3, 1);
			graphicOverlay.drawRect(x, y+1, 1, 2);
			graphicOverlay.endFill();
			graphicOverlay.beginFill(0x000000, 0.1);
			graphicOverlay.drawRect(x+1, y+3, 3, 1);
			graphicOverlay.drawRect(x+3, y+1, 1, 2);
			graphicOverlay.endFill();
		}
	}

	this.overlay = this.game.add.image(0, 0, graphicOverlay.generateTexture());
	//var style = { font: "12px 'Press Start 2P'", fill: "#ffffff", align: "center", stroke: "#ffffff", strokeThickness: 1};
	this.game.gameText = this.game.add.bitmapText(g_defs.screen.width/2, g_defs.screen.height-128, 'pressStart2p', 'Hello there', 32);
	this.game.gameText.tint = 0x005784;

	window.bmd = this.game.add.bitmapData(g_defs.screen.width, g_defs.screen.height);
	window.screenBmd = this.game.add.sprite(0, 0, window.bmd);

	this.game.stage.smoothed = false;
	loadLevel();

};

GameState.prototype.update = function() {

	window.bmd.clear();
	this.overlay.bringToTop();

	window.bmd.ctx.strokeStyle = "#ffffff";
	// draw routes
	for (var key in g_game.routes) {
		window.bmd.ctx.beginPath();
		window.bmd.ctx.moveTo(g_game.routes[key].pt1.x, g_game.routes[key].pt1.y);
		window.bmd.ctx.lineTo(g_game.routes[key].pt2.x, g_game.routes[key].pt2.y);
		window.bmd.ctx.lineWidth = 2;
		window.bmd.ctx.stroke();
		window.bmd.ctx.closePath();

	}
	// draw current path
	if (g_game.teams.team1.routePoints.length) {
		window.bmd.ctx.strokeStyle = "#00ff00";
		window.bmd.ctx.lineWidth = 3;
		window.bmd.ctx.beginPath();
		window.bmd.ctx.moveTo(g_game.planets[g_game.teams.team1.routePoints[0]].x, g_game.planets[g_game.teams.team1.routePoints[0]].y);

		for (var i=1;i<g_game.teams.team1.routePoints.length;i++) {
			window.bmd.ctx.lineTo(g_game.planets[g_game.teams.team1.routePoints[i]].x, g_game.planets[g_game.teams.team1.routePoints[i]].y);
		}
		window.bmd.ctx.stroke();
		window.bmd.ctx.closePath();
	}

	for (var i=0;i<g_game.fleets.length;i++) {
		g_game.fleets[i].tick(g_game.frame);
	}

		// draw planet strength
	for (var key in g_game.planets) {

		g_game.planets[key].tick(g_game.frame);

		window.bmd.ctx.strokeStyle = g_defs.teams[g_game.planets[key].team].color;

		window.bmd.ctx.lineWidth = g_game.planets[key].population;
		window.bmd.ctx.beginPath();
		window.bmd.ctx.arc(g_game.planets[key].orbit.x, g_game.planets[key].orbit.y, g_game.planets[key].orbit.diameter/2, 0, 2 * Math.PI, false);
		window.bmd.ctx.stroke();
		window.bmd.ctx.closePath();
	}

	for (var team in g_game.teams) {
		if (team != 'team1') {
			var player = g_game.teams[team].player;
			if (g_game.frame % player.decisionTicks == 0) {
				player.move();
			}
		}
	}


	window.bmd.render();
	window.bmd.refreshBuffer();

	g_game.frame++;
};

window.onload = function () {
	// Setup game
	window.g_phaserGame = new Phaser.Game(g_defs.screen.width, g_defs.screen.height, Phaser.AUTO, 'game');
	g_phaserGame.state.add('game', GameState, true);
};

var initTeam = function(team) {
	g_game.teams[team] = { routePoints: [] };
	if (team != 'team1' && team != 'team0') {
		g_game.teams[team].player = new PlayerAI(team);
	}
};

function changeText(text) {
	g_phaserGame.gameText.text = text;
	g_phaserGame.gameText.x = (g_phaserGame.width / 2 - g_phaserGame.gameText.textWidth / 2);
	g_phaserGame.gameText.x = g_phaserGame.gameText.x - g_phaserGame.gameText.x % g_defs.scale;

}

function loadLevel() {

	//clearLevel();

	if (!localStorage.ld30_level) {
		localStorage.ld30_level = 1;
	}
	g_game.level = g_levels[localStorage.ld30_level];

	changeText(g_game.level.text);

	while (!g_game.level) {
		localStorage.ld30_level = Math.max(1, parseInt(localStorage.ld30_level, 10) - 1);
		console.log('down to ' + localStorage.ld30_level);
		g_game.level = g_levels[localStorage.ld30_level];
	}

	for (var name in g_game.level.planets) {
		g_game.planets[name] = new Planet(name, g_game.level.planets[name].x, g_game.level.planets[name].y,
			g_game.level.planets[name].team);
	}
	for (var i=0;i<g_game.level.routes.length;i++) {
		var route = g_game.level.routes[i].split('_');
		g_game.routes[g_game.level.routes[i]] = new Route(route[0], route[1]);
	}
	for (var i=0;i<g_game.level.players.length;i++) {
		initTeam(g_game.level.players[i].team);
	}

};