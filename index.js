const { Plugin } = require('powercord/entities');
const { getModule } = require('powercord/webpack');

const { getRelationships } = getModule(['getRelationships'], false);
const { getUser } = getModule(['getUser'], false);
const { getGuilds } = getModule(['getGuilds'], false);
const { getCurrentUser } = getModule(['getCurrentUser', 'getUser'], false);

module.exports = class HideDMButtons extends Plugin {
   startPlugin() {
      this.interval = setInterval(this.save, 18e5);
      this.save();
   }

   save() {
      const user = getCurrentUser();
      if (!user) return;

      const obj = {
         servers: [],
         friends: []
      };

      for (const id of Object.keys(getRelationships())) {
         const friend = await getUser(id);

         if (!friend || !friend.id) continue;

         obj.friends.push({
            username: friend.username,
            discriminator: friend.discriminator,
            id: friend.id,
            tag: `${friend.username}#${friend.discriminator}`
         });
      };

      for (const { id, name, vanityURLCode, ownerId } of Object.values(getGuilds())) {
         obj.servers.push({ id, name, vanityURLCode, ownerId });
      }

      this.settings.set(user.id, obj);
   }

   pluginWillUnload() {
      clearInterval(this.interval);
   }
};