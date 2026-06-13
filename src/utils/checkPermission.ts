import { ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";

export async function checkPermission(
  interaction: ChatInputCommandInteraction,
  permission: bigint = PermissionFlagsBits.Administrator
): Promise<boolean> {
  if (!interaction.memberPermissions) return false;
  return interaction.memberPermissions.has(permission);
}