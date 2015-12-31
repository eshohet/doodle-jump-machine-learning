# Reinforcement Learning Applied to Doodle Jump



## Overview

This project demonstrates the application of Q Learning, a reinforcement learning algorithm, to an HTML5 implementation of Doodle Jump.

Performance of the algorithm with fine-tuned hyperparameters shown below:

<center><img src="https://raw.githubusercontent.com/eshohet/doodle-jump-machine-learning/master/report/x8_y2_rate1.png" /></center>

<center><img src="https://raw.githubusercontent.com/eshohet/doodle-jump-machine-learning/master/report/dj.png" /></center>


See paper.pdf for in-depth details.


## Setup & Running
No installation is necessary, simply clone the repository and open up index.html in your favorite browser.


## UX Enhancements

We've added several enhancements to the user interface for your convenience.

* Gamespeed - controls how fast the doodle plays
* Draw toggle - turn this off and the algorithm will consume less resources since it will not render anything
* Chart 1 - shows the average score per 10 deaths
* Chart 2 - shows the states explored per 10 deaths

## Advice

### Game
In order to modify the game's logic, see scripts/GameLogic.js

### Algorithm & Hyperparameters
To modify our implementation of Q Learning, see scripts/QLearning.js

### Autosave/load
Your "brain" object is automatically saved and loaded when the browser closes and opens.

### Useful Variables

* brain - holds all information needed by the ML algorithm
* player - the player object holds information such as the doodle's coordinates
* platforms  - holds platform information for all platforms (each of which belongs to the platform class
 * gamespeed - controls how fast the doodle plays

## Algorithmic Details

Please see paper.pdf for technical details of our machine learning algorithm.

## Contributors
Elliot Shohet, Michael Mathew, Grigor Ambartsumyan, Anmol Singh, Ibrahim Ahmed, Tuan Vu, Haoyao Chen, Inka Arifin, Guranjan Singh, Ronil Singh, Masayuki Takagi, Ahsan Abdullah
