const { createReadStream } = require('node:fs');
const { demuxProbe, createAudioResource } = require('@discordjs/voice');

async function probeAndCreateResource(readableStream) {
	const { stream, type } = await demuxProbe(readableStream);
	return createAudioResource(stream, { inputType: type });
}

async function createResources() {
	// Creates an audio resource with inputType = StreamType.Arbitrary
	const mp3Stream = await probeAndCreateResource(createReadStream('file.mp3'));

	// Creates an audio resource with inputType = StreamType.OggOpus
	const oggStream = await probeAndCreateResource(createReadStream('file.ogg'));

	// Creates an audio resource with inputType = StreamType.WebmOpus
	const webmStream = await probeAndCreateResource(createReadStream('file.webm'));
}

createResources();