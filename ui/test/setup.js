import _ from 'lodash';
import seedrandom from 'seedrandom';

// Make lodash and seedrandom available globally for backward compatibility
global._ = _;
global.Math.seedrandom = seedrandom;
