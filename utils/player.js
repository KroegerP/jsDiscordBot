const { createAudioPlayer, joinVoiceChannel, AudioPlayerStatus, entersState } = require('@discordjs/voice');

const connection = joinVoiceChannel({
	channelId: channel.id,
	guildId: channel.guild.id,
	adapterCreator: channel.guild.voiceAdapterCreator,
});

export const player = createAudioPlayer({
    behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause,
    },
});

connection.on(VoiceConnectionStatus.Ready, () => {
	console.log('The connection has entered the Ready state - ready to play audio!');
});

player.on(AudioPlayerStatus.Playing, (oldState, newState) => {
	console.log('Audio player is in the Playing state!');
});

// connection.on('stateChange', (oldState, newState) => {
// 	console.log(`Connection transitioned from ${oldState.status} to ${newState.status}`);
// });

// player.on('stateChange', (oldState, newState) => {
// 	console.log(`Audio player transitioned from ${oldState.status} to ${newState.status}`);
// });

player.on('error', error => {
	console.error(error);
    player.play(getNextResource());
});

player.on(AudioPlayerStatus.Idle, () => {
	player.play(getNextResource());
});

async function start() {
	player.play(resource);
	try {
		await entersState(player, AudioPlayerStatus.Playing, 5_000);
		// The player has entered the Playing state within 5 seconds
		console.log('Playback has started!');
	} catch (error) {
		// The player has not entered the Playing state and either:
		// 1) The 'error' event has been emitted and should be handled
		// 2) 5 seconds have passed
		console.error(error);
	}
}