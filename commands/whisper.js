var l10n_file = __dirname + '/../l10n/commands/whisper.yml';
var l10n = require('../src/l10n')(l10n_file);
var CommandUtil = require('../src/command_util').CommandUtil;
exports.command = function(rooms, items, players, npcs, Commands) {
  return function(args, player) {
    args = args.split(' ');

    var target = args.shift();
    var msg = args.join(' ');
    var targetFound = true;

    if (args.length > 0) {
      targetFound = false;
      players.eachIf(
        (target) => CommandUtil.otherPlayerInRoom(target, player),
        (p) => {
          if (p.getName().toLowerCase() === target.toLowerCase()) {
            p.sayL10n(l10n, 'THEY_WHISPER', player.getName(), msg);
            targetFound = true;
          } else
            p.sayL10n(l10n, 'OTHERS_WHISPER', player.getName(),
              target);
          p.prompt();
        });
      if (targetFound) {
        player.sayL10n(l10n, 'YOU_WHISPER', target, msg);
        return;
      }
    }

    if (!targetFound)
      player.sayL10n(l10n, 'NO_TARGET_FOUND');
    player.sayL10n(l10n, 'NOTHING_SAID');

    return;
  }

};