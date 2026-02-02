import { Toaster } from "react-hot-toast";
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ListPage from "./pages/List";
import AddPage from "./pages/Add";
import EditPage from "./pages/Edit";
import RegisterPage from "./pages/Register";
import LoginPage from "./pages/Login";

function App() {
  type User = { id: number; name: string; email: string }
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const v = localStorage.getItem('currentUser')
      return v ? JSON.parse(v) as User : null
    } catch {
      return null
    }
  })
  const navigate = useNavigate()

  useEffect(() => {
    const sync = () => {
      try {
        const v = localStorage.getItem('currentUser')
        setCurrentUser(v ? JSON.parse(v) : null)
      } catch {
        setCurrentUser(null)
      }
    }

    window.addEventListener('storage', sync)
    window.addEventListener('auth', sync)
    return () => {
      window.removeEventListener('storage', sync)
      window.removeEventListener('auth', sync)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    window.dispatchEvent(new Event('auth'))
    setCurrentUser(null)
    navigate('/login')
  }
  return (
    <>
      <nav className="bg-blue-600 text-white shadow">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="" className="text-xl font-semibold">
            <strong>WEB502 App</strong>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="" className="hover:text-gray-200">
              Trang chủ
            </Link>
            <Link to="/products" className="hover:text-gray-200">
              Danh sách
            </Link>
            <Link to="/products/add" className="hover:text-gray-200">
              Thêm mới
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {currentUser ? (
              <>
                <span className="mr-4">Xin chào, <strong>{currentUser.name}</strong></span>
                <button onClick={handleLogout} className="hover:text-gray-200">Đăng xuất</button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-gray-200">
                  Đăng nhập
                </Link>
                <Link to="/register" className="hover:text-gray-200">
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto mt-10 px-4">
        <Routes>
          <Route
            path="/"
            element={
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">Chào mừng đến với WEB502</h1>
              </div>
            }
          />
          <Route path="/products" element={<ListPage />} />
          <Route path="/products/add" element={<AddPage />} />
          <Route path="/products/edit/:id" element={<EditPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>

      <Toaster />
    </>
  );
}

export default App;
