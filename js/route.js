/**
 * Created by jonas on 8/23/2014.
 */

var Route = function(planetA, planetB) {
	this.startPlanet = planetA;
	this.endPlanet = planetB;

	var p1 = g_game.planets[planetA];
	var p2 = g_game.planets[planetB];

	this.exitAngle1 = Math.atan2(p2.y - p1.y, p2.x - p1.x);
	this.exitAngle2 = (this.exitAngle1 + Math.PI) % (Math.PI * 2);
	this.pt1 = p1.orbit.circumferencePoint(this.exitAngle1);
	this.pt2 = p2.orbit.circumferencePoint(this.exitAngle2);

	this.length = Math.abs(Phaser.Point.distance(this.pt1, this.pt2));

	this.destroy = function() {
		this.image.remove();
	}

	return this;
}

