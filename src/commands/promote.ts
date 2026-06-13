import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { checkPermission } from "../utils/checkPermission";

export const data = new SlashCommandBuilder()
  .setName("promote")
  .setDescription("Promote a user by adding/removing roles")
  .addUserOption(option =>
    option.setName("user").setDescription("User to promote").setRequired(true)
  )
  .addRoleOption(option =>
    option.setName("role_add").setDescription("Role to add").setRequired(true)
  )
  .addRoleOption(option =>
    option.setName("role_remove").setDescription("Role to remove").setRequired(false)
  )
  .addStringOption(option =>
    option.setName("reason").setDescription("Reason for promotion").setRequired(false)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles);

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!(await checkPermission(interaction, PermissionFlagsBits.ManageRoles))) {
    await interaction.reply({
      content: "You don't have permission to manage roles.",
      ephemeral: true,
    });
    return;
  }

  const user = interaction.options.getUser("user", true);
  const roleAdd = interaction.options.getRole("role_add");
  const roleRemove = interaction.options.getRole("role_remove");
  const reason = interaction.options.getString("reason") || "No reason provided";

  try {
    const member = await interaction.guild?.members.fetch(user.id);
    if (!member) {
      await interaction.reply({ content: "User not found.", ephemeral: true });
      return;
    }

    if (roleAdd) await member.roles.add(roleAdd as any, reason);
if (roleRemove) await member.roles.remove(roleRemove as any, reason);

    await interaction.reply({
      content: `${user.tag} roles updated. Reason: ${reason}`,
      ephemeral: false,
    });
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "Failed to update roles.",
      ephemeral: true,
    });
  }
}