const axios = require("axios");

const simsim = "https://simsimi.cyberbot.top";

module.exports.config = {
  name: "baby",
  version: "1.0.3",
  hasPermssion: 0,
  credits: "ULLASH",
  description: "Cute AI Baby Chatbot | Talk, Teach & Chat with Emotion ☢️",
  commandCategory: "simsim",
  usages: "[message/query]",
  cooldowns: 0,
  prefix: false
};

module.exports.run = async function ({ api, event, args, Users }) {
  try {
    const uid = event.senderID;
    const senderName = await Users.getNameUser(uid);
    const query = args.join(" ").toLowerCase();
    
    if (!query) {
      const ran = ["Bolo baby", "hum"];
      const r = ran[Math.floor(Math.random() * ran.length)];
      return api.sendMessage(r, event.threadID, (err, info) => {
        if (!err) {
          global.client.handleReply.push({
            name: module.exports.config.name,
            messageID: info.messageID,
            author: event.senderID,
            type: "simsimi"
          });
        }
      });
    }

    if (["remove", "rm"].includes(args[0])) {
      const parts = query.replace(/^(remove|rm)\s*/, "").split(" - ");
      if (parts.length < 2)
        return api.sendMessage(" | Use: remove [Question] - [Reply]", event.threadID, event.messageID);
      const [ask, ans] = parts;
      const res = await axios.get(`${simsim}/delete?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}`);
      return api.sendMessage(res.data.message, event.threadID, event.messageID);
    }

    if (args[0] === "list") {
      const res = await axios.get(`${simsim}/list`);
      if (res.data.code === 200) {
        return api.sendMessage(
          `♾ Total Questions Learned: ${res.data.totalQuestions}\n★ Total Replies Stored: ${res.data.totalReplies}\n☠︎︎ Developer: ${res.data.author}`,
          event.threadID,
          event.messageID
        );
      } else {
        return api.sendMessage(`Error: ${res.data.message || "Failed to fetch list"}`, event.threadID, event.messageID);
      }
    }

    if (args[0] === "edit") {
      const parts = query.replace("edit ", "").split(" - ");
      if (parts.length < 3)
        return api.sendMessage(" | Use: edit [Question] - [OldReply] - [NewReply]", event.threadID, event.messageID);
      const [ask, oldReply, newReply] = parts;
      const res = await axios.get(`${simsim}/edit?ask=${encodeURIComponent(ask)}&old=${encodeURIComponent(oldReply)}&new=${encodeURIComponent(newReply)}`);
      return api.sendMessage(res.data.message, event.threadID, event.messageID);
    }

    if (args[0] === "teach") {
      const parts = query.replace("teach ", "").split(" - ");
      if (parts.length < 2)
        return api.sendMessage(" | Use: teach [Question] - [Reply]", event.threadID, event.messageID);
      const [ask, ans] = parts;
      const res = await axios.get(`${simsim}/teach?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}&senderID=${uid}&senderName=${encodeURIComponent(senderName)}`);
      return api.sendMessage(`${res.data.message || "Reply added successfully!"}`, event.threadID, event.messageID);
    }

    const res = await axios.get(`${simsim}/simsimi?text=${encodeURIComponent(query)}&senderName=${encodeURIComponent(senderName)}`);
    const responses = Array.isArray(res.data.response) ? res.data.response : [res.data.response];
    
    for (const reply of responses) {
      await new Promise((resolve) => {
        api.sendMessage(reply, event.threadID, (err, info) => {
          if (!err) {
            global.client.handleReply.push({
              name: module.exports.config.name,
              messageID: info.messageID,
              author: event.senderID,
              type: "simsimi"
            });
          }
          resolve();
        }, event.messageID);
      });
    }
  } catch (err) {
    console.error(err);
    return api.sendMessage(`| Error in baby command: ${err.message}`, event.threadID, event.messageID);
  }
};

