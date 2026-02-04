var board = null;
var game = new Chess();
var $status = $('#status');

function onDragStart (source, piece, position, orientation) {
  if (game.game_over()) return false;
  if (piece.search(/^b/) !== -1) return false; // On ne peut bouger que les blancs
}

function makeRandomMove () {
  var possibleMoves = game.moves();
  if (possibleMoves.length === 0) return;

  var randomIdx = Math.floor(Math.random() * possibleMoves.length);
  game.move(possibleMoves[randomIdx]);
  board.position(game.fen());
  updateStatus();
}

function onDrop (source, target) {
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' 
  });

  if (move === null) return 'snapback';

  window.setTimeout(makeRandomMove, 250);
  updateStatus();
}

function updateStatus () {
  var status = '';
  var moveColor = (game.turn() === 'b') ? 'Noirs' : 'Blancs';

  if (game.in_checkmate()) { status = 'Match terminé, ' + moveColor + ' est mat.'; }
  else if (game.in_draw()) { status = 'Match nul !'; }
  else { status = moveColor + ' à jouer'; }

  $status.html(status);
}

var config = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png'
};
board = Chessboard('myBoard', config);

function resetGame() {
    game.reset();
    board.start();
    updateStatus();
}