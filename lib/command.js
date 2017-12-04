const util = require('util');
const EventEmitter = require('events').EventEmitter;

/**
 * Wrap ES5 class which wrapped ES6
 *
 * @param {Class} CommandClass ES6 class
 * @return {Function} ES5 class
 */
module.exports = CommandClass => {
  const command = function() {
    EventEmitter.call(this);
    this.cmd = new CommandClass();
  };

  util.inherits(command, EventEmitter);

  command.prototype.command = function() {
    return this.cmd.command.apply(this, arguments);
  };

  return command;
};