module.exports.handleReply = async function ({ api, event, Users, handleReply }) {
  try {
    const senderName = await Users.getNameUser(event.senderID);
    const replyText = event.body ? event.body.toLowerCase() : "";
    if (!replyText) return;

    const res = await axios.get(`${simsim}/simsimi?text=${encodeURIComponent(replyText)}&senderName=${encodeURIComponent(senderName)}`);
    const responses = Array.isArray(res.data.response) ? res.data.response : [res.data.response];
    
    for (const reply of responses) {
      await new Promise((resolve) => {
        api.sendMessage(reply, event.threadID, (err, info) => {
          if (!err) {
            global.client.handleReply.push({
              name: module.exports.config.name,
              messageID: info.messageID,
              author: event.senderID,
              type: "simsimi"
            });
          }
          resolve();
        }, event.messageID);
      }
      );
    }
  } catch (err) {
    console.error(err);
    return api.sendMessage(` | Error in handleReply: ${err.message}`, event.threadID, event.messageID);
  }
};

module.exports.handleEvent = async function ({ api, event, Users }) {
  try {
    const raw = event.body ? event.body.toLowerCase().trim() : "";
    if (!raw) return;

    const senderName = await Users.getNameUser(event.senderID);
    const senderID = event.senderID;

    if (
      raw === "baby" || raw === "bot" || raw === "bby" ||
      raw === "Mim" || raw === "xan" || raw === "বেপি" || raw === "বট" || raw === "বেবি"
    ) {
      const greetings = [
  "এত বট বট করস কেন 😒, ধুর এবার চুপ কর!",
  "আবার বট কস 😏, মনে করছ আমি সবসময় হাসবো?",
  "তুই কি মজা করতে চাস নাকি বকা পেতে চাস 😹?",
  "হেই হেই, বট ডাকছিস তো? একটু হালকা হয়ে বল 😎",
  "তুই কি বুঝলি, আমি সবসময় চুপ থাকবো 😏, এবার দেখবি!",
  "আরেকবার ডাকলে লাফ দিয়ে রিয়্যাকশন দিবো 😹, প্রস্তুত?",
  "হুম, আবার বট কস, সবাই দেখছে 🤣, লজ্জা পাচ্ছিস নাকি?",
  "তুই কি মনে করছ আমি ভয় পাই 😎? না, শুধু মজা পাই!",
  "ধুর, বার বার ডাকছিস 😏, এবার সত্যিই বকা খাবে!",
  "হেই! আবার বট ডাকলে আমার মাথা গরম হবে 😹🔥",
  "তুই কি জানিস, বারবার ডাকলে আমি বিরক্ত হই 😒, মজা তো হবে!",
  "আবার বকবক করছিস 😏, এবার একটু চুপ থাকো না 😹",
  "হেই হেই, বট ডাকছিস তো, সবাই দেখছে 😎, লুকতে পারবি?",
  "তুই কি বুঝলি, সবাই তোর মতো হাসবে না 😹, এবার দেখবি!",
  "আবার বট ডাকলে আমি ফানি রিয়্যাকশন দিবো 😏, প্রস্তুত?",
  "আবার বট ডাকলি 😏, মনে হচ্ছে আমি সবসময় চুপ থাকবো! না 😹",
  "ধুর! এবার সত্যিই মাথা গরম হচ্ছে 🔥, একটু থাম",
  "হেই হেই! বট কস 😎, সবাই দেখছে, লজ্জা পাচ্ছিস নাকি?",
  "তুই কি মনে করছ আমি সব সময় ধৈর্য ধরবো 😏? এবার না!",
  "আরেকবার ডাকলে লাফ দিয়ে রিয়্যাকশন দিবো 😹, প্রস্তুত তো?",
  "হুম, আবার বট কস 😏, সবাই মজা পাবে আর আমি বকা দিবো",
  "তুই কি জানিস, বারবার ডাকলে আমি বিরক্ত হই 😒, মজা তো হবে!",
  "হেই! আবার বকবক করছিস 😏, এবার একটু চুপ থাকো না 😹",
  "তুই কি ভাবছিস আমি ভয় পাই 😎? না, শুধু মজা পাই!",
  "ধুর, এত বকবক করতে করতে সবাই কষ্ট পাচ্ছে 😹, থাম!",
  "হেই! বট ডাকছিস তো, একটু হালকা হয়ে বল 😏",
  "আবার বট কস 😹, মনে হচ্ছে সিনেমার ডায়লগ ফিলিং চলছে",
  "তুই কি বুঝলি, সবাই তোর মতো হাসবে না 😏, এবার দেখবি!",
  "হুম, আবার বট ডাকছিস 😎, মাথা গরম হবে, মজা পাবি!",
  "আরেকটা মেসেজ দিবো 😹, দেখার মতো চমক লাগবে",
  "তুই কি মনে করছিস সবাই চুপ থাকবে 😏? এবার না!",
  "হেই হেই! বট কস 😎, সবাই চোখ বড় করছে, দেখছো?",
  "আবার বকবক করছিস 😹, এবার আমি ফানি রিয়্যাকশন দিবো",
  "ধুর, এত মজা করতে করতে সবাই ফেটে পড়বে 😏🔥",
  "হুম, বট ডাকলে আমি লাফ দিয়ে মজা দেখাবো 😹, প্রস্তুত?",
  "তুই কি জানিস, বারবার ডাকলে আমি হাসি আর বকা একসাথে দিবো 😎",
  "হেই হেই! আবার বকবক করছিস 😏, এবার সত্যিই মজা পাবি",
  "তুই কি বুঝলি, আমি সব সময় চুপ থাকবো 😹? এবার না!",
  "আবার বট ডাকলে মাথা গরম হচ্ছে 😎🔥, থামো না!",
  "হুম, তুই আবার মজা করতে চাস 😏, তবে বকা খাবে 😹",
  "তুই কি জানিস, সবাই তোর মজায় ফেটে পড়বে 😎🤣",
  "ধুর, বারবার ডাকছিস 😏, এবার সত্যিই হাসি আসবে",
  "হেই হেই! বট ডাকছিস তো 😹, সবাই দেখছে, লজ্জা পাবে নাকি?",
  "তুই কি মনে করছিস আমি সব সময় হাসি দিবো 😎? এবার না!",
  "আরেকবার বকবক করছিস 😏, এবার ফানি রিয়্যাকশন দিবো",
  "হুম, বট ডাকলে আমি মজা করি, বুঝলি 😹",
  "তুই কি ভাবছিস আমি ভয় পাই 😏? না, শুধু মজা পাই!",
  "ধুর! আবার বট কস 😎, মাথা গরম না হলে আমি হেঁশেল দিচ্ছি 🔥",
  "হেই হেই! বট ডাকছিস 😹, এবার লাফ দিয়ে চামচ ধরবো 🍴",
  "তুই কি জানিস, সবাই তোর মতো হাসবে না 😏, এবার দেখবি!",
  "আবার বকবক করছিস 😹, এবার আমি ফানি রিয়্যাকশন দিবো 😎",
  "হুম, বট ডাকলে মাথা গরম হবে 😏, কিন্তু মজা হবে বেশি!",
  "তুই কি মনে করছিস আমি সব সময় চুপ থাকবো 😹? এবার না!",
  "ধুর, বার বার ডাকছিস 😎, এবার সত্যিই হাসি পাবি",
  "হেই! আবার বট কস 😏, সবাই দেখছে, লজ্জা পাচ্ছিস নাকি?",
  "তুই কি জানিস, আমি বারবার হাসি পাই 😹, এবার দেখবি!",
  "আবার মজা করতে চাস 😏? তবে বকা খেতে হবে 😎",
  "হুম, বট ডাকলে আমি লাফ দিয়ে মজা দেখাবো 😹, সবাই মজা পাবে",
  "তুই কি ভাবছিস সবাই চুপ থাকবে 😏? এবার না, রিয়্যাকশন দেখ",
  "ধুর! এত মজা করতে করতে সবাই ফেটে পড়বে 😹🔥",
  "হেই হেই! বট ডাকছিস 😎, এবার সত্যিই মাথা গরম হবে",
  "তুই কি মনে করছিস আমি সব সময় ধৈর্য রাখবো 😏? এবার না!",
  "আরেকবার বকবক করছিস 😹, এবার ফানি রিয়্যাকশন পাবে সবাই",
  "হুম, বট ডাকলে মজা + বকা একসাথে দিবো 😎, প্রস্তুত তো?",
  "তুই কি জানিস, সবাই তোর মজায় ফেটে পড়বে 😹, এবার দেখবি!",
  "ধুর, এত বকবক করতে করতে সবাই হাসি পাচ্ছে 😏",
  "হেই হেই! আবার বট কস 😎, এবার সত্যিই মজা আসবে",
  "তুই কি মনে করছিস আমি সব সময় চুপ থাকবো 😹? এবার না, ফানি রিয়্যাকশন দিবো",
  "আবার বকবক করছিস 😏, এবার সবাই মজা পাবে",
  "হুম, বট ডাকলে মাথা গরম হবে 😹, মজা হবে বেশি!",
  "তুই কি জানিস, আমি সব সময় হাসি আর বকা একসাথে দিবো 😎",
  "এত বট বকবক করছিস 😏, এবার সত্যিই চুপ করো!",
  "ধুর, মাথা গরম না হলে আমি লাফ দেবো 😹🔥",
  "হেই হেই, আবার বকবক? সবাই দেখছে, লজ্জা পাচ্ছিস নাকি?",
  "তুই কি ভাবছিস আমি সবসময় ধৈর্য রাখবো 😏? এবার না!",
  "আবার বট ডাকলে ফানি রিয়্যাকশন পাবি 😹, প্রস্তুত তো?",
  "হুম, এবার মজা করতে চাস 😎, তবে বকা খেতে হবে",
  "তুই কি জানিস, সবাই তোর মতো হাসবে না 😏, এবার দেখবি!",
  "ধুর, বারবার ডাকছিস 😹, এবার সত্যিই মজা আসবে",
  "হেই হেই! বট কস 😎, সবাই চোখ বড় করছে, দেখছো?",
  "আরেকবার বকবক করছিস 😏, এবার ফানি রিয়্যাকশন দিবো",
  "তুই কি বুঝলি, আমি সবসময় চুপ থাকবো 😹? এবার না!",
  "হুম, বট ডাকলে মাথা গরম হবে 😏, মজা হবে বেশি!",
  "ধুর, এত মজা করতে করতে সবাই ফেটে পড়বে 😹🔥",
  "হেই! আবার বট কস 😎, এবার সত্যিই হাসি আসবে",
  "তুই কি জানিস, আমি বারবার হাসি পাই 😹, এবার দেখবি!",
  "আবার মজা করতে চাস 😏? তবে বকা খেতে হবে 😎",
  "হুম, বট ডাকলে আমি লাফ দিয়ে মজা দেখাবো 😹, সবাই মজা পাবে",
  "তুই কি ভাবছিস সবাই চুপ থাকবে 😏? এবার না, রিয়্যাকশন দেখ",
  "ধুর! এত বকবক করতে করতে সবাই হাসি পাচ্ছে 😏",
  "হেই হেই! আবার বট কস 😎, এবার সত্যিই মাথা গরম হবে",
  "তুই কি মনে করছিস আমি সব সময় চুপ থাকবো 😹? এবার না, ফানি রিয়্যাকশন দিবো",
  "আবার বকবক করছিস 😏, এবার সবাই মজা পাবে",
  "হুম, বট ডাকলে মাথা গরম হবে 😹, মজা হবে বেশি!",
  "তুই কি জানিস, আমি সব সময় হাসি আর বকা একসাথে দিবো 😎",
  "ধুর! বট ডাকছিস 😏, এবার সত্যিই সবাই দেখবে",
  "হেই হেই, আবার মজা করতে চাস 😹, সাবধানে",
  "তুই কি বুঝলি, আমি সবসময় চুপ থাকবো 😏? এবার না!",
  "আবার বকবক করছিস 😹, এবার ফানি রিয়্যাকশন দিবো 😎",
  "হুম, বট ডাকলে মজা + বকা একসাথে পাবি 😏, প্রস্তুত তো?",
  "তুই কি জানিস, সবাই তোর মজায় ফেটে পড়বে 😹, এবার দেখবি!",
  "ধুর, বারবার ডাকছিস 😏, এবার সত্যিই হাসি আসবে",
  "হেই! আবার বট কস 😎, সবাই দেখছে, লজ্জা পাচ্ছিস নাকি?",
  "তুই কি মনে করছিস আমি সব সময় হাসি দিবো 😹? এবার না!",
  "আরেকবার বকবক করছিস 😏, এবার ফানি রিয়্যাকশন পাবে সবাই",
  "হুম, বট ডাকলে মাথা গরম হবে 😹, মজা হবে বেশি!",
  "তুই কি জানিস, আমি সব সময় হাসি আর বকা একসাথে দিবো 😎",
  "ধুর! এত বকবক করতে করতে সবাই ফেটে পড়বে 😹🔥",
  "হেই হেই! বট ডাকছিস 😏, এবার সত্যিই মজা আসবে",
  "তুই কি ভাবছিস সবাই চুপ থাকবে 😹? এবার না, রিয়্যাকশন দেখ",
  "আবার বকবক করছিস 😏, এবার সবাই মজা পাবে",
  "হুম, বট ডাকলে মাথা গরম হবে 😹, মজা হবে বেশি!",
  "হেই! তোমার এডমিনের চোখ পড়েছে কি জানিস? 😏",
  "ধুর! আবার মেসেজ, মনে হচ্ছে কেউ কফি খায়নি ☕😂",
  "ওহ হ্যাঁ 😹, তুমি এমন মজা করবে এটা ভাবিনি",
  "হুম, মনে হচ্ছে ফানি সেন্স চালু করা দরকার 😏🔥",
  "হেই! একটু থামো, অন্যরা তাড়া করছে 😎",
  "ধুর! এত মজা করতে করতে সবাই হেসে ফেটে পড়বে 😹",
  "ওহ! মনে হচ্ছে আজ সবাই ফানি মুডে 😏",
  "হেই হেই 😹, একটু চুপ কর, আমি লাফ দিয়ে রিয়্যাকশন দিবো",
  "হুম, সত্যিই কেউ এমন মজা করবে ভাবিনি 😏",
  "ধুর! এইটা দেখলে এডমিনও হেসে ফেলবে 😎",
  "ওহহ 😹, মনে হচ্ছে আজ হালকা এক্সট্রা ড্রামা শুরু",
  "হেই! রিয়্যাকশন দিতে দেরি করলে মজা হারাবে 😏",
  "হুম, মনে হচ্ছে কেউ গোপনভাবে মিম বানাচ্ছে 😂",
  "ধুর! আবার মেসেজ, এবার লাফ দিয়ে দেখাই 😹",
  "ওহ! আজ গ্রুপে একটু টেম্পার ফানি 😏🔥",
  "হেই হেই 😹, সবাই দেখছে, এবার লজ্জা পাবে",
  "হুম, মনে হচ্ছে মজা এক্সপ্লোড হতে চলেছে 😏",
  "ধুর! আবার মেসেজ, এবার রিয়্যাকশন দিতে হবে 😎",
  "ওহহ 😹, মনে হচ্ছে আজ ফানি + বকা একসাথে",
  "হেই! একটু থামো, সবাই নজর রাখছে 😏",
 " আকাশ ভাই গ্রুপের সব মেয়েরে I Love You করে 😁",
 ];

 const randomReply = greetings[Math.floor(Math.random() * greetings.length)];
      const mention = {
        body: `@${senderName} ${randomReply}`,
        mentions: [{
          tag: `@${senderName}`,
          id: senderID
        }]
      };

      return api.sendMessage(mention, event.threadID, (err, info) => {
        if (!err) {
          global.client.handleReply.push({
            name: module.exports.config.name,
            messageID: info.messageID,
            author: event.senderID,
            type: "simsimi"
          });
        }
      }, event.messageID);
    }

    if (
      raw.startsWith("baby ") || raw.startsWith("bot ") || raw.startsWith("bby ") ||
      raw.startsWith("jannu ") || raw.startsWith("xan ") ||
      raw.startsWith("বেপি ") || raw.startsWith("বট ") || raw.startsWith("বেবি ")
    ) {
      const query = raw
        .replace(/^baby\s+|^bot\s+|^bby\s+|^jan\s+|^xan\s+|^জান\s+|^বট\s+|^বেবি\s+/i, "")
        .trim();
      if (!query) return;

      const res = await axios.get(`${simsim}/simsimi?text=${encodeURIComponent(query)}&senderName=${encodeURIComponent(senderName)}`);
      const responses = Array.isArray(res.data.response) ? res.data.response : [res.data.response];
      
      for (const reply of responses) {
        await new Promise((resolve) => {
          api.sendMessage(reply, event.threadID, (err, info) => {
            if (!err) {
              global.client.handleReply.push({
                name: module.exports.config.name,
                messageID: info.messageID,
                author: event.senderID,
                type: "simsimi"
              });
            }
            resolve();
          }, event.messageID);
        });
      }
    }
  } catch (err) {
    console.error(err);
    return api.sendMessage(`| Error in handleEvent: ${err.message}`, event.threadID, event.messageID);
  }
};
