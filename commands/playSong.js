const { SlashCommandBuilder } = require('discord.js');const YoutubeMp3Downloader = require("youtube-mp3-downloader");
const Downloader = require('../utils/downloader');
const ytdl = require('ytdl-core');
//Configure YoutubeMp3Downloader with your settings


//Download video and save as MP3 file
// YD.download("Vhd6Kc4TZls");

// YD.on("finished", function(err, data) {
//     console.log(JSON.stringify(data));
// });

// YD.on("queueSize", function(size) {
//     console.log(size);
// });

// YD.on("error", function(error) {
//     console.log(error);
// });

// YD.on("progress", function(progress) {
//     console.log(JSON.stringify(progress));
// });

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Plays a given youtube url')
		.addStringOption(option =>
            option.setName('link-or-url')
                .setDescription('The url dummy')
                .setRequired(true))
		.addStringOption(option =>
			option.setName('input')
				.setDescription('The input to echo back')),
	async execute(interaction) {
		const my_url = interaction.options.get('link-or-url').value;
		const myVideoId = my_url.split('?v=')[1];
		// console.log(myVideoId);
		// console.log(my_url);
		outputPath = './audioPlayer/' + interaction.user.username.toString();
		// const YD = new YoutubeMp3Downloader({
		// 	"ffmpegPath": "~/ffmpeg-5.1.1",        // FFmpeg binary location
		// 	"outputPath": outputPath,    // Output file location (default: the home directory)
		// 	"youtubeVideoQuality": "highestaudio",  // Desired video quality (default: highestaudio)
		// 	"queueParallelism": 2,                  // Download parallelism (default: 1)
		// 	"progressTimeout": 2000,                // Interval in ms for the progress reports (default: 1000)
		// 	"allowWebm": false                      // Enable download from WebM sources (default: false)
		// });
		// ytdl(my_url).pipe(fs.createWriteStream('video.mp3'));
		const downloader = new Downloader(outputPath=outputPath);
		var i = 0;
		downloader.getMP3({videoId: myVideoId, name: 'mySong.mp3'}, function(err,res){
			i++;
			if(err)
				throw err;
			else{
				console.log("Song "+ i + " was downloaded: " + res.file);
			}
		});
	},
};