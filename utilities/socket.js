let io;

module.exports.init = (serverIO) => {
  io = serverIO;
};

module.exports.emitGlobal = (event, payload) => {
  if (!io) return;
  io.emit(event, payload);
};

module.exports.toBoard = (board_id, event, payload) => {
  if (!io) return;
  io.to(`board_${board_id}`).emit(event, payload);
};
