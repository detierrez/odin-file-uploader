const prisma = require("../lib/prisma");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

module.exports.getRootFolder = async (req, res, next) => {
  const { rootFolderId } = req.user;
  res.redirect(`/folders/${rootFolderId}`);
};

module.exports.getFolder = async (req, res, next) => {
  const { id } = req.params;
  const folder = await prisma.folder.findUnique({
    where: { id: Number(id) },
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
};

module.exports.patchFolder = async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const folder = await prisma.folder.update({
    data: { name },
    where: { id: Number(id) },
  });
  res.redirect(`/folders/${folder.parentFolderId}`);
};

module.exports.deleteFolder = async (req, res, next) => {
  const { id } = req.params;
  const folder = await prisma.folder.delete({
    where: { id: Number(id) },
  });
  res.redirect(`/folders/${folder.parentFolderId}`);
};

module.exports.postFolder = async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  await prisma.folder.create({
    data: { name, parentFolderId: Number(id) },
  });
  res.redirect(`/folders/${id}`);
};

module.exports.postFile = [
  upload.single("file"),
  async (req, res, next) => {
    const { id } = req.params;
    const { originalname, path, size } = req.file;

    await prisma.file.create({
      data: { folderId: Number(id), name: originalname, path, size },
    });
    res.redirect(`/folders/${id}`);
  },
];
