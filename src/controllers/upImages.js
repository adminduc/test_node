import cloudinary from "../config/cloudinary";

export const uploadImage = async (req, res) => {
  const images = req.files.map((file) => file.path);
  return res.json({ urls: images });

  console.log(images);
  let i = 0;
  const uploadedImages = [];
  i++;
  console.log("Mấy lần", i);
  for (const image of images) {
    try {
      const result = await cloudinary.uploader.upload(image);
      // console.log(result);
      console.log("Thanh cong");
      uploadedImages.push({
        url: result.secure_url,
        publicId: result.public_id,
      });
    } catch (error) {
      //   console.log("That bai");
      console.log(error);
    }
  }
  return res.json({ urls: uploadedImages });
};

export const deleteImage = async (req, res) => {
  const publicId = req.params.publicId;
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    res.status(200).json({ message: "Xóa ảnh thành công", result });
  } catch (error) {
    res.status(500).json({ error: "Error deleting image" });
  }
};
export const updateImage = async (req) => {
  return res.json({ urls: "ok" });
  const publicId = req.params.publicId; // Lấy publicId của ảnh cần cập nhật
  const newImage = req.files[0].path; // Lấy đường dẫn của ảnh mới

  try {
    // Upload ảnh mới lên Cloudinary
    const result = await cloudinary.uploader.upload(newImage);

    // Xóa ảnh cũ với publicId tương ứng
    await cloudinary.uploader.destroy(publicId);

    // Trả về kết quả với url và publicId của ảnh mới
    return res.json({ url: result.secure_url, publicId: result.public_id });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error updating image" });
  }
};
