// utils/helpers.js
export const maskEmail = (email) => {
  if (!email) return "";
  const [local, domain] = email.split("@");
  if (!domain) return email;
  if (local.length <= 3) return `***@${domain}`;
  const firstPart = local.slice(0, 2);
  const lastPart = local.slice(-1);
  return `${firstPart}***${lastPart}@${domain}`;
};

export const maskPhone = (phone) => {
  if (!phone) return "";
  if (phone.length <= 5) return "****";
  const last = phone.slice(-2);
  return `*********${last}`;
};
