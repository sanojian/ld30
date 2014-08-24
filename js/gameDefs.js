/**
 * Created by jonas on 8/23/2014.
 */

var g_levels = {
	'1': {
		planets: {	'A': { name: 'A', x: 90, y: 50, team: 'team1' },
			'B': { name: 'B', x: 130, y: 80, team: 'team0' }

		},
		routes: [ 'A_B' ],
		players: [
			{ team: 'team1' }
		],
		text: 'Yeah level 1'
	},
	'2': {
		planets: {	'A': { name: 'A', x: 30, y: 30, team: 'team1' },
			'B': { name: 'B', x: 80, y: 100, team: 'team0' },
			'C': { name: 'C', x: 130, y: 30, team: 'team0' },
			'D': { name: 'D', x: 150, y: 70, team: 'team2' },
			'E': { name: 'E', x: 170, y: 50, team: 'team0' },
			'F': { name: 'F', x: 180, y: 70, team: 'team0' },
			'G': { name: 'G', x: 200, y: 130, team: 'team3' }

		},
		routes: [ 'A_B', 'B_C', 'C_D', 'C_E', 'E_F', 'F_G' ],
		players: [
			{ team: 'team1' },
			{ team: 'team2' },
			{ team: 'team3' }
		],
		text: 'Level 2 go!!'
	},
	'3': {
		planets: {	'A': { name: 'A', x: 200, y: 200, r: 26, team: 'team1' },
			'B': { name: 'B', x: 300, y: 400, r: 24, team: 'team0' },
			'C': { name: 'C', x: 400, y: 100, r: 24, team: 'team0' },
			'D': { name: 'C', x: 450, y: 200, r: 24, team: 'team2' },
			'E': { name: 'C', x: 250, y: 150, r: 24, team: 'team3' }

		},
		routes: [ 'A_B', 'B_C', 'C_D', 'C_E' ],
		players: [
			{ team: 'team1' },
			{ team: 'team2' },
			{ team: 'team3' }
		]
	}
};

var g_defs = {
	scale: 4,
	screen: {
		width: 1024,
		height: 768
	},
	teams: {
		team0: { color: '#9D9D9D' },
		team1: { color: '#31A2F2' },
		team2: { color: '#BE2633' },
		team3: { color: '#44891A' },
		team4: { color: '#BA01FF' },
		team5: { color: '#B6FF00' }
	},

	fontAttribs: { 'font-family': '"Orbitron", sans-serif', stroke: '#aa0', fill: '#ff0' },
	fontAttribs2: { 'font-family': '"Nova Square", cursive', stroke: '#ffff00', fill: '#ffff00' }
};
