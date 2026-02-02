import React, { useState } from 'react'
import axios from 'axios'

type LoginForm = {
  email: string
  password: string
}

type User = {
  id: number
  name: string
  email: string
  password: string
}

const LoginPage: React.FC = () => {
  const [form, setForm] = useState<LoginForm>({ email: '', password: '' })
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as keyof LoginForm
    const value = e.target.value
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError('Email không hợp lệ.')
      return
    }
    if (!form.password) {
      setError('Mật khẩu không được để trống.')
      return
    }

    try {
      const base = 'http://localhost:3000'
      const resp = await axios.get<User[]>(`${base}/users`, { params: { email: form.email, password: form.password } })
      const user = resp.data && resp.data.length ? resp.data[0] : null
      if (!user) {
        setError('Thông tin đăng nhập không chính xác.')
        return
      }

      localStorage.setItem('currentUser', JSON.stringify({ id: user.id, name: user.name, email: user.email }))
      window.dispatchEvent(new Event('auth'))
      setSuccess('Đăng nhập thành công.')
      setForm({ email: '', password: '' })
    } 
  
    catch (err) {
      console.error(err)
      setError('Đã có lỗi xảy ra. Vui lòng thử lại.')
    }
  }
  return (
    <div style={{ maxWidth: 480, margin: '24px auto', padding: 16 }}>
      <h2>Đăng nhập</h2>
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      {success && <div style={{ color: 'green', marginBottom: 12 }}>{success}</div>}
      <form onSubmit={handleSubmit} noValidate>
        <div style={{ marginBottom: 12 }}>
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} style={{ width: '100%', padding: 8 }} />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Mật khẩu</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} style={{ width: '100%', padding: 8 }} />
        </div>

        <button type="submit" style={{ padding: '8px 16px' }}>
          Đăng nhập
        </button>
      </form>
    </div>
  )
}

export default LoginPage
