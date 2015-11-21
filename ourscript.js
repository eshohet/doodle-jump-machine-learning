var Q_model = function() {
  this.actions = []; // the full set of actions
  this.explored = 0; // how many states have been explored
  this.last_state = [0,0]; // the last state predicted

  this.predict = function(state) {
  	this.last_state = state;
  	i = state[0]; // type of platform
  	j = state[1]; // distance to platform
  	if(a = this.actions[i]){ // if this type of platform has been seen
  		if(b = a[j]) // if this distance has been seen
  			return(b >= 0) // prediction
  		else{ // if this is a new distance
  			this.actions[i][j] = 1; // add it to the array
  			this.explored++; // new state discovered
  			return 1;
  		}
  	}
  	else{ // this type of platform has not been seen
  		this.actions[i] = [];   // add the platform type
  		this.actions[i][j] = 1 // add the distance
  		this.explored++; // new state discovered
  		return 1;
  	}

  };

  this.reward = function(amount) {
  	i = this.last_state[0];
  	j = this.last_state[1];
  	this.actions[i][j] += amount;
  };
  	
}
var brain = new Q_model();