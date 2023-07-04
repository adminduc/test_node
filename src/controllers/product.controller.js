function ProductController() {
  this.get = (req, res) => {
    try {
      return res.status(200).json({
        message: "Lấy thành công !",
      });
    } catch (error) {
      return res.status(400).json(error);
    }
  };

  return this;
}
module.exports = ProductController();
