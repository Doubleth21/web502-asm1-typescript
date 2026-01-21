import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Course {
  id: number;
  name: string;
  credit: number;
  category: string;
  teacher: string;
}

function ListPage() {
  const [items, setItems] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [teacherFilter, setTeacherFilter] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/courses")
      .then((res) => res.json())
      .then((data) => {
        setItems(data ?? []);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Xác nhận xoá mục này?")) return;
    try {
      const res = await fetch(`http://localhost:3000/courses/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setItems((prev) => prev.filter((it) => it.id !== id));
    } catch (err) {
      alert("Xoá thất bại. Kiểm tra server hoặc console để biết thêm chi tiết.");
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Danh sách sản phẩm</h1>

      <div className="mb-4 flex flex-col md:flex-row md:items-center md:gap-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm theo tên..."
          className="w-full md:w-1/2 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={teacherFilter}
          onChange={(e) => setTeacherFilter(e.target.value)}
          className="w-full md:w-1/4 border rounded-lg px-3 py-2 mt-3 md:mt-0"
        >
          <option value="">Tất cả giảng viên</option>
          {Array.from(new Set(items.map((it) => it.teacher)))
            .sort()
            .map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border border-gray-300 text-left">ID</th>
              <th className="px-4 py-2 border border-gray-300 text-left">Tên</th>
              <th className="px-4 py-2 border border-gray-300 text-left">Tín chỉ</th>
              <th className="px-4 py-2 border border-gray-300 text-left">Danh mục</th>
              <th className="px-4 py-2 border border-gray-300 text-left">Giảng viên</th>
              <th className="px-4 py-2 border border-gray-300 text-left">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center">
                  Đang tải...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center">
                  Không có sản phẩm
                </td>
              </tr>
            ) : (
              items
                .filter((it) =>
                  it.name.toLowerCase().includes(query.trim().toLowerCase()) &&
                  (teacherFilter === "" || it.teacher === teacherFilter)
                )
                .map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border border-gray-300">{item.id}</td>
                  <td className="px-4 py-2 border border-gray-300">{item.name}</td>
                  <td className="px-4 py-2 border border-gray-300">{item.credit}</td>
                  <td className="px-4 py-2 border border-gray-300">{item.category}</td>
                  <td className="px-4 py-2 border border-gray-300">{item.teacher}</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/products/edit/${item.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        Sửa
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:underline"
                      >
                        Xoá
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ListPage;
