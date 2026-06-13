import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { checkPermission } from "../utils/checkPermission";

export default {
  data: new SlashCommandBuilder()
    .setName("promote")
    .setDescription("Promote a member")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to promote")
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName("role_add")
        .setDescription("Role to add")
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName("role_remove")
        .setDescription("Role to remove (optional)")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Reason for promotion")
        .setRequired(false)
    ),

  async execute(interaction: CommandInteraction) {
    if (!(await checkPermission(interaction))) return;

    const user = interaction.options.getUser("user", true);
    const roleAdd = interaction.options.getRole("role_add", true);
    const roleRemove = interaction.options.getRole("role_remove");
    const reason = interaction.options.getString("reason") || "No reason provided";

    if (!interaction.guild) {
      await interaction.reply("❌ This command can only be used in a server");
      return;
    }

    try {
      const member = await interaction.guild.members.fetch(user.id);

      // Add role
      await member.roles.add(roleAdd, reason);

      // Remove role if specified
      if (roleRemove) {
        await member.roles.remove(roleRemove, reason);
      }

      const removeText = roleRemove ? ` and removed ${roleRemove}` : "";
      await interaction.reply(
        `✅ ${user.tag} has been promoted. Added ${roleAdd}${removeText}. Reason: ${reason}`
      );
    } catch (error) {
      await interaction.reply({
        content: "❌ Failed to promote user. Check permissions.",
        ephemeral: true,
      });
      console.error("Error promoting user:", error);
    }
  },
};
