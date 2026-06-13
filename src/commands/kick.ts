import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { checkPermission } from "../utils/checkPermission";

export const data = new SlashCommandBuilder()
  .setName("kick")
  .setDescription("Kick a user from the server")
  .addUserOption(option =>
    option.setName("user").setDescription("User to kick").setRequired(true)
  )
  .addStringOption(option =>
    option.setName("reason").setDescription("Reason for kick").setRequired(false)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers);

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!(await checkPermission(interaction, PermissionFlagsBits.KickMembers))) {
    await interaction.reply({
      content: "You don't have permission to kick members.",
      ephemeral: true,
    });
    return;
  }

  const user = interaction.options.getUser("user", true);
  const reason = interaction.options.getString("reason") || "No reason provided";

  try {
    const member = await interaction.guild?.members.fetch(user.id);
    if (!member) {
      await interaction.reply({ content: "User not found.", ephemeral: true });
      return;
    }

    await member.kick(reason);
    await interaction.reply({
      content: `${user.tag} has been kicked. Reason: ${reason}`,
      ephemeral: false,
    });
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "Failed to kick user.",
      ephemeral: true,
    });
  }
}