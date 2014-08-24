/**
 * Created by jonas on 8/23/2014.
 */

var g_levels = {
	'1': {
		planets: {
			'A': { name: 'A', x: 90, y: 50, team: 'team1' },
			'B': { name: 'B', x: 130, y: 80, team: 'team0' }

		},
		routes: [ 'A_B' ],
		players: [
			{ team: 'team1' }
		],
		text: 'Origins - Drag to Conquer',
		music: 'simplesong'
	},
	'2': {
		planets: {
			'A': { name: 'A', x: 80, y: 50, team: 'team2' },
			'B': { name: 'B', x: 130, y: 80, team: 'team0' },
			'C': { name: 'C', x: 160, y: 90, team: 'team1' }

		},
		routes: [ 'A_B', 'B_C' ],
		players: [
			{ team: 'team1' },
			{ team: 'team2' }
		],
		text: 'A Nemesis',
		music: 'team2'
	},
	'3': {
		planets: {
			'A': { name: 'A', x: 80, y: 40, team: 'team1' },
			'B': { name: 'B', x: 110, y: 50, team: 'team0' },
			'C': { name: 'C', x: 150, y: 90, team: 'team0' },
			'D': { name: 'D', x: 180, y: 60, team: 'team3' }

		},
		routes: [ 'A_B', 'B_C', 'C_D' ],
		players: [
			{ team: 'team1' },
			{ team: 'team3' }
		],
		text: 'Another Challenger',
		music: 'team3'
	},
	'4': {
		planets: {
			'A': { name: 'A', x: 50, y: 50, team: 'team1' },
			'B': { name: 'B', x: 80, y: 100, team: 'team0' },
			'C': { name: 'C', x: 130, y: 30, team: 'team0' },
			'D': { name: 'D', x: 150, y: 70, team: 'team2' },
			'E': { name: 'E', x: 170, y: 50, team: 'team0' },
			'F': { name: 'F', x: 180, y: 70, team: 'team0' },
			'G': { name: 'G', x: 200, y: 110, team: 'team3' }

		},
		routes: [ 'A_B', 'B_C', 'C_D', 'C_E', 'E_F', 'F_G' ],
		players: [
			{ team: 'team1' },
			{ team: 'team2' },
			{ team: 'team3' }
		],
		text: 'The Final Test',
		music: 'final'
	}

};

var g_defs = {
	scale: 4,
	screen: {
		width: 1024,
		height: 640
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
