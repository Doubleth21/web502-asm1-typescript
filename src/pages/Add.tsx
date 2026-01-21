import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function AddPage() {
  const [name, setName] = useState("");
  const [credit, setCredit] = useState<number | "">("");
  const [category, setCategory] = useState("");
  const [teacher, setTeacher] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Vui lòng nhập tên");
      return;
    }
    setSubmitting(true);
    try {
      const body = {
        name: name.trim(),
        credit: Number(credit) || 0,
        category: category.trim(),
        teacher: teacher.trim(),
      };

      const res = await fetch("http://localhost:3000/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("POST failed");
      toast.success("Thêm thành công");
      navigate("/products");
    } catch (err) {
      console.error(err);
      toast.error("Thêm thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Thêm mới</h1>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className="block font-medium mb-1">
            Tên
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="credit" className="block font-medium mb-1">
            Tín chỉ
          </label>
          <input
            id="credit"
            value={credit}
            onChange={(e) => setCredit(e.target.value === "" ? "" : Number(e.target.value))}
            type="number"
            min={0}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="category" className="block font-medium mb-1">
            Danh mục
          </label>
          <input
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            type="text"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="teacher" className="block font-medium mb-1">
            Giảng viên
          </label>
          <input
            id="teacher"
            value={teacher}
            onChange={(e) => setTeacher(e.target.value)}
            type="text"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {submitting ? "Đang lưu..." : "Lưu"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/products")}
            className="px-4 py-2 border rounded"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddPage;
