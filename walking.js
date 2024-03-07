var Link = document.getElementById("link");
var currentKeys = [];//get an array ready to record currently pressed keys
var UP = 'w';
var LEFT = 'a';
var DOWN = 's';
var RIGHT = 'd';

var canmoveleft=true; 
// you'll be free to move left if no collisions are happening on your left, etc
var canmoveright=true; 
var canmoveup=true; 
var canmovedown=true;

var Obstacle = document.getElementById("block");

function isCrashing(Block1, Block2) {
	// the genius formula we'll use to check if Link (Block1) is crashing into the obstacle (Block2)
	return !(
		Block1.bottom < Block2.top ||
		Block1.top>Block2.bottom ||
		Block1.right < Block2.left ||
		Block1.left > Block2.right
	); // "if none of these are true, we're crashing"
}

function checkforcrashes(){

	var Me = Link.getBoundingClientRect();
	// getBoundingClientRect gives the pixel position of the block's top and left (but doesn't include the bottom or right. Got to add that manually, below)
	Me.bottom = Me.top + Me.height; 
	// bottom can be calculated like this and added to the 'Me' group
	Me.right = Me.left + Me.width;

	// get the same location info of the block:
	var Block = Obstacle.getBoundingClientRect();
	Block.bottom = Block.top + Block.height;
	Block.right = Block.left + Block.width;

	//get the distances from each block side:
	var top = Math.abs(Me.bottom - Block.top);
	var bottom = Math.abs(Me.top - Block.bottom);
	var left = Math.abs(Me.right - Block.left);
	var right = Math.abs(Me.left - Block.right); 

	var shortestDistance = Math.min(top, bottom, left, right);

	var sideOfBlockWereHitting =
	shortestDistance === top ? "top"
		: shortestDistance === bottom ? "bottom"
			: shortestDistance === left ? "left"
				: "right";
	
	if (isCrashing(Me, Block) && sideOfBlockWereHitting === "bottom") {
		canmoveup = false;
		// "if we're crashing into the block and the shortest distance is from the bottom, stop Link from moving up"
	}
	else if (isCrashing(Me, Block) && sideOfBlockWereHitting === "top") {
		canmovedown = false;
	} else if (isCrashing(Me, Block) && sideOfBlockWereHitting === "left") {
		canmoveright = false;
	} else if (isCrashing(Me, Block) && sideOfBlockWereHitting === "right") {
		canmoveleft = false;
	}
	else {
	// and finally if we're not crashing anywhere, clear any previously stopped directions and allow full movement:
		canmoveleft = true;
		canmoveright = true;
		canmoveup = true;
		canmovedown = true;
	}

}

function gameLoop(){//for each frame of animation...

	var leftpos = parseInt(Link.style.left);
	//prepare to change Link's inline CSS positioning

	var toppos = parseInt(Link.style.top);
	
	if (currentKeys[LEFT]) Link.style.left = leftpos - 3 + 'px';
	//if one of the key codes in the 'currentKeys' array is the key code for 'LEFT', set Link's left position to his current left position - 3 pixels (for every frame)

	if (currentKeys[RIGHT]) Link.style.left = leftpos + 3 + 'px';
	//3 pixels per frame seemed like a good speed

	if(currentKeys[UP]) Link.style.top = toppos - 3 + 'px';

	if(currentKeys[DOWN]) Link.style.top = toppos + 3 + 'px';
	//the logic of your code is important: by not using "else if" with these ifs, you can have multiple keys working at the same time, which lets Link move both down and left, etc.
	
	window.requestAnimationFrame(gameLoop);
	//and now run this game loop again, and keep running it at as fast a rate as javascript can conveniently fit it in

}

document.body.addEventListener(
	"keydown", 
	function(infoAboutTheKey){
		currentKeys[infoAboutTheKey.key] = true;
		//add the key's name to the array of currently pressed keys
		Link.setAttribute('data-key-'+infoAboutTheKey.key, true);
		//point him in the direction he's walking with Data Attributes & the CSS
});

document.body.addEventListener(
	"keyup",
	function(infoAboutTheKey){
		currentKeys[infoAboutTheKey.key] = false; 
		Link.setAttribute('data-key-'+infoAboutTheKey.key, ''); 
		//blank out this key's data-key attribute, stop pointing him in the direction he's no longer walking in
});

window.addEventListener(
	"load", 
	function(){
		gameLoop();
});