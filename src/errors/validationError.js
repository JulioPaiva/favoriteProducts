module.exports = function ValidationError(msg) {
  this.name = 'ValidationError';
  this.message = msg;
}