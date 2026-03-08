const path = require("node:path");
const prisma = require("../lib/prisma");

module.exports.getFile = async (req, res, next) => {
  const { id } = req.params;
  const file = await prisma.file.findUnique({ where: { id: Number(id) } });
  return res.render("html", { view: "file", file });
};

module.exports.downloadFile = async (req, res, next) => {
  const { id } = req.params;
  const file = await prisma.file.findUnique({ where: { id: Number(id) } });
  res.download(path.join(__dirname, `..`, file.path), file.name);
};
