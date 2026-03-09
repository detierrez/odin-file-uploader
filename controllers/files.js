const path = require("node:path");
const prisma = require("../lib/prisma");

module.exports.getFile = async (req, res, next) => {
  const id = Number(req.params.id);
  const file = await prisma.file.findUnique({ where: { id } });
  const superFolders = await prisma.$queryRaw`
    WITH RECURSIVE folder_tree AS (
      SELECT 
          id, 
          name, 
          "parentFolderId"
      FROM "Folder"
      WHERE id = ${file.folderId}
      UNION ALL
      SELECT 
          f.id, 
          f.name, 
          f."parentFolderId"
      FROM "Folder" f
      INNER JOIN folder_tree ft ON f.id = ft."parentFolderId"
    )
    SELECT * FROM folder_tree;
    `;
  superFolders.reverse();
  return res.render("html", { view: "file", superFolders, file });
};

module.exports.downloadFile = async (req, res, next) => {
  const id = Number(req.params.id);
  const file = await prisma.file.findUnique({ where: { id } });
  res.download(path.join(__dirname, `..`, file.path), file.name);
};

module.exports.hasAccess = (req, res, next) => {
  const id = Number(req.params.id);
  const hasAccess = req.user.files.some((file) => file.id === id);
  if (hasAccess) return next();

  next("Error: Not access");
};
