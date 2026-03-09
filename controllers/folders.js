const prisma = require("../lib/prisma");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

module.exports.getRootFolder = async (req, res, next) => {
  const { rootFolderId } = req.user;
  res.redirect(`/folders/${rootFolderId}`);
};

module.exports.getFolder = [
  async (req, res, next) => {
    const id = Number(req.params.id);
    const folder = await prisma.folder.findUnique({
      where: { id },
      include: { subFolders: true, files: true },
    });
    const superFolders = await prisma.$queryRaw`
    WITH RECURSIVE folder_tree AS (
      SELECT 
          id, 
          name, 
          "parentFolderId"
      FROM "Folder"
      WHERE id = ${folder.parentFolderId}
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
    res.render("html", { view: "folder", folder, superFolders });
  },
];

module.exports.patchFolder = async (req, res, next) => {
  const id = Number(req.params.id);
  const { name } = req.body;
  const folder = await prisma.folder.update({
    data: { name },
    where: { id },
  });
  res.redirect(`/folders/${folder.parentFolderId}`);
};

module.exports.deleteFolder = async (req, res, next) => {
  const id = Number(req.params.id);
  const folder = await prisma.folder.delete({
    where: { id },
  });
  res.redirect(`/folders/${folder.parentFolderId}`);
};

module.exports.postFolder = async (req, res, next) => {
  const id = Number(req.params.id);
  const { name } = req.body;
  await prisma.folder.create({
    data: { ownerId: req.user.id, name, parentFolderId: id },
  });
  res.redirect(`/folders/${id}`);
};

module.exports.postFile = [
  upload.single("file"),
  async (req, res, next) => {
    const id = Number(req.params.id);
    const { originalname, path, size } = req.file;

    await prisma.file.create({
      data: {
        ownerId: req.user.id,
        folderId: id,
        name: originalname,
        path,
        size,
      },
    });
    res.redirect(`/folders/${id}`);
  },
];

module.exports.hasAccess = (req, res, next) => {
  const id = Number(req.params.id);
  const hasAccess = req.user.folders.some((folder) => folder.id === id);
  if (hasAccess) return next();

  next("Error: Not access");
};
