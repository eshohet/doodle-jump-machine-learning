var num_inputs = 2; // platform type, distance to platform
var num_actions = 2; // go to platform or don't
var temporal_window = 0; // amount of temporal memory. 0 = agent lives in-the-moment :)
var network_size = num_inputs*temporal_window + num_actions*temporal_window + num_inputs;



// the value function network computes a value of taking any of the possible actions
// given an input state. Here we specify one explicitly the hard way
// but user could also equivalently instead use opt.hidden_layer_sizes = [20,20]
// to just insert simple relu hidden layers.
var layer_defs = [];
layer_defs.push({type:'input', out_sx:1, out_sy:1, out_depth:network_size});
layer_defs.push({type:'fc', num_neurons: 10, activation:'relu'});
//layer_defs.push({type:'fc', num_neurons: 50, activation:'relu'});
layer_defs.push({type:'regression', num_neurons:num_actions});

// options for the Temporal Difference learner that trains the above net
// by backpropping the temporal difference learning rule.
var tdtrainer_options = {learning_rate:0.001, momentum:0.0, batch_size:2/*64*/, l2_decay:0.01};

var opt = {};
opt.temporal_window = temporal_window;
opt.experience_size = 30000; 
opt.start_learn_threshold = 1; // how many times it explores before applying learning - default 1000s
opt.gamma = 0.7;
opt.learning_steps_total = 200000;
opt.learning_steps_burnin = 1; // how many steps to choose random actions default: 3000;
opt.epsilon_min = 0.05;
opt.epsilon_test_time = 0.05;
opt.layer_defs = layer_defs;
opt.tdtrainer_options = tdtrainer_options;

var brainnet = new deepqlearn.Brain(num_inputs, num_actions, opt); // woohoo

var brainthing = function() {
  this.actions = [];
  this.explored = 0;
  this.last_state = [0,0];
  this.last_reward = 0;
    //Function to draw it
  this.forward = function(state) {
  	this.last_state = state;
  	i = state[0];
  	j = state[1];
  	//console.log("forward");
  	if(a = this.actions[i]){
  		if(b = a[j])
  			return(b >= 0)
  		else{
  			this.actions[i][j] = 1;
  			this.explored++;
  			return 1;
  		}
  	}
  	else{
  		this.actions[i] = [];
  		this.actions[i][j] = 1
  		this.explored++;
  		return 1;
  	}
  };

  this.backward = function(reward) {
  	i = this.last_state[0];
  	j = this.last_state[1];
  	this.actions[i][j] += reward;
  };
  	
}
var brain = new brainthing();