export default async (req, res) => {
  if (!req.body["avatar_url"]) {
    return res.status(400).json({ error: "No avatar url given" });
  }
  return res
    .status(200)
    .send({
      avatar_image_url: `${process.env.NEXT_PUBLIC_BACKEND_API}/public/avatars/${req.body.avatar_url}`,
    });
};
