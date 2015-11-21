var Q_model = function() {
    this.actions = []; // the full set of actions
    this.explored = 0; // how many states have been explored
    this.last_state = [0, 0]; // the last state predicted
    this.learning_rate = 0.1;
    this.predict = function(state) {
        this.last_state = state;
        i = state[0]; // type of platform
        j = state[1]; // distance to platform
        if (a = this.actions[i]) { // if this type of platform has been seen
            if (b = a[j]) // if this distance has been seen
                return (b >= 0) // prediction
            else { // if this is a new distance
                this.actions[i][j] = 1; // add it to the array
                this.explored++; // new state discovered
                return 1;
            }
        } else { // this type of platform has not been seen
            this.actions[i] = []; // add the platform type
            this.actions[i][j] = 1 // add the distance
            this.explored++; // new state discovered
            return 1;
        }

    };

    this.reward = function(amount) {
        i = this.last_state[0];
        j = this.last_state[1];
        this.actions[i][j] += this.learning_rate*amount;
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

function get_states() {
    state = [];
    platforms.forEach(function(p, i) {
        state.push([1 * (p.flag || (p.type == 3)), Math.round((p.y - player.y) / division) * division]);
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
    state = ([1 * (p.state || (p.type == 3)), Math.round((p.y - player.y) / division)] * division);
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
            brain.reward(-10);
            //console.log("dead");
            reset();
        } else {
            if (target_platform == previous_collision) {
                // decision was success
                brain.reward((score - previous_score - 1)); // reward it for increasing score
                // penalize for staying in same spot
                //console.log("success");
            } else {
                // missed the target platform, but didn't die
                brain.predict(states[previous_collision]); // reward for the platform we landed on.
                brain.reward();
                //console.log("miss");
            }

        }
    }
    previous_score = score;
    states = get_states();
    predictions = [];
    q = 0;
    for (q = 0; q < states.length; q++) {
        if (platforms[q].reward = brain.predict(states[q]))
            predictions.push(q);
    }
    target_platform = predictions[Math.floor(Math.random() * predictions.length)];
    if (predictions.length < 2) { // stuck
        target_platform = Math.floor(Math.random() * 10);
    }
    brain.predict(states[target_platform]);
    platforms.forEach(function(p, index) { p.target = 0; });
	platforms[target_platform].target = 1;



}

////// Determine the direction to move to get to platform p
function direction(n) {
    p = platforms[n];
    try {
        if (p.x + p.width - 25 < player.x)
            return "left"
        else if (player.x < p.x + 25)
            return "right"
    } catch (e) {}
    return "none"
}
