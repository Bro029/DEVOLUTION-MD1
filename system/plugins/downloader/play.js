const yts = require('yt-search');

module.exports = {
   command: "play",
   alias: ["playmusic"],
   category: ["downloader"],
   settings: {
      group: true
   },
   description: "Play Music 🎵",
   loading: true,
   async run(m, { text, sock }) {
      if (!text) return m.reply('⚠️ Masukkan judul lagunya terlebih dahulu!');

      let convert = await yts({ search: text, hl: 'id', gl: 'ID' });

      if (convert === 0) {
         return m.reply('❌ Lagu yang Anda cari tidak ditemukan...');
      }

      let result = convert.all[0];
      let DEVOLUTION = `✨🎶 *[ PLAY - YOUTUBE ]* 🎶✨\n`;
      DEVOLUTION += `🎵 *Title*: ${result.title}\n`;
      DEVOLUTION += `🆔 *ID*: ${result.videoId}\n`;
      DEVOLUTION += `⏱️ *Durasi*: ${result.timestamp}\n`;
      DEVOLUTION += `📅 *Uploaded*: ${result.ago}\n`;
      DEVOLUTION += `📄 *Deskripsi*: ${result.description}\n`;
      DEVOLUTION += `🔗 *URL*: ${result.url}\n`;
      DEVOLUTION += `✨─────────────────✨\n\n`;
      DEVOLUTION += `⚠️ *Jika ingin video, reply dengan .mp4*`;

      await sock.sendMessage(m.cht, {
         text: DEVOLUTION,
         contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            externalAdReply: {
               title: result.title,
               mediaType: 1,
               previewType: 1,
               body: `⏱️ Durasi: ${result.timestamp} | 👁️ View: ${result.views}`,
               thumbnailUrl: result.image,
               renderLargerThumbnail: true,
               mediaUrl: result.url,
               sourceUrl: result.url
            }
         }
      }, { quoted: m });

      try {
         await sock.sendMessage(m.cht, { 
            audio: { url: `https://ytdl.nvlgroup.my.id/audio?url=${result.url}&bitrate=128` }, 
            mimetype: 'audio/mpeg' 
         }, { quoted: m });
      } catch (e) {
         m.reply('❌ Maaf, terjadi kesalahan...');
         console.error(e);
      }
   }
};