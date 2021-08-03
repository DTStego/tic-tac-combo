(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){(function (){
var analyzer = require('drawn-shape-recognizer');
global.analyzer = analyzer;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"drawn-shape-recognizer":3}],2:[function(require,module,exports){
const distance = (point1, point2) => {
	return Math.sqrt( Math.pow(point1.x-point2.x, 2) + Math.pow(point1.y-point2.y, 2) );
};

const isVertical = (points) => {
	if (!points.length) {
		return;
	}
	return Math.abs(points[0].x - points[points.length - 1].x) <  Math.abs(points[0].y - points[points.length - 1].y);
};

const rotate = (pivotPoint, point, angle) => {
	const cos = Math.cos(angle);
	const sin = Math.sin(angle);
	var newX = Math.round((cos * (point.x - pivotPoint.x)) + (sin * (point.y - pivotPoint.y)) + pivotPoint.x);
	var newY = Math.round((cos * (point.y - pivotPoint.y)) - (sin * (point.x - pivotPoint.x)) + pivotPoint.y);
	return {
		x:newX,
		y:newY
	};
};

module.exports = {
  distance,
  isVertical,
	rotate
};

},{}],3:[function(require,module,exports){
const analyzeCircle = require('./shapes/circle.js');
const analyzeLine = require('./shapes/line.js');
const analyzeSine = require('./shapes/sine.js');
const analyzer = {
  analyzeCircle,
  analyzeLine,
  analyzeSine
};
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = analyzer;
}
if (typeof window !== 'undefined') {
  window.analyzer = analyzer;
}

analyzer.analyzeLine([]);

},{"./shapes/circle.js":4,"./shapes/line.js":5,"./shapes/sine.js":6}],4:[function(require,module,exports){
const common = require('../common.js');

const analyzeCircle = (points, tolerance) => {
	if (tolerance === undefined) {
		tolerance = 0.5;
	}
	const xs = points.map(obj => obj.x);
	const maxx = Math.max.apply(null,xs);
	const minx = Math.min.apply(null,xs);
	const ys = points.map(obj => obj.y);
	const maxy = Math.max.apply(null,ys);
	const miny = Math.min.apply(null,ys);
  const center = {
    x:(maxx + minx)/2,
    y:(maxy + miny)/2
  };
	const distances = points.map((obj) => {
		obj.d = common.distance(obj, center);
		return obj.d;
	});
	const averageDistance = distances.reduce((a,b) => a + b, 0) / points.length;

	let totalDist = 0;
	let maxd = {d:0};
	let mind = {d:Infinity};
	points.forEach((pt) => {
		totalDist += Math.pow(Math.abs((pt.d - averageDistance) / averageDistance), tolerance);
		if(pt.d > maxd.d){
			maxd = pt;
		}
		if(pt.d < mind.d){
			mind = pt;
		}
	});
	totalDist = totalDist / points.length;
	var result = {
		accuracy:1 - totalDist,
		lowWeakPoint: mind,
		highWeakPoint: maxd,
		radius:averageDistance,
		center
	};
	return result;
};

module.exports = analyzeCircle;

},{"../common.js":2}],5:[function(require,module,exports){
const common = require('../common.js');

const analyzeLine = (points) => {
	const vertical = common.isVertical(points);
	let correctedPoints = points;
	if(vertical){
		correctedPoints = points.map((pt) => {
			return {
        x: pt.y,
        y: pt.x
      };
		});
	}
	const valuesX = correctedPoints.map(obj => obj.x);
	const valuesY = correctedPoints.map(obj => obj.y);

	let sumX = 0;
	let sumY = 0;
	let sumXY = 0;
	let sumXX = 0;
	let count = 0;
	let x = 0;
	let y = 0;
	let valuesLength = valuesX.length;
	if (valuesLength === 0) {
		return [ [], [] ];
	}
	for (let v = 0; v < valuesLength; v++) {
		x = valuesX[v];
		y = valuesY[v];
		sumX += x;
		sumY += y;
		sumXX += x*x;
		sumXY += x*y;
		count++;
	}
	const m = (count*sumXY - sumX*sumY) / (count*sumXX - sumX*sumX);
	const b = (sumY/count) - (m*sumX)/count;
	let totalDist = 0;
	let prev = null;
	let allDistance = 0;
	correctedPoints.forEach((pt) => {
		if(prev){
			allDistance += common.distance(pt,prev);
		}
		prev = pt;
	});
	const firstPoint = {
		x: valuesX[0],
		y: valuesX[0] * m + b
	};
	const lastpoint = {
		x: valuesX[valuesX.length - 1],
		y: valuesX[valuesX.length - 1] * m + b
	};
	const fixedLength = common.distance(firstPoint,lastpoint);
	totalDist =  fixedLength / allDistance ;
	let result = {
		accuracy: totalDist,
		firstPoint: firstPoint,
		lastPoint: lastpoint,
		angle: Math.atan(m),
		length: fixedLength,
		fullLength: allDistance
	};
	//if vertical correct results
	if(vertical){
			result.firstPoint = {
        x: result.firstPoint.y,
        y: result.firstPoint.x
      };
			result.lastPoint = {
        x: result.lastPoint.y,
        y: result.lastPoint.x
      };
			result.angle += Math.PI/2;
	}
	return result;
};

module.exports = analyzeLine;

},{"../common.js":2}],6:[function(require,module,exports){
const common = require('../common.js');
const analyzeLine = require('./line.js');

const analyzeSine = (points, threshold) => {
	if (threshold === undefined) {
		threshold = 3;
	}
	let line = analyzeLine(points);
	delete line.accuracy;
	const translatedPoints = points.map((pt) => {
		return common.rotate(points[0], pt, line.angle);
	});
	const lineTestResult = lineTest(translatedPoints);
	console.log(lineTestResult);
	if(!lineTestResult.valid){
		line.valid = false;
	} else if (checkPeaks(lineTestResult.criticalPoints, threshold)){
		//find amplitude
		const avehigh = lineTestResult.highPts.reduce((a,b) =>{
			return a + b.y;
		},0) / lineTestResult.highPts.length;
		const avelow = lineTestResult.lowPts.reduce((a,b) =>{
			return a + b.y;
		},0) / lineTestResult.lowPts.length;
		line.amplitude = Math.abs(avehigh - avelow) / 2;
		//find period
		line.valid = true;
	} else {
		line.valid = false;
	}
  return line;
};

const lineTest = (points) => {
	let prev = {x:0,y:0};
	let direction = 'up';
	let highpts = [];
	let lowpts =[];
	let travelDirection = '';
	//checks for direction
	if(points[0].x < points[points.length-1].x){
		travelDirection = 'left';
	} else if(points[0].x > points[points.length-1].x){
		travelDirection = 'right';
	}
	let valid = points.every((current) => {
		let result;
		if(travelDirection === 'left') {
			result = current.x + 1 >= prev.x;
			if(direction === 'up' && current.y < prev.y ){
				direction = 'down';
				current.type='high';
				highpts.push(current);
			} else if(direction === 'down' && current.y > prev.y){
				direction = 'up';
				current.type='low';
				lowpts.push(current);
			}
		}
		else if(travelDirection === 'right'){
			result = current.x - 1 <= prev.x;
			if(prev.x === 0){
				result = true;
			}
			if(direction === 'up' && cur.y < prev.y ){
				direction = 'down';
				current.type='high';
				highpts.push(current);
			} else if(direction === 'down' && cur.y > prev.y){
				direction = 'up';
				current.type='low';
				lowpts.push(current);
			}
		}
		prev = current;
		return result;
	});
	const averageHeight = points.map((point) =>{
		return point.y;
	}).reduce((a,b) => {
		return a + b;
	},0) / points.length;

	highpts = highpts.filter((highPoint) => {
		return highPoint.y > averageHeight;
	});
	lowpts = lowpts.filter((lowPoint) => {
		return lowPoint.y < averageHeight;
	});
	if(valid && (lowpts.length < 2 || highpts.length < 2)){
		valid = false;
	}
	var testResult = {
		criticalPoints:highpts.concat(lowpts),
		highPts:highpts,
		lowPts:lowpts,
		valid:valid
	};
	return testResult;
};

const checkPeaks = (points, threshold) => {
	var prevType = null;
	var peakCount = 0;
	points.sort((a,b) => {
		return a.x - b.x;
	}).forEach((point) => {
		if(point.type !== prevType && prevType !== null){
			peakCount++;
		}
		prevType = point.type;
	});
	return peakCount >= threshold;
};

module.exports = analyzeSine;

},{"../common.js":2,"./line.js":5}]},{},[1]);
