import ClientProductCard from "../../../components/client/ClientProductCard";
import { useState, useEffect } from "react";
import { GetAllProduct, ProductSort } from "../../../services/product";
import { GetAllCategory } from "../../../services/categories";
import { Link } from "react-router-dom";
import { ICategory } from "../../../types/category";
import { IProduct } from "../../../types/product";
import { GetOneCategory } from "../../../services/categories";
import { Divider } from "antd";
const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    onHandleGetAllProduct();
  }, []);
  async function onHandleGetAllProduct() {
    try {
      const { data } = await GetAllProduct();
      setProducts(data);
      const res = await GetAllCategory();
      setCategory(res.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }
  async function onHandleSortProduct(value: string) {
    try {
      const resPro = await ProductSort(String(value));
      setProducts(resPro.data);
      const res = await GetAllCategory();
      setCategory(res.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }
  async function onHandleGetOneCategory(id: string) {
    try {
      const resPro = await GetOneCategory(String(id));
      setProducts(resPro.data.products);
      const res = await GetAllCategory();
      setCategory(res.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }
  if (loading) return <div>Loading ...</div>;
  return (
    <section>
      <aside className="max-w-[1170px] m-auto">
        <img
          src="https://file.hstatic.net/1000376021/file/1920x720_copy__4___1__451089634ed34e8d9332d622db6c9c0d.png"
          alt=""
        />
      </aside>
      <aside className="flex max-w-[1170px] w-full m-auto py-7">
        <div className="order-1 w-3/12">
          <div>
            <h3 className="text-2xl font-bold">Danh mục</h3>
          </div>
          <div className="py-3">
            <Link to={`/products`}>
              <div
                onClick={() => onHandleGetAllProduct()}
                className="font-medium text-[14px] cursor-pointer uppercase"
              >
                Tất cả sản phẩm
              </div>
            </Link>
            {category?.map((category: ICategory, index) => (
              <div
                key={index}
                onClick={() => onHandleGetOneCategory(category._id)}
                className="font-medium text-[14px] uppercase cursor-pointer py-[1px]"
              >
                {category.name}
              </div>
            ))}
          </div>
        </div>
        <div className="order-2 w-3/4">
          <div className="flex justify-between">
            <div>
              <h3 className="text-2xl font-bold">Tất cả sản phẩm</h3>
            </div>
            <div>
              <select
                name=""
                id=""
                className="bottom-1 border-cyan-950"
                defaultValue={"1"}
                onChange={(e) => onHandleSortProduct(String(e.target.value))}
              >
                <option value="new">Sản phẩm mới nhất</option>
                <option value="old">Sản phẩm cũ nhất</option>
                <option value="az">Lọc theo tên A - Z</option>
                <option value="za">Lọc theo tên Z - A</option>
              </select>
            </div>
          </div>
          {products.length > 0 ? (
            <section className="grid grid-cols-3 gap-7 py-4">
              {products?.map((product: IProduct, index) => (
                <ClientProductCard
                  key={index}
                  _id={product._id}
                  name={product.name}
                  price={product.price}
                  imageUrl={product.images[0]}
                />
              ))}
            </section>
          ) : (
            <div className="w-full text-center">
              <h3 className="text-xl font-medium py-10">
                Không có sản phẩm nào
              </h3>
            </div>
          )}
        </div>
      </aside>
    </section>
  );
};

export default ProductPage;
