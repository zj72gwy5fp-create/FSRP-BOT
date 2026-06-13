import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { checkPermission } from "../utils/checkPermission";

export default {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a member")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to kick")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Reason for kick")
        .setRequired(false)
    ),

  async execute(interaction: CommandInteraction) {
    if (!(await checkPermission(interaction))) return;

    const user = interaction.options.getUser("user", true);
    const reason = interaction.options.getString("reason") || "No reason provided";

    if (!interaction.guild) {
      await interaction.reply("❌ This command can only be used in a server");
      return;
    }

    try {
      const member = await interaction.guild.members.fetch(user.id);
      await member.kick(reason);
      await interaction.reply(`✅ ${user.tag} has been kicked. Reason: ${reason}`);
    } catch (error) {
      await interaction.reply({
        content: "❌ Failed to kick user. Check permissions.",
        ephemeral: true,
      });
      console.error("Error kicking user:", error);
    }
  },
};
