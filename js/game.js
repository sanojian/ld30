/**
 * Created by jonas on 8/23/2014.
 */


var g_game = {
	planets: {},
	routes: {},
	teams: {},
	fleets: [],
	frame: 1,
	bLoading: true,
	sfx: {},
	music: null
}

var GameState = function(game) {
};

// Load images and sounds
GameState.prototype.preload = function() {
	this.game.load.atlasJSONHash('allsprites', './images/spritesheet.png', null, g_spriteAtlas);
	this.game.load.bitmapFont('pressStart2p', 'images/pressStart2p_0.png', 'images/pressStart2p.xml');
	this.game.load.audio('shieldon', ['./audio/sfx/shieldon.wav']);
	this.game.load.audio('shieldoff', ['./audio/sfx/shieldoff.wav']);
	this.game.load.audio('launch_team1', ['./audio/sfx/launch_team1.wav']);
	this.game.load.audio('launch_team2', ['./audio/sfx/launch_team2.wav']);
	this.game.load.audio('launch_team3', ['./audio/sfx/launch_team3.wav']);
	this.game.load.audio('losefight', ['./audio/sfx/losefight.wav']);

	this.game.load.audio('simplesong', ['./audio/music/simple.ogg']);
	this.game.load.audio('team2', ['./audio/music/team2.ogg']);
	this.game.load.audio('team3', ['./audio/music/team3.ogg']);

};

// Setup the example
GameState.prototype.create = function() {

	g_game.sfx.shieldon = this.game.add.audio('shieldon');
	g_game.sfx.shieldoff = this.game.add.audio('shieldoff');
	g_game.sfx.launch_team1 = this.game.add.audio('launch_team1');
	g_game.sfx.launch_team2 = this.game.add.audio('launch_team2');
	g_game.sfx.launch_team3 = this.game.add.audio('launch_team3');
	g_game.sfx.losefight = this.game.add.audio('losefight');

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

	this.overlay = this.game.add.image(-10, -10, graphicOverlay.generateTexture());
	//var style = { font: "12px 'Press Start 2P'", fill: "#ffffff", align: "center", stroke: "#ffffff", strokeThickness: 1};
	this.game.gameText = this.game.add.bitmapText(g_defs.screen.width/2, g_defs.screen.height-128, 'pressStart2p', 'Hello there', 32);
	this.game.gameText.tint = 0x31A2F2;

	this.game.victoryText = this.game.add.bitmapText(g_defs.screen.width-256, g_defs.screen.height-64, 'pressStart2p', 'NEXT->', 32);
	this.game.victoryText.tint = 0x005784;
	this.game.victoryText.visible = false;
	this.game.victoryText.inputEnabled = true;
	this.game.victoryText.events.onInputDown.add(function() {
		localStorage.ld30_level = parseInt(localStorage.ld30_level, 10) + 1;
		loadLevel();
	});
	this.game.restartText = this.game.add.bitmapText(64, g_defs.screen.height-64, 'pressStart2p', 'RESTART', 32);
	this.game.restartText.tint = 0x005784;
	this.game.restartText.visible = true;
	this.game.restartText.inputEnabled = true;
	this.game.restartText.events.onInputDown.add(function() {
		loadLevel();
	});

	window.bmd = this.game.add.bitmapData(g_defs.screen.width, g_defs.screen.height);
	window.screenBmd = this.game.add.sprite(0, 0, window.bmd);

	this.game.boss_team2 = this.game.add.sprite(g_defs.scale*2, g_defs.scale*2, 'allsprites', 'boss_team2');
	this.game.boss_team2.scale.setTo(g_defs.scale*2, g_defs.scale*2);
	this.game.boss_team3 = this.game.add.sprite(g_defs.screen.width-128 - g_defs.scale*2, g_defs.scale*2, 'allsprites', 'boss_team3');
	this.game.boss_team3.scale.setTo(g_defs.scale*2, g_defs.scale*2);


	this.game.stage.smoothed = false;
	loadLevel();

};

GameState.prototype.update = function() {

	if (g_game.bLoading) {
		return;
	}
	window.bmd.clear();
	this.overlay.bringToTop();

	var enemies = 0;
	var friends = 0;

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

	for (var i=g_game.fleets.length-1;i>=0;i--) {
		g_game.fleets[i].tick(g_game.frame);
		if (g_game.fleets[i] && g_game.fleets[i].team == 'team1') {
			friends++;
		}
		else {
			enemies++;
		}
	}

	// draw planet strength
	for (var key in g_game.planets) {

		g_game.planets[key].tick(g_game.frame);
		if (g_game.planets[key].team == 'team1') {
			friends++;
		}
		else {
			enemies++;
		}

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

	// check for victory or loss
	if (!friends) {
		changeText('You are defeated...');
	}
	else if (!enemies) {
		// victory
		changeText('Victory!!');
		this.game.victoryText.visible = true;
	}

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

function clearLevel() {
	for (var i=g_game.fleets.length-1;i>=0;i--) {
		g_game.fleets[i].destroy();
	}
	g_game.fleets = [];

	for (var key in g_game.planets) {
		g_game.planets[key].destroy();
	}
	g_game.planets = {};
	g_game.teams = {};
	g_game.frame = 1;
	g_phaserGame.victoryText.visible = false;
};

function loadLevel() {

	g_game.bLoading = true;
	clearLevel();
	if (!localStorage.ld30_level) {
		localStorage.ld30_level = 1;
	}
	g_game.level = g_levels[localStorage.ld30_level];

	while (!g_game.level) {
		localStorage.ld30_level = Math.max(1, parseInt(localStorage.ld30_level, 10) - 1);
		console.log('down to ' + localStorage.ld30_level);
		g_game.level = g_levels[localStorage.ld30_level];
	}

	changeText(g_game.level.text);

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

	g_phaserGame.boss_team2.visible = false;
	g_phaserGame.boss_team3.visible = false;
	for (var i=0;i<g_game.level.players.length;i++) {
		if (g_game.level.players[i].team != 'team1') {
			g_phaserGame['boss_' + g_game.level.players[i].team].visible = true;
		}
	}

	if (g_game.music) {
		g_game.music.stop();
	}
	g_game.music = g_phaserGame.add.audio(g_game.level.music);
	if (g_game.music) {
		g_game.music.loop = true;
		g_game.music.play();
	}

	g_game.bLoading = false;
};