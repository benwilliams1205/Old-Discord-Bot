const Discord = require("discord.js");
const config = require("./config.json");

const TOKEN = config.Token;
const PREFIX = ";";

var bot = new Discord.Client();

bot.on("ready", function(){
    console.log("Ready")
    bot.user.setGame("Use ;help for help")
    bot.user.setUsername("Bot")
    bot.user.setStatus("online")
    //bot.user.setAvatar("https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/e9/e9eb506d861d45af8801c416e5037d1cf463ce8a_full.jpg")
    console.log(`Ready in ${bot.channels.size} channels on ${bot.guilds.size} servers, for a total of ${bot.users.size} users.`);
    bot.user.setGame(`on ${bot.guilds.size} servers`);
});

bot.on('messageDelete', message => {
  if(message.author.bot) return;
  var embed3 = new Discord.RichEmbed()
  .setTitle("Message deleted!")
  .addField("User", message.author.toString() + ' <' + message.author.id.toString() + '>')
  .addField("Channel", message.channel.name.toString() + ' <' + message.channel.id.toString() + '>')
  .addField("Message", message.cleanContent)
  .setColor(0xFF0000)
  .setFooter("destinybot", "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/e9/e9eb506d861d45af8801c416e5037d1cf463ce8a_full.jpg")
  .setTimestamp()
  message.guild.channels.find("name", "logs").send(embed3); 
});

bot.on('messageUpdate', function(oldmessage, newmessage) {
  if(newmessage.author.bot) return;
  var embed5 = new Discord.RichEmbed()
  .setTitle("Message was updated!")
  .addField("User", newmessage.author.toString() + ' <' + newmessage.author.id.toString() + '>')
  .addField("Channel", newmessage.channel.name.toString() + ' <' + newmessage.channel.id.toString() + '>')
  .addField("Message was", oldmessage.cleanContent)
  .addField("Message is now", newmessage.content.toString())
  .setColor(0xFF0000)
  .setFooter("destinybot", "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/e9/e9eb506d861d45af8801c416e5037d1cf463ce8a_full.jpg")
  .setTimestamp()
  newmessage.guild.channels.find("name", "logs").send(embed5);
})


bot.on("message", function(message) {
    if (message.author.equals(bot.user)) return;

    if (!message.content.startsWith(PREFIX)) return;

    var args = message.content.substring(PREFIX.length).split(" ");

    switch (args[0].toLowerCase()) {
        case "ping":
            message.channel.send("pong");
            console.log("pong-ed " + message.author.username);
            break;
        case "info":
            message.channel.send("This bot is made by Destiny#9470/Ben and is used for moderation and message logging. If you have any feature recommendations please feel free to DM me.");
            break;
        case "eval":
        var code = message.content.split(" ").slice(1).join(" ");
        if(message.author.id !== config.ownerID) return;
            try {
                var evaled = eval(code);
                
                if(evaled instanceof Object)
                    evaled = JSON.stringify(evaled);   
                    
                var eval2 = new Discord.RichEmbed()
                .setTitle("Eval Code")
                .addField("Input:", '```js\n' + message.content + '\n```')
                .addField('Output:', '```js\n' + clean(evaled) + '\n```')
                .setColor(0xFF0000)
                .setFooter("destinybot", "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/e9/e9eb506d861d45af8801c416e5037d1cf463ce8a_full.jpg")
                .setTimestamp()
                message.channel.send(eval2);
            }
            catch(err) {
              var eval3 = new Discord.RichEmbed()
                .setTitle("Failed to Eval Code")
                .addField("Error Code", '```js\n' + clean(err).toString() + '\n```')
                .setColor(0xFF0000)
                .setFooter("destinybot", "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/e9/e9eb506d861d45af8801c416e5037d1cf463ce8a_full.jpg")
                .setTimestamp()
                message.channel.send(eval3);

            }
        break;
        case "enablelogs":
            if (!message.guild.me.hasPermission("MANAGE_CHANNELS"))
                return message.reply("I don't have permissions to make a logs channel");
            message.channel.send("This is creating a new 'logs' channel")
            message.guild.createChannel("logs", "text")
        break;
        case "purge":
            const modRole2 = message.guild.roles.find("name", "admin");
                if (!message.guild.me.hasPermission("MANAGE_MESSAGES"))
                		return message.reply("I do not have permissions to manage messages.");
                if (!message.member.roles.has(modRole2.id))
              			return message.reply("You can't use this command.");
            const messagecount = parseInt(args.join(' '));
            message.channel.fetchMessages({
              limit: messagecount
            }).then(messages => message.channel.bulkDelete(messages));
        break;
        case "help":
              var help = new Discord.RichEmbed()
              .setTitle("Help")
              .addField("Ping", "Basic ping command to see if the bot is still online")
              .addField("Info", "Bot information")
              .addField("Enablelogs", "Creates 'logs' channel and prints message delete and update logs")
              .addField("Purge", "Purges the last 50 messages sent to the channel executed in")
              .addField("Help", "The page you're viewing right now!")
              .addField("Kick", "Kicks a user when they're mentioned")
              .setColor(0xFF0000)
              .setFooter("destinybot", "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/e9/e9eb506d861d45af8801c416e5037d1cf463ce8a_full.jpg")
              .setTimestamp()
              message.channel.send(help);
        break;
        case "kick":

            const modRole = message.guild.roles.find("name", "admin");
            if (!modRole)
             return message.reply("Mod role does not exist.")
            
            if (!message.member.roles.has(modRole.id))
              return message.reply("You can't use this command.");
      
            if (message.mentions.users.size === 0) {
             return message.reply("Please mention a user to kick")};
      
            if (!message.guild.me.hasPermission("KICK_MEMBERS"))
              return message.reply("");

            const kickMember = message.mentions.members.first();

      
            kickMember.kick(member => {
              message.reply(`${member.user.username} was succesfully kicked.`);
            });
        break;
        case "bans":
                bot.getBans(message.channel.server,function(error,users){
			            if(users.length == 0){
				        message.channel.send("No one has been banned from this server!");
			        } else {
				        var response = "Banned users:";
				        for(var user in users){
					        response += "\n" + user.username;
				        }
				        message.channel.send(response);
			        }
                });
        break;
        default:
            message.channel.send("Invalid Command");
    }
});

bot.on("guildCreate", guild => {
    // This event triggers when the bot joins a guild.
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
    bot.user.setGame(`on ${bot.guilds.size} servers`);
  });

bot.on("guildMemberAdd", (member) => {
  console.log('New user ' + member.user.username + 'has joined ' + member.guild.name);
  member.guild.channels.find("name", "logs").send("New user " + member.user.username + " has joined the server");
});

bot.login(TOKEN);

function clean(text) {
  if (typeof(text) === "string") {
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  }
  else {
      return text;
  }
}
