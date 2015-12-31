
    var Q_model = function() {
    this.actions = []; // the full set of actions
    this.explored = 0; // how many states have been explored
    this.last_state = [0, 0]; // the last state predicted
    this.learning_rate = 1;
    this.random = 1;
    this.predict = function(state) {
        this.last_state = state;
        i = state[0]; // type of platform
        j = state[1]; // ydistance to platform
        k = state[2]; // xdist
        if (a = this.actions[i]) { // if this type of platform has been seen
            if (b = a[j]) // if this distance has been seen
                if( c = b[k])
                    return c;// prediction
                else{
                    this.actions[i][j][k] = Math.round(Math.random()*100);
                    this.explored++;
                    return this.actions[i][j][k];
                }
            else { // if this is a new distance
                this.actions[i][j] = []; // add it to the array
                this.actions[i][j][k] = Math.round(Math.random()*100);
                this.explored++; // new state discovered
                return this.actions[i][j][k];
            }
        } else { // this type of platform has not been seen
            this.actions[i] = []; // add the platform type
            this.actions[i][j] = [];
            this.actions[i][j][k] = Math.round(Math.random()*100); // add the distance
            this.explored++; // new state discovered
            return this.actions[i][j][k];
        }

    };

    this.reward = function(amount) {
        positive = 0;
        i = this.last_state[0];
        j = this.last_state[1];
        k = this.last_state[2];

        //this.actions[i][j][k] = Math.round((this.actions[i][j][k] + amount)/2);

        if(this.actions[i][j][k] > 0)
            positive = 1;
        this.actions[i][j][k] += this.learning_rate*amount;
        if(this.actions[i][j][k] == 0 && positive == 1)
            this.actions[i][j][k] -= 1; // this run 0.000000000000000000000001% of the time. yes. what does it do.
        //if it doesn't run, itll go from 0 -> random number from 1-100. it got me stuck before because it wouldnt go negative and i just ran out of ram.LOL FUCK
    }; // LOL duct tape here... what in the it was for your broken if b = ..... cause that still exists btw. TOLD YOU THIS CODE WAS UGLY AND MESSY LOL

}

var brain = new Q_model();

//autoload brain from disk
if(store.has('brain')) {
  var storedBrain = store.get('brain');
  brain.actions = storedBrain.actions;
  brain.explored = storedBrain.explored;
  //brain.last_state = storedBrain.last_state;
  console.log('Brain has been loaded');
  console.log('States explored:' + brain.explored);
}

var ydivision = 10; // round the y distance to the nearest ydivision
var xdivision = 40;
var previous_score = 0;
var previous_collision = -1; // how does this happen sometimes // the genie did it se c LLEOMLME L OLA DLOL OLOLOLOL

var target_platform = -2;
var base_score = 0;

function get_states() {
    state = [];
    platforms.forEach(function(p, i) {
        // state.push([1 * (p.state || (p.type == 3)), (Math.round((p.y - player.y) / ydivision) * ydivision) + Math.abs(Math.round( (p.x - player.x) / 6))]);
        state.push([1 * (p.state || (p.type == 3)) + 2 * (p.type == 2), (Math.round((p.y - player.y) / ydivision) * ydivision), Math.abs(Math.round( (p.x - player.x) / xdivision))*xdivision]);
        // multiplying by division rescales it so if we change division value later on, we can still use the brain created in this version
        // State = (Platform breakable, Y distance to platform)
    });
    return state;
}
function setGamespeed(val){
  gamespeed = val;
  document.getElementById("gamespeedVal").value = val;
  document.getElementById("gamespeed").value = val;
}

var states;
var previous_player_height = 0;
var scale_reward_pos = 1/75; // scale down reward because height difference is too high
var scale_death;
var previous_collision2 = -3;

function decide() {
    // reward for previous prediction
    //gamespeed = 0; // pause
    // console.log("decide");
    if (target_platform >= 0 && previous_collision >= 0 ) {
        if (player.isDead) {
        	scale_death = 1 + score/2000;
            brain.reward(-100*scale_death);
            //console.log("dead");
            reset();
        } else {
            if(previous_collision != target_platform){
            	if(states[target_platform][1] < states[previous_collision][1])
                	brain.reward(-20);
                else
                	brain.reward(-10);
            }
                	// need either this or to be able to tell apart the 2 cases //why...
                                    // the game is targetting a platform out of reach, and penalizing only the platform it is hitting oh right. i knew i needed it for something..
            brain.predict(states[previous_collision]);
            // r = (player.height - previous_player_height)*scale_reward_pos - 1;
            r = (score-previous_score-20);
            //if( (r>0) && (previous_collision == previous_collision2))
            //	r = 0;
            brain.reward(r);//////////

        }
    }
    previous_score = score;
    states = get_states();
    predictions = [];
    maxreward = 0;
    maxrewardindex = 0;
    for (zz = 0; zz < states.length; zz++) {
            predictions[zz] = brain.predict(states[zz]);
            platforms[zz].reward = predictions[zz];
            // if(predictions[zz] > predictions[maxrewardindex] && (zz != previous_collision)){
            if(predictions[zz] > predictions[maxrewardindex]){
            	maxreward = predictions[zz];
            	maxrewardindex = zz;
            }
    }
    target_platform = maxrewardindex;

    brain.predict(states[target_platform]);
    platforms.forEach(function(p, index) { p.target = 0; });
	platforms[target_platform].target = 1;


    previous_player_height = player.height;
    previous_collision2 = previous_collision;
}

////// Determine the direction to move to get to platform p
function direction(n) {
    p = platforms[n];
    dir = "none";
    try {
        if (p.x + 25< player.x)
        // if(Math.abs(p.x-player.x)-35 < (Math.abs(canvas.width - player.x) + p.x)  )
            dir = "left";
        else if (player.x < p.x + 15)
        // else
            dir = "right";

     //    if( Math.abs(p.x - player.x) > 175 ){
	    // 	if(dir == "left")
	    // 		dir = "right";
	    // 	else if(dir == "right")
	    // 		dir = "left";
	    // }
    } catch (e) {}

    return dir;
}
