
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
        if(this.actions[i][j][k] > 0)
            positive = 1;
        this.actions[i][j][k] += this.learning_rate*amount;
        if(this.actions[i][j][k] == 0 && positive == 1)
            this.actions[i][j][k] -= 1;
    };

}

var brain = new Q_model();

//autoload brain from disk
/*if(store.has('brain')) {
  var storedBrain = store.get('brain');
  brain.actions = storedBrain.actions;
  brain.explored = storedBrain.explored;
  //brain.last_state = storedBrain.last_state;

  console.log('Brain has been loaded');
}*/

var division = 10; // round the y distance to the nearest division
var previous_score = 0;
var previous_collision = -1;
var target_platform = -2;
var base_score = 0;

function get_states() {
    state = [];
    platforms.forEach(function(p, i) {
        // state.push([1 * (p.state || (p.type == 3)), (Math.round((p.y - player.y) / division) * division) + Math.abs(Math.round( (p.x - player.x) / 6))]);
        state.push([1 * (p.state || (p.type == 3)), (Math.round((p.y - player.y) / division) * division), Math.abs(Math.round( (p.x - player.x) / division))*division]);
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
function get_state_num(i) {
    p = platforms[i];
    // state = ([1 * (p.state || (p.type == 3)), (Math.round((p.y - player.y) / division) * division) + Math.abs(Math.round( (p.x - player.x) / 6))]);
    state.push([1 * (p.state || (p.type == 3)), (Math.round((p.y - player.y) / division) * division), Math.abs(Math.round( (p.x - player.x) / division))]);
    // Im not sure..  note that this function returns a single state, rather than an array of states. got it boss
    // State = (Platform breakable, Y distance to platform)
    return state;
}


var states;

function decide() {
    // reward for previous prediction
    //gamespeed = 0; // pause
    // console.log("decide");
    if (target_platform >= 0) {

        if (player.isDead) {
            brain.reward(-100);
            //console.log("dead");
            reset();
        } else {
            if (target_platform == previous_collision) {
                // decision was success
                brain.reward((score - previous_score - 5 )); // reward it for increasing score
                // penalize for staying in same spot
                //console.log("success");
            } else {
                // missed the target platform, but didn't die
                brain.reward(-10)
                brain.predict(states[previous_collision]); // reward for the platform we landed on.
                brain.reward((score - previous_score));
                //console.log("miss");
            }

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
    // if(!brain.random)
        target_platform = maxrewardindex;
    // else{
        //If we're picking random options, randomly pick from the values that are at least not negative, e.g. have not failed often.
        // while( (predictions[(target_platform = Math.floor(Math.random() * 10))] ) <= 0);
    // }
    // if (predictions.length < 2) { // stuck
    //     target_platform = Math.floor(Math.random() * 10);
    // }
    brain.predict(states[target_platform]);
    platforms.forEach(function(p, index) { p.target = 0; });
	platforms[target_platform].target = 1;



}

////// Determine the direction to move to get to platform p
function direction(n) {
    p = platforms[n];
    try {
        if (p.x + p.width - 35 < player.x)
        // if(Math.abs(p.x-player.x)-35 < (Math.abs(canvas.width - player.x) + p.x)  )
            return "left"
        else if (player.x < p.x + 10)
        // else
            return "right"
    } catch (e) {}
    return "none"
}
