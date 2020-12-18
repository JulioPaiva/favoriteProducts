module.exports = function RecursoIndevidoError(msg = 'Este recurso não pertence ao usuário') {
  this.name = 'RecursoIndevidoError';
  this.message = msg;
};
